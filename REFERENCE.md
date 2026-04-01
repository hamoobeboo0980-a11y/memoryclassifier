# مرجع الكود الحالي - للتعديل

## الملفات:
- public/index.html: الفرونت (CSS + HTML + JS)
- server.js: السيرفر (Node.js + Express)

## الجداول (في index.html سطر 966-974):
- NORMAL_DB: ذواكر عادية BGA (key = "مساحة+رام", value = array أكواد)
- EMMC_DB: ذواكر زجاجية eMMC (key = "مساحة", value = array أكواد)
- MICRON_DB: ذواكر Micron (key = "مساحة", value = array أكواد)

## الدوال المهمة في server.js:
- lookupCode(code, learnedCodes) سطر ~997: بحث شامل (كاش + تصحيحات + DB + learned)
- lookupCodeStrict(code, learnedCodes) سطر ~911: بحث صارم بدون fuzzy
- searchInDB(code) سطر ~100: بحث في الجداول الثلاثة
- fuzzySearchInDB(code) سطر ~500: بحث تقريبي (فرق حرفين)
- getCached/setCache: كاش JSONBin
- isValidMemoryCode(code): فلتر هلوسة
- looksLikeMemoryCode(code) سطر 679: تحقق إن الكود يشبه كود ذاكرة
- cleanReadCode(code) سطر 888: تنظيف الكود المقروء
- extractRam(code): استخراج الرام
- detectCompany(code): كشف الشركة
- applyErrorMemoryFixes(code): تصحيح أخطاء OCR
- imageHash(base64): هاش الصورة للكاش

## Endpoints:
- POST /api/lookup: بحث سريع بكود (source: tesseract = بدون fuzzy)
- POST /api/analyze: Gemini يقرأ صورة + يصنف
- POST /api/confirm: تأكيد نتيجة صح
- POST /api/correct: تصحيح نتيجة غلط
- POST /api/chat: شات مع Gemini

## الفرونت - الدوال المهمة في index.html:
- tapCapture() سطر 2111: تجميد كاميرا + captureAndAnalyze
- captureAndAnalyze() سطر 2130: قص صورة + analyzeImage
- cropToFocusBox() سطر 2136: قص على المربع (25%, ratio 1.2)
- analyzeImage(base64) سطر 1243: التحليل الرئيسي - حالياً Gemini فقط
- searchInDB(code) سطر ~1100: بحث محلي في الجداول
- searchManual() سطر 1365: بحث يدوي
- unfreezeCamera() سطر 1236: رجوع الكاميرا

## المربع: width=25%, aspect-ratio=1.2 (CSS سطر 184, crop سطر 2138)

## التعديل المطلوب - Parallel Intelligence System:
1. analyzeImage تشغّل 3 مسارات بالتوازي:
   - Tesseract.js OCR → تنظيف → DB lookup
   - Gemini Vision (صورة + candidates)
   - Candidate Generator (fuzzy top 10)
2. أول نتيجة صحيحة تكسب (Winner-Takes-All)
3. AbortController لإلغاء الباقي
4. Confidence Scoring لكل نتيجة
5. Gemini = selector/corrector مش search engine
6. preprocessing للصورة قبل OCR (grayscale + sharpen + contrast)
