import fetch from 'node-fetch';
import { Parser } from 'xml2js';

export default async function handler(req, res) {
  try {
    const rssUrl = 'https://search.cnbc.com/rs/search/combinedcms/view.xml?partnerId=wrss01&id=100003114';
    const response = await fetch(rssUrl);
    const text = await response.text();
    const parser = new Parser();
    const feed = await parser.parseStringPromise(text);

    const items = feed.rss.channel[0].item;

    const keywords = [
      'pope elected',
      'new pope',
      'white smoke',
      'new pontiff',
      'habemus papam',
      'papal conclave',
      'vatican elects',
      'successor to francis',
      'new vatican leader',
      'conclave selects pope',
      'st. peter’s square',
      'new head of catholic church'
    ];

    const now = new Date();
    const twoDaysAgo = new Date(now.getTime() - 48 * 60 * 60 * 1000);

    const matchingArticles = items.filter(item => {
      const pubDate = new Date(item.pubDate[0]);
      if (pubDate < twoDaysAgo) return false;

      const title = (item.title?.[0] || '').toLowerCase();
      const description = (item.description?.[0] || '').toLowerCase();

      return keywords.some(keyword =>
        title.includes(keyword) || description.includes(keyword)
      );
    });

    const popeElected = matchingArticles.length > 0;

    res.status(200).json({
      popeElected,
      articles: matchingArticles.map(a => ({
        title: a.title[0],
        link: a.link[0],
        pubDate: a.pubDate[0]
      }))
    });
  } catch (error) {
    console.error('Error fetching RSS feed:', error);
    res.status(500).json({ error: 'Failed to fetch and process RSS feed' });
  }
}
