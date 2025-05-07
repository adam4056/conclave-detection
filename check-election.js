import Parser from 'rss-parser';

export default async function handler(req, res) {
    const parser = new Parser();
    try {
        const feed = await parser.parseURL('https://www.vaticannews.va/en.rss.xml'); // Replace with the correct RSS feed URL
        const electionArticle = feed.items.find(item =>
            item.title.toLowerCase().includes('pope elected') || 
            item.contentSnippet.toLowerCase().includes('pope elected')
        );

        res.status(200).json({ popeElected: !!electionArticle });
    } catch (error) {
        console.error('Error fetching RSS feed:', error);
        res.status(500).json({ error: 'Failed to fetch RSS feed' });
    }
}
