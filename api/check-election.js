// api/check-election.js
const fetch = require('node-fetch');
const xml2js = require('xml2js');

module.exports = async (req, res) => {
  try {
    const feedUrl = 'https://search.cnbc.com/rs/search/combinedcms/view.xml?partnerId=wrss01&id=100003114';
    const keywords = [
      'pope elected', 'new pope', 'white smoke', 'new pontiff',
      'habemus papam', 'papal conclave', 'vatican elects',
      'successor to francis', 'new vatican leader',
      'conclave selects pope', 'st. peters square',
      'new head of catholic church'
    ];

    php
    Zkopírovat
    Upravit
    const response = await fetch(feedUrl);
    const xml = await response.text();
    const parser = new xml2js.Parser();
    const feed = await parser.parseStringPromise(xml);

    const items = feed.rss.channel[0].item || [];
    const now = new Date();
    const recentThreshold = 1000 * 60 * 60 * 48; // posledních 48 hodin

    const matches = items.filter(item => {
      const pubDate = new Date(item.pubDate[0]);
      const age = now - pubDate;
      if (age > recentThreshold) return false;

      const title = item.title?.[0]?.toLowerCase() || '';
      const desc = item.description?.[0]?.toLowerCase() || '';
      return keywords.some(kw => title.includes(kw) || desc.includes(kw));
    });

    const responsePayload = {
      popeElected: matches.length > 0,
      articles: matches.map(item => ({
        title: item.title[0],
        link: item.link[0],
        pubDate: item.pubDate[0]
      }))
    };

    res.setHeader('Content-Type', 'application/json');
    res.status(200).json(responsePayload);
  } catch (err) {
    console.error('Election check error:', err);
    res.status(500).json({ error: 'Election check failed' });
  }
};