const express = require('express');
const path = require('path');
const { const express = require('express');
const path = require('path');
const { GoogleGenerativeAI } = require("@google/generative-ai");

const app = express();
const PORT = process.env.PORT || 8080;

const genAI = new GoogleGenerativeAI("AIzaSyDeWn6mfiB-VP8hxBb878qrJ0K0_OGcGc8");

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

app.post('/api/analyze', async (req, res) => {
    try {
        const { imageBase64 } = req.body;
        if (!imageBase64) return res.status(400).json({ error: "No image provided" });

        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

        const prompt = `Find the memory IC chip on this mobile phone board.
IGNORE completely: CPU, GPU, Qualcomm, Snapdragon, Mediatek.
FIND ONLY: Samsung (KM/KLM/KLU), SK Hynix (H9/H26/H28/HN8), Toshiba (THG), SanDisk (SDIN), Kingston, Micron (JW/JZ), YMEC.
Read ONLY the correct line based on company:
- Samsung KM: LINE 3 only
- Samsung KLM/KLU: LINE 1 only
- SK Hynix H9: full code
- SK Hynix H26/H28/HN8: full code
- SanDisk SDIN: LINE 2 only
- Toshiba THG: LINE 3 only
- Kingston: LINE 4 left side only
- Micron JW/JZ: full code
- YMEC: last line bottom-left only
Read carefully character by character. If image is unclear, return what you can see without inventing.
Return ONLY this JSON: {"code":"EXACT_CODE","company":"COMPANY_NAME"}
If unreadable: {"code":"","company":""}`;

        const result = await model.generateContent({
            contents: [{ parts: [
                { inlineData: { data: imageBase64, mimeType: "image/jpeg" } },
                { text: prompt }
            ]}],
            generationConfig: {
                temperature: 0.1,
                topP: 0.95,
                responseMimeType: "application/json"
            }
        });

        // Streaming - send characters as they come
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
 } = require("@google/generative-ai");

const app = express();
const PORT = process.env.PORT || 8080;

const genAI = new GoogleGenerativeAI("AIzaSyDeWn6mfiB-VP8hxBb878qrJ0K0_OGcGc8");

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

app.post('/api/analyze', async (req, res) => {
    try {
        const { imageBase64 } = req.body;
        if (!imageBase64) return res.status(400).json({ error: "No image provided" });

        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

        const prompt = `Find the memory IC chip on this mobile phone board.
IGNORE completely: CPU, GPU, Qualcomm, Snapdragon, Mediatek.
FIND ONLY: Samsung (KM/KLM/KLU), SK Hynix (H9/H26/H28/HN8), Toshiba (THG), SanDisk (SDIN), Kingston, Micron (JW/JZ), YMEC, UNIC.
Read the code engraved on the memory chip character by character.
Return the EXACT code as you see it - do NOT add or invent any characters.
Return ONLY this JSON: {"code":"EXACT_CODE","company":"COMPANY_NAME"}
If unreadable: {"code":"","company":""}`;

        const result = await model.generateContent({
            contents: [{ parts: [
                { inlineData: { data: imageBase64, mimeType: "image/jpeg" } },
                { text: prompt }
            ]}],
            generationConfig: {
                temperature: 0.1,
                topP: 0.95,
                responseMimeType: "application/json"
            }
        });

        // Streaming - send characters as they come
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
