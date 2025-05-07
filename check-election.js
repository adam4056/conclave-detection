const express = require('express');
const fetch = require('node-fetch');
const xml2js = require('xml2js');
const app = express();

app.get('/api/check-election', async (req, res) => {
    try {
        const response = await fetch('https://www.vaticannews.va/en.rss.xml');
        const text = await response.text();
        const parser = new xml2js.Parser();
        const feed = await parser.parseStringPromise(text);

        const items = feed.rss.channel[0].item;
        const keywords = ['habemus papam', 'white smoke', 'new pope', 'pope elected', 'new pontiff'];

        const today = new Date();
        const todayString = today.toISOString().split('T')[0]; // YYYY-MM-DD

        const popeElected = items.some(item => {
            const pubDate = new Date(item.pubDate[0]);
            const pubDateString = pubDate.toISOString().split('T')[0];

            if (pubDateString !== todayString) return false;

            const title = item.title[0].toLowerCase();
            const description = (item.description?.[0] || '').toLowerCase();
            return keywords.some(keyword =>
                title.includes(keyword) || description.includes(keyword)
            );
        });

        res.json({ popeElected });
    } catch (err) {
        console.error('Error checking election status:', err);
        res.status(500).json({ error: 'Failed to fetch election status' });
    }
});
