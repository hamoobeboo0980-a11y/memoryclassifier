async function analyzeImage(base64, previewSrc) {
  if (isAnalyzing) return;
  isAnalyzing = true;
  lastBase64 = base64;
  resetLEDs();
  startLEDAnimation();
  startScanBar();
  showLoading(true);
  showResult(false);
  showError(false);

  // ═══════════════════════════════════════════════════════
  // PARALLEL INTELLIGENCE SYSTEM v20
  // Confidence Arbitration - أعلى confidence تكسب
  // ═══════════════════════════════════════════════════════
  var raceWon = false;
  var abortOCR = new AbortController();
  var abortGemini = new AbortController();
  var startTime = Date.now();
  var CONFIDENCE_THRESHOLD = 70;
  var bestResult = null;
  var bestConfidence = 0;
  var bestSource = '';

  // Validation Gate - التحقق من صحة النتيجة
  function validateResult(parsed) {
    if (!parsed || !parsed.code) return false;
    if (!isValidCode(parsed.code)) return false;
    if (parsed.storage && parsed.type) return true;
    if (parsed.code && parsed.code.length >= 4) return true;
    return false;
  }

  function submitWinner(parsed, source) {
    if (raceWon) return false;
    raceWon = true;
    var elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
    var conf = parsed.confidence || 0;
    console.log('🏆 WINNER: ' + source + ' (conf=' + conf + ') في ' + elapsed + 's');

    // Hard abort - إلغاء حقيقي لكل fetch requests
    try { abortOCR.abort(); } catch(e) {}
    try { abortGemini.abort(); } catch(e) {}

    stopLEDAnimation();
    if (parsed.step) lightLED(parsed.step);

    lastParsed = parsed;
    var detectedCode = parsed.code || '';
    currentCode = detectedCode;
    var manualInput = document.getElementById('manualCode');
    if (manualInput) manualInput.value = detectedCode;

    if (parsed.storage && parsed.type) {
      stopScanBar(true);
      updateStats(parsed.company, true);
      showLoading(false);
      displayResult(detectedCode, {
        storage: parsed.storage,
        type: parsed.type,
        ram: parsed.ram || null,
        capacity: parsed.storage + (parsed.type === 'عادي' ? '+?' : '')
      }, parsed.company);
      document.getElementById('confirmActions').style.display = 'flex';
      document.getElementById('correctionForm').style.display = 'none';
      sessionCount++;
      document.getElementById('sessionCount').textContent = sessionCount;
      var dot = document.getElementById('statusDot');
      var txt = document.getElementById('statusText');
      var confColor = conf >= 90 ? '#00e676' : conf >= 70 ? '#00ff88' : '#ffab00';
      if (dot) { dot.style.background = confColor; dot.style.boxShadow = '0 0 10px ' + confColor; }
      if (txt) txt.textContent = '✅ ' + source + ' (' + elapsed + 's) [' + conf + '%]';
      var sourceInfo = parsed.suggestion ? ' (تصحيح: ' + parsed.suggestion + ')' : '';
      addChatMsg('المساعد', '✅ ' + detectedCode + ' - ' + parsed.storage + 'GB ' + parsed.type + sourceInfo + ' [' + source + ' ' + elapsed + 's 🎯' + conf + '%] - صح ولا غلط؟', 'bot');
    } else {
      stopScanBar(false);
      updateStats(parsed.company, false);
      showLoading(false);
      displayResult(detectedCode, null, parsed.company);
      document.getElementById('confirmActions').style.display = 'none';
      document.getElementById('correctionForm').style.display = 'block';
      sessionCount++;
      document.getElementById('sessionCount').textContent = sessionCount;
      addChatMsg('المساعد', '⚠️ كود جديد: ' + detectedCode + ' - اكتب المساحة والنوع [' + source + ' ' + elapsed + 's]', 'bot');
    }
    isAnalyzing = false;
    unfreezeCamera();
    if (stream && cameraActive) setTimeout(startAutoAnalysis, 2000);
    return true;
  }

  // Confidence Arbitration: لو فوق الحد → اقبلها فوراً
  function handleCandidate(parsed, source) {
    if (raceWon) return false;
    if (!validateResult(parsed)) return false;
    var conf = parsed.confidence || 0;
    console.log('📊 Candidate: ' + source + ' conf=' + conf + ' code=' + (parsed.code || ''));
    
    if (conf >= CONFIDENCE_THRESHOLD && parsed.storage && parsed.type) {
      return submitWinner(parsed, source);
    }
    
    if (conf > bestConfidence) {
      bestResult = parsed;
      bestConfidence = conf;
      bestSource = source;
    }
    return false;
  }

  // ═══════════════════════════════════════════════════════
  // المسار 1: Tesseract.js OCR → تنظيف → DB Lookup (سريع)
  // Enhanced: thresholding + noise reduction + hard abort
  // ═══════════════════════════════════════════════════════
  var ocrPromise = (async function() {
    try {
      if (typeof Tesseract === 'undefined') return null;
      if (abortOCR.signal.aborted) return null;
      var imgSrc = 'data:image/jpeg;base64,' + base64;
      var preprocessed = await preprocessForOCR(imgSrc);
      if (abortOCR.signal.aborted) return null;
      var tessResult = await Tesseract.recognize(preprocessed || imgSrc, 'eng', {
        logger: function() {}
      });
      if (abortOCR.signal.aborted) return null;
      var tessText = (tessResult.data.text || '').trim();
      console.log('🔍 Tesseract قرأ:', tessText.substring(0, 200));
      if (!tessText || tessText.length < 3) return null;

      var lines = tessText.split('\n').map(function(l) { return l.trim(); }).filter(function(l) { return l.length >= 3; });
      for (var li = 0; li < lines.length; li++) {
        if (raceWon || abortOCR.signal.aborted) return null;
        var line = ocrCleanup(lines[li]);
        if (line.length < 4) continue;
        var localResult = searchInDB(line);
        if (localResult && localResult.storage && localResult.type) {
          var company = localResult.company || detectCompanyLocal(line);
          var result = {
            code: line, storage: localResult.storage, type: localResult.type,
            company: company, ram: localResult.ram || null,
            step: 'ocr_db', confidence: 92
          };
          if (handleCandidate(result, 'OCR+DB')) return result;
        }
        try {
          if (abortOCR.signal.aborted) return null;
          var lookupRes = await fetch('/api/lookup', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({ code: line, learnedCodes: cloudLearned, source: 'tesseract' }),
            signal: abortOCR.signal
          });
          var lookupData = await lookupRes.json();
          if (lookupData.found && lookupData.storage && lookupData.type) {
            lookupData.step = 'ocr_lookup';
            lookupData.confidence = 88;
            if (handleCandidate(lookupData, 'OCR+Lookup')) return lookupData;
          }
        } catch(e) {
          if (e.name === 'AbortError') return null;
        }
      }
      return null;
    } catch(e) {
      if (e.name === 'AbortError') { console.log('OCR ألغي'); return null; }
      console.log('Tesseract فشل:', e.message);
      return null;
    }
  })();

  // ═══════════════════════════════════════════════════════
  // المسار 2: Gemini Vision (True RAG + Confidence)
  // ═══════════════════════════════════════════════════════
  var geminiPromise = (async function() {
    try {
      if (raceWon || abortGemini.signal.aborted) return null;
      var geminiRes = await fetch('/api/analyze', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({ imageBase64: base64, learnedCodes: cloudLearned }),
        signal: abortGemini.signal
      });
      if (raceWon || abortGemini.signal.aborted) return null;
      if (!geminiRes.ok) {
        var errData = {};
        try { errData = await geminiRes.json(); } catch(e){}
        return { error: true, data: errData };
      }
      var parsed = await geminiRes.json();
      if (!parsed.code) parsed = {code:'', storage:'', type:'', company:''};
      // السيرفر بيرجع confidence جاهز
      if (!parsed.confidence) {
        parsed.confidence = (parsed.storage && parsed.type) ? 70 : 30;
      }
      
      if (parsed.code && isValidCode(parsed.code)) {
        if (handleCandidate(parsed, 'Gemini')) return parsed;
      }
      return parsed;
    } catch(e) {
      if (e.name === 'AbortError') { console.log('Gemini ألغي - OCR كسب'); return null; }
      console.log('Gemini فشل:', e.message);
      return { error: true, data: { error: e.message, step: 'failed' } };
    }
  })();

  // ═══════════════════════════════════════════════════════
  // انتظار كل المسارات + Confidence Arbitration
  // ═══════════════════════════════════════════════════════
  try {
    var results = await Promise.allSettled([ocrPromise, geminiPromise]);
    
    if (!raceWon) {
      // لو في نتيجة محفوظة (تحت الحد بس أحسن من لا حاجة)
      if (bestResult) {
        console.log('🎯 Arbitration: أحسن نتيجة = ' + bestSource + ' conf=' + bestConfidence);
        submitWinner(bestResult, bestSource);
      } else {
        var geminiResult = results[1] && results[1].value;
        if (geminiResult && geminiResult.error) {
          stopLEDAnimation();
          lightLED(geminiResult.data.step || 'failed');
          stopScanBar(false);
          showLoading(false);
          showError('❌ ' + (geminiResult.data.error || 'فشل التحليل - جرب تاني'));
        } else if (geminiResult && geminiResult.code && isValidCode(geminiResult.code)) {
          submitWinner(geminiResult, 'Gemini');
        } else {
          stopLEDAnimation();
          lightLED('failed');
          stopScanBar(false);
          showLoading(false);
          addChatMsg('المساعد', '❓ مش شايف كود ذاكرة - صوّر أقرب على الشريحة السوداء الكبيرة أو اكتب الكود يدوي', 'bot');
          showError('❌ مش شايف كود ذاكرة');
        }
        isAnalyzing = false;
        unfreezeCamera();
        if (stream && cameraActive) setTimeout(startAutoAnalysis, 2000);
      }
    }
  } catch(e) {
    if (!raceWon) {
      stopLEDAnimation();
      lightLED('failed');
      stopScanBar(false);
      showLoading(false);
      showError('⚠️ خطأ في الاتصال\n' + e.message);
      isAnalyzing = false;
      unfreezeCamera();
    }
  }
}
