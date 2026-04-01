# مسارات ومنطق التطبيق الفعلي (من الكود)

## المسار الكامل: من الضغط على "صوّر" لحد ظهور النتيجة

### الخطوة 1: tapCapture() - الضغط على زر التصوير
```
المستخدم يضغط "صوّر" أو يلمس الشاشة
    ↓
tapCapture() في index.html سطر 2182
    ↓
1. تجميد الكاميرا (tracks.enabled = false)
2. فلاش أبيض
3. استدعاء captureAndAnalyze()
```

### الخطوة 2: captureAndAnalyze() - التقاط وقص الصورة
```
captureAndAnalyze() سطر 2201
    ↓
cropToFocusBox() - قص الصورة على المربع (حالياً 65% من عرض الفيديو)
    ↓
تحويل الصورة المقصوصة لـ base64
    ↓
استدعاء analyzeImage(base64)
```

### الخطوة 3: analyzeImage() - التحليل (سطر 1243)

#### المسار A: Tesseract.js (محلي - أول محاولة) ⏱️ بطيء 3-8 ثواني
```
Tesseract.recognize(الصورة) ← يقرأ أي نص في الصورة
    ↓
يقسم النص لأسطر
    ↓
لكل سطر → يبعت POST /api/lookup مع source:'tesseract'
```

#### /api/lookup (سيرفر سطر 618) - لما المصدر Tesseract:
```
1. looksLikeMemoryCode() ← لو النص مش شبه كود ذاكرة → يرفضه فوراً
2. lookupCodeStrict() ← بحث صارم (بدون fuzzy):
   - getCachedStrict() ← كاش دقيق فقط (بدون fuzzy)
   - تصحيحات المستخدم (learned corrections)
   - searchInDB() ← الجداول الثلاثة (NORMAL_DB, EMMC_DB, MICRON_DB)
   - الأكواد المتعلمة (learnedCodes)
   - learnedPatterns
3. applyErrorMemoryFixes() ← تصحيح أخطاء OCR المتعلمة
4. ❌ لا fuzzy matching لـ Tesseract!
```

**لو Tesseract لقى نتيجة** → يعرضها فوراً ويرجع (بدون Gemini)
**لو Tesseract ملقاش** → ينتقل للمسار B

#### المسار B: Gemini AI (سيرفر - fallback) ⏱️ بطيء 5-15 ثانية
```
POST /api/analyze مع الصورة base64
    ↓
السيرفر (سطر 716):
1. كاش الصورة ← لو نفس الصورة اتحللت قبل كده في آخر 10 دقايق → يرجع النتيجة فوراً
2. Gemini 2.5 Flash ← يبعت الصورة + prompt التصنيف
3. يستقبل JSON: {code, storage, type, company, ram}
4. فلتر الهلوسة ← isValidMemoryCode()
5. لو قرأ كود صالح:
   a. lookupCode() في الجداول (مع fuzzy) ← لو لقاه → يرجعه
   b. applyErrorMemoryFixes() ← لو صحح → يرجعه
   c. fuzzySearchInDB() ← لو لقى شبيه → يرجعه
   d. لو Gemini صنف مباشرة (storage + type) → يرجعه
   e. لو قرأ كود بس مصنفش → يرجع الكود بدون تصنيف
```

### الخطوة 4: عرض النتيجة (في analyzeImage)
```
لو في storage + type → يعرض النتيجة + أزرار صح/غلط
لو في كود بس بدون تصنيف → يعرض فورم التصحيح
لو مفيش كود خالص → رسالة "مش شايف كود ذاكرة"
    ↓
unfreezeCamera() ← يرجع الكاميرا تشتغل
```

---

## سبب التأخير الفعلي:

| المرحلة | الوقت التقريبي | السبب |
|---------|---------------|-------|
| **Tesseract.recognize()** | **3-8 ثواني** | OCR محلي على الموبايل - بطيء جداً |
| لكل سطر: fetch /api/lookup | 0.5-1 ثانية × عدد الأسطر | طلبات متعددة للسيرفر |
| **Gemini API call** | **5-15 ثانية** | إرسال صورة + انتظار AI |
| المجموع الأسوأ | **10-25 ثانية** | Tesseract يفشل + Gemini يشتغل |

**المشكلة الرئيسية**: Tesseract بياخد 3-8 ثواني ثم يفشل (لأن الأكواد مش واضحة ليه أو مش في الجداول)، وبعدين Gemini بياخد 5-15 ثانية. يعني المستخدم بيستنى مرتين!

---

## حجم المربع:
- CSS: `.target-frame { width: 65%; aspect-ratio: 1.2; }`
- cropToFocusBox(): `boxW = videoW * 0.65`
- **محتاج يتغير لـ 25%**
