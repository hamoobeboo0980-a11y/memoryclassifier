const express = require('express');
const path = require('path');
const { GoogleGenerativeAI } = require("@google/generative-ai");

const app = express();
const PORT = process.env.PORT || 8080;

const genAI = new GoogleGenerativeAI("AIzaSyBJ6lVPhbyb1VPss1UY4Abo2TSZ4AWbfoA");

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

app.post('/api/analyze', async (req, res) => {
    try {
        const { imageBase64 } = req.body;
        if (!imageBase64) return res.status(400).json({ error: "No image provided" });

        const model = genAI.getGenerativeModel({ model: "gemini-2.0-pro-exp-02-05" });

        const prompt = `You are a high-precision OCR engine specialized in mobile phone memory IC chips.
Find the memory chip. IGNORE Qualcomm/Snapdragon/Mediatek/CPU/GPU completely.
FIND: Samsung (KM/KLM/KLU), SK Hynix (H9/H26/H28/HN8), Toshiba (THG), SanDisk (SDIN), Kingston, Micron (JW/JZ), YMEC, UNIC.
Read the code carefully by company rules:
- Samsung KM: read LINE 3
- Samsung KLM/KLU: read LINES 2+3
- SK Hynix H9: read full code
- SanDisk SDIN: read LINE 2
- Toshiba THG: read LINE 3
- Kingston: read LINE 4 left side
- Micron JW/JZ: read full code
- YMEC: read bottom-left last line
- UNIC: read last line
Return ONLY this JSON, nothing else: {"code":"THE_CODE","company":"COMPANY_NAME"}
If truly unreadable: {"code":"","company":""}`;

        const result = await model.generateContent([
            prompt,
            { inlineData: { data: imageBase64, mimeType: "image/jpeg" } }
        ]);

        const response = await result.response;
        let text = response.text();
        text = text.replace(/```json/g, '').replace(/```/g, '').trim();

        let parsed;
        try {
            const jsonMatch = text.match(/\{[^{}]*"code"[^{}]*\}/);
            parsed = jsonMatch ? JSON.parse(jsonMatch[0]) : JSON.parse(text);
        } catch(e) {
            parsed = { code: '', company: '' };
        }

        res.json(parsed);
    } catch (error) {
        console.error("Gemini Error:", error);
        res.status(500).json({ error: error.message });
    }
});

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server is running on port ${PORT}`);
});
