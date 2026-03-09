const express = require('express');
const cors = require('cors');
const path = require('path');
const fetch = require('node-fetch');

const app = express();
const PORT = process.env.PORT || 8080;

// Middleware
app.use(cors());
app.use(express.json({ limit: '20mb' })); 
app.use(express.static(path.join(__dirname, 'public')));

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.status(200).json({ 
        status: 'ok', 
        uptime: process.uptime(),
        port: PORT,
        hasApiKey: true 
    });
});

// Proxy endpoint for Gemini API
app.post('/api/analyze', async (req, res) => {
    // استخدام المفتاح الجديد مباشرة كما طلب المستخدم
    const API_KEY = "AIzaSyDeWn6mfiB-VP8hxBb878qrJ0K0_OGcGc8";
    
    try {
        console.log('Received analysis request from frontend for Gemini...');
        
        const { image, code, system } = req.body;

        if (!image && !code) {
            console.error('ERROR: No image or code provided');
            return res.status(400).json({ error: 'No image or code provided' });
        }

        let promptText = system || "Analyze this IC chip. Identify: 1. Storage Capacity (GB), 2. RAM Size (GB), 3. BGA Type, 4. Chip Type (NAND/EMMC/UFS). Return JSON only: {\"storage\": \"\", \"ram\": \"\", \"bga\": \"\", \"type\": \"\", \"code\": \"\"}";
        
        let geminiPayload;

        if (image) {
            let cleanBase64 = image;
            if (image.includes(',')) {
                cleanBase64 = image.split(',')[1];
            }

            geminiPayload = {
                contents: [{
                    parts: [
                        { text: promptText },
                        {
                            inline_data: {
                                mime_type: "image/jpeg",
                                data: cleanBase64
                            }
                        }
                    ]
                }]
            };
        } else {
            geminiPayload = {
                contents: [{
                    parts: [{ text: `${promptText}\n\nCode to analyze: ${code}` }]
                }]
            };
        }

        // استخدام Gemini 1.5 Flash لأنه الأسرع والأفضل للصور حالياً
        const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`;

        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(geminiPayload)
        });

        const data = await response.json();
        
        if (!response.ok) {
            console.error('Gemini API Error:', JSON.stringify(data));
            return res.status(response.status).json(data);
        }

        // استخراج النص من رد Gemini
        const geminiText = data.candidates[0].content.parts[0].text;
        console.log('Analysis successful, returning result to frontend');
        
        // تنظيف الرد من أي Markdown (مثل ```json ... ```)
        const cleanText = geminiText.replace(/```json/g, '').replace(/```/g, '').trim();
        
        res.status(200).json({ result: cleanText });

    } catch (error) {
        console.error('Proxy Exception:', error);
        res.status(500).json({ 
            error: 'Failed to connect to AI service.',
            details: error.message 
        });
    }
});

// Serve index.html for any other route
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start server and bind to 0.0.0.0
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server is running on port ${PORT}`);
});
