const express = require('express');
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

        const prompt = `Identify the Memory IC on the mobile phone board first and completely ignore any CPU, GPU, Qualcomm, Snapdragon, or Mediatek chips, then if the image is upside down or mirrored mentally rotate it until the text is upright and readable, then read the engraved code on the Memory IC line by line while strictly reading characters exactly as they appear without guessing or completing any unclear parts and only return what is actually visible, then determine the company from the beginning of the code and apply the correct rule below to select the required part:
Samsung (KM): read the third line only
Samsung (KLM / KLU): read the first line only
SK Hynix (H9): read the full code
SK Hynix (H26 / H28 / HN8): read the full code
SanDisk (SDIN): read the second line only
Toshiba (THG): read the third line only
Kingston: read the left part of the fourth line only
Micron (JW / JZ): read the full code
YMTC (YMEC): read the bottom-left last line only
then return only this JSON with no extra text {"code":"EXACT_CODE","company":"COMPANY_NAME"} and if the code is not readable return {"code":"","company":""}`;

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
