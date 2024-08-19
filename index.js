const express = require('express');
const scrapeGoogleNews = require('./main');

const app = express();
const port = 3000;

app.get('/news', async (req, res) => {
    const topic = req.query.topic || 'web development'; // Default to 'web development' if no query is provided
    const length = req.query.length || 10; // Default to 'web development' if no query is provided
    console.log(`Searching for: ${req.query}`); // Print the query parameter
    try {
        const news = await scrapeGoogleNews(topic,length);
        res.json(news);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch news' });
    }
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
