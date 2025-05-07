// filepath: api/check-election.js
import Parser from 'rss-parser';

export default async function handler(req, res) {
    const parser = new Parser();
    const feed = await parser.parseURL('https://www.vaticannews.va/en.rss');
    const electionArticle = feed.items.find(item =>
        item.title.toLowerCase().includes('pope elected') || 
        item.contentSnippet.toLowerCase().includes('pope elected')
    );

    res.status(200).json({ popeElected: !!electionArticle });
}