import fetch from 'node-fetch';
import { Parser } from 'xml2js';

export default async function handler(req, res) {
  try {
    const response = await fetch('https://www.vaticannews.va/en.rss.xml');
    const text = await response.text();
    const parser = new Parser();
    const feed = await parser.parseStringPromise(text);

    const items = feed.rss.channel[0].item;
    const keywords = ['habemus papam', 'white smoke', 'new pope', 'pope elected', 'new pontiff'];

    const today = new Date().toISOString().split('T')[0];

    const popeElected = items.some(item => {
      const pubDate = new Date(item.pubDate[0]).toISOString().split('T')[0];
      if (pubDate !== today) return false;

      const title = item.title[0].toLowerCase();
      const description = (item.description?.[0] || '').toLowerCase();

      return keywords.some(keyword =>
        title.includes(keyword) || description.includes(keyword)
      );
    });

    res.status(200).json({ popeElected });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Failed to check pope election status' });
  }
}
