const express = require('express');
const cors = require('cors');
const path = require('path');
const fetch = require('node-fetch');

const app = express();
const PORT = process.env.PORT || 8080;

// Middleware
app.use(cors());
app.use(express.json({ limit: '20mb' })); // زيادة الحد لصور الكاميرا
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
        console.error('ERROR: ANTHROPIC_API_KEY is missing in environment variables');
        return res.status(500).json({ error: 'API Key is not configured on the server.' });
    }

    try {
        console.log('Received analysis request...');
        
        // التأكد من أن الـ body يحتوي على البيانات المطلوبة
        if (!req.body || !req.body.messages) {
            console.error('ERROR: Invalid request body', req.body);
            return res.status(400).json({ error: 'Invalid request body' });
        }

        const response = await fetch('https://api.anthropic.com/v1/messages', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': API_KEY,
                'anthropic-version': '2023-06-01'
            },
            body: JSON.stringify(req.body)
        });

        const data = await response.json();
        
        if (!response.ok) {
            console.error('Anthropic API Error:', data);
            return res.status(response.status).json(data);
        }

        console.log('Analysis successful');
        res.status(200).json(data);
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
