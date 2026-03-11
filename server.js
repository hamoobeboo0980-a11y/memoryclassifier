const express = require('express');
const path = require('path');
const { GoogleGenerativeAI } = require("@google/generative-ai");

const app = express();
const PORT = process.env.PORT || 8080;

// API Key for Gemini (Pay-as-you-go)
const genAI = new GoogleGenerativeAI("AIzaSyDeWn6mfiB-VP8hxBb878qrJ0K0_OGcGc8");

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// New Backend API for Chip Analysis
app.post('/api/analyze', async (req, res) => {
    try {
        const { imageBase64 } = req.body;
        if (!imageBase64) return res.status(400).json({ error: "No image provided" });

        // Use Pro model for Paid users
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });

        const prompt = "Identify this IC chip from the image. Provide storage size in GB, RAM size, BGA type, chip type (EMMC/UFS/NAND), and the detected code. Return ONLY a JSON object like: {\"storage\":\"32\",\"ram\":\"3\",\"bga\":\"221\",\"type\":\"EMMC\",\"code\":\"H9TQ26ADFTMC\"}";
        
        const result = await model.generateContent([
            prompt,
            { inlineData: { data: imageBase64, mimeType: "image/jpeg" } }
        ]);

        const response = await result.response;
        let text = response.text();
        
        // Clean JSON response
        text = text.replace(/```json/g, '').replace(/```/g, '').trim();
        
        res.json(JSON.parse(text));
    } catch (error) {
        console.error("Gemini Error:", error);
        res.status(500).json({ error: error.message });
    }
});

// توجيه أي طلب غير معروف لملف index.html
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on port ${PORT}`);
});
