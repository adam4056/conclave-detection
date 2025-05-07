// api/check-election.js nebo vlož do server.js
const express = require('express');
const Parser = require('rss-parser');
const router = express.Router();

router.get('/check-election', async (req, res) => {
    const parser = new Parser();
    try {
        const feed = await parser.parseURL('https://www.vaticannews.va/en.rss.xml');
        const electionArticle = feed.items.find(item =>
            item.title.toLowerCase().includes('pope elected') ||
            item.contentSnippet.toLowerCase().includes('pope elected')
        );

        res.status(200).json({ popeElected: !!electionArticle });
    } catch (error) {
        console.error('Error fetching RSS feed:', error);
        res.status(500).json({ error: 'Failed to fetch RSS feed' });
    }
});

module.exports = router;
