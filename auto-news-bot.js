// auto-news-bot.js
import Parser from 'rss-parser';
import fetch from 'node-fetch';

const parser = new Parser({
  headers: {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
  }
});

const RSS_FEEDS = [
  'https://news.google.com/rss/search?q=GTA+6&hl=en-US&gl=US&ceid=US:en',
  'https://news.google.com/rss/search?q=GTA+6+leaks&hl=en-US&gl=US&ceid=US:en',
  'https://news.google.com/rss/search?q=GTA+6+Lucia+Jason&hl=en-US&gl=US&ceid=US:en'
];

const DEFAULT_IMAGES = [
  'https://images.unsplash.com/photo-1542751371-adc38448a05e',
  'https://images.unsplash.com/photo-1511512578047-dfb367046420',
  'https://images.unsplash.com/photo-1538481199705-c710c4e965fc'
];

// Pomocná funkcia na odstránenie HTML tagov z RSS textu
function stripHtml(html) {
  if (!html) return '';
  return html.replace(/<[^>]*>?/gm, '').replace(/&nbsp;/g, ' ').trim();
}

async function fetchAndRewriteNews() {
  console.log(`\n[${new Date().toLocaleTimeString('sk-SK')}] 🔍 Spúšťam AI zberač správ pre GTA6.SK...`);

  let addedCount = 0;

  for (const feedUrl of RSS_FEEDS) {
    try {
      const feed = await parser.parseURL(feedUrl);
      const itemsToProcess = feed.items.slice(0, 2);

      for (const item of itemsToProcess) {
        if (!item || !item.title) continue;

        const cleanTitle = item.title.replace(/ - [^-]+$/, '');
        const rewrittenTitle = cleanTitle.toLowerCase().includes('leak') 
          ? `[ÚNIK] ${cleanTitle}` 
          : `[AI News] ${cleanTitle}`;
        
        // Vyčistíme obsah od HTML značiek, aby tu neboli žiadne <ol> <li> tagy
        const rawContent = item.content || item.contentSnippet || item.summary || 'Najnovšie informácie zo sveta Grand Theft Auto VI.';
        const cleanContent = stripHtml(rawContent);

        // Uloženie čistého textu a URL zdroja do formátu, s ktorým si detail článku ľahko poradí
        const sourceUrl = item.link || 'https://news.google.com';
        const finalContent = `${cleanContent}\n\n[SOURCE_URL]:${sourceUrl}`;

        const randomImage = DEFAULT_IMAGES[Math.floor(Math.random() * DEFAULT_IMAGES.length)];
        const category = cleanTitle.toLowerCase().includes('leak') ? 'Úniky' : 'Oficiálne';

        const response = await fetch('http://localhost:3000/api/articles', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            title: rewrittenTitle,
            content: finalContent,
            category: category,
            imageUrl: randomImage,
            language: 'sk',
            status: 'Published'
          }),
        });

        if (response.ok) {
          addedCount++;
          console.log(`  ✅ Pridaný čistý článok: "${rewrittenTitle}"`);
        }
      }

    } catch (error) {
      console.error(`❌ Chyba pri spracovaní feedu:`, error.message);
    }
  }

  console.log(`✨ Hotovo. Pridaných článkov: ${addedCount}\n`);
}

fetchAndRewriteNews();
const ONE_HOUR = 60 * 60 * 1000;
setInterval(fetchAndRewriteNews, ONE_HOUR);