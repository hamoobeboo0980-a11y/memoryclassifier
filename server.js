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
        hasApiKey: !!process.env.ANTHROPIC_API_KEY 
    });
});

// Proxy endpoint for Anthropic API
app.post('/api/analyze', async (req, res) => {
    const API_KEY = process.env.ANTHROPIC_API_KEY;
    
    if (!API_KEY) {
        console.error('ERROR: ANTHROPIC_API_KEY is missing');
        return res.status(500).json({ error: 'API Key is not configured on the server.' });
    }

    try {
        console.log('Received analysis request from frontend...');
        
        // استخراج البيانات من الـ body (بما في ذلك الـ system prompt)
        const { image, code, system } = req.body;

        if (!image && !code) {
            console.error('ERROR: No image or code provided');
            return res.status(400).json({ error: 'No image or code provided' });
        }

        // بناء محتوى الرسالة لـ Claude
        let userContent = [];
        
        if (image) {
            const cleanBase64 = image.replace(/^data:image\/\w+;base64,/, "");
            userContent.push({
                type: "image",
                source: {
                    type: "base64",
                    media_type: "image/jpeg",
                    data: cleanBase64
                }
            });
            userContent.push({
                type: "text",
                text: "Analyze this IC chip image. Identify: 1. Storage Capacity (GB), 2. RAM Size (GB), 3. BGA Type, 4. Chip Type (NAND/EMMC/UFS). Return JSON only: {\"storage\": \"\", \"ram\": \"\", \"bga\": \"\", \"type\": \"\", \"code\": \"\"}"
            });
        } else if (code) {
            userContent.push({
                type: "text",
                text: `Analyze this IC chip code: ${code}. Identify: 1. Storage Capacity (GB), 2. RAM Size (GB), 3. BGA Type, 4. Chip Type (NAND/EMMC/UFS). Return JSON only: {\"storage\": \"\", \"ram\": \"\", \"bga\": \"\", \"type\": \"\", \"code\": \"\"}`
            });
        }

        // بناء الـ Payload لـ Anthropic مع تمرير الـ system prompt
        const anthropicPayload = {
            model: "claude-3-5-sonnet-20241022", // تم استخدام sonnet-3.5 لأنه الأحدث والأقوى حالياً
            max_tokens: 1024,
            system: system || "", // تمرير الـ system prompt من الـ frontend
            messages: [{
                role: "user",
                content: userContent
            }]
        };

        const response = await fetch('https://api.anthropic.com/v1/messages', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': API_KEY,
                'anthropic-version': '2023-06-01'
            },
            body: JSON.stringify(anthropicPayload)
        });

        const data = await response.json();
        
        if (!response.ok) {
            console.error('Anthropic API Error:', JSON.stringify(data));
            return res.status(response.status).json(data);
        }

        // استخراج النص من رد Claude والرد بالصيغة المطلوبة { "result": "..." }
        const claudeText = data.content[0].text;
        console.log('Analysis successful, returning result to frontend');
        res.status(200).json({ result: claudeText });

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
