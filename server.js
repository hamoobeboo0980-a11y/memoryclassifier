const express = require('express');
const path = require('path');
const app = express();

// إعدادات البورت لـ Railway
const PORT = process.env.PORT || 8080;

// لتمكين معالجة البيانات الكبيرة (مثل الصور)
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// تقديم الملفات الثابتة من مجلد public
app.use(express.static(path.join(__dirname, 'public')));

// مسار API للصحة (Health Check)
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date() });
});

// توجيه أي طلب غير معروف لملف index.html
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server is running on port ${PORT}`);
});
