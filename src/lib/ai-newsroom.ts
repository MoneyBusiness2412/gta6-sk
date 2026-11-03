// src/lib/ai-newsroom.ts
import { TrustLevel } from './types';

interface RSSItem {
  title: string;
  link: string;
  contentSnippet: string;
  pubDate: string;
}

export async function processFeedItem(env: any, item: RSSItem, sourceId: string, trustLevel: TrustLevel) {
  // 1. Ochrana proti duplicitám v D1 databáze
  const existing = await env.DB.prepare(
    "SELECT article_id FROM article_sources WHERE source_item_url = ?"
  ).bind(item.link).first();

  if (existing) {
    console.log(`[AI Newsroom] Článok už existuje: ${item.link}`);
    return null;
  }

  const aiApiKey = env.OPENAI_API_KEY;
  
  // Ak nie je nastavený OpenAI kľúč, uložíme surový koncept
  if (!aiApiKey) {
    return await saveRawConcept(env, item, sourceId, trustLevel);
  }

  // Komunikácia s OpenAI pre trojjazyčný preklad a spracovanie
  const prompt = `
  Si redaktor herného magazínu GTA6.sk. Na základe zdroja vytvor profesionálny článok.
  Zdrojový Titulok: ${item.title}
  Zdrojový Text: ${item.contentSnippet}

  Vráť výstup výhradne v platnom JSON formáte:
  {
    "sk": { "title": "...", "perex": "...", "content": "...", "slug": "...", "seoTitle": "...", "seoDesc": "..." },
    "cs": { "title": "...", "perex": "...", "content": "...", "slug": "...", "seoTitle": "...", "seoDesc": "..." },
    "en": { "title": "...", "perex": "...", "content": "...", "slug": "...", "seoTitle": "...", "seoDesc": "..." }
  }
  `;

  const aiResponse = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${aiApiKey}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model: "gpt-4o-mini",
      response_format: { type: "json_object" },
      messages: [{ role: "system", content: prompt }]
    })
  });

  const aiData = await aiResponse.json();
  const parsed = JSON.parse(aiData.choices[0].message.content);

  const articleId = crypto.randomUUID();
  const defaultCategory = "novinky-cat-id";
  const systemAuthorId = "ai-agent-user-id";

  // Uloženie do D1 databázy v stave pending_approval
  await env.DB.batch([
    env.DB.prepare(
      `INSERT INTO articles (id, category_id, author_id, status, trust_level, reading_time_min, published_at)
       VALUES (?, ?, ?, 'pending_approval', ?, 3, CURRENT_TIMESTAMP)`
    ).bind(articleId, defaultCategory, systemAuthorId, trustLevel),

    env.DB.prepare(
      `INSERT INTO article_sources (article_id, source_id, source_item_url) VALUES (?, ?, ?)`
    ).bind(articleId, sourceId, item.link),

    env.DB.prepare(
      `INSERT INTO article_translations (id, article_id, language, slug, title, perex, content_html, seo_title, seo_description)
       VALUES (?, ?, 'sk', ?, ?, ?, ?, ?, ?)`
    ).bind(crypto.randomUUID(), articleId, parsed.sk.slug, parsed.sk.title, parsed.sk.perex, parsed.sk.content, parsed.sk.seoTitle, parsed.sk.seoDesc),

    env.DB.prepare(
      `INSERT INTO article_translations (id, article_id, language, slug, title, perex, content_html, seo_title, seo_description)
       VALUES (?, ?, 'cs', ?, ?, ?, ?, ?, ?)`
    ).bind(crypto.randomUUID(), articleId, parsed.cs.slug, parsed.cs.title, parsed.cs.perex, parsed.cs.content, parsed.cs.seoTitle, parsed.cs.seoDesc),

    env.DB.prepare(
      `INSERT INTO article_translations (id, article_id, language, slug, title, perex, content_html, seo_title, seo_description)
       VALUES (?, ?, 'en', ?, ?, ?, ?, ?, ?)`
    ).bind(crypto.randomUUID(), articleId, parsed.en.slug, parsed.en.title, parsed.en.perex, parsed.en.content, parsed.en.seoTitle, parsed.en.seoDesc),
  ]);

  return articleId;
}

async function saveRawConcept(env: any, item: RSSItem, sourceId: string, trustLevel: TrustLevel) {
  const articleId = crypto.randomUUID();
  const defaultCategory = "novinky-cat-id";
  const systemAuthorId = "system-id";
  
  await env.DB.batch([
    env.DB.prepare(`INSERT INTO articles (id, category_id, author_id, status, trust_level) VALUES (?, ?, ?, 'draft', ?)`).bind(articleId, defaultCategory, systemAuthorId, trustLevel),
    env.DB.prepare(`INSERT INTO article_translations (id, article_id, language, slug, title, perex, content_html) VALUES (?, ?, 'sk', ?, ?, ?, ?)`).bind(crypto.randomUUID(), articleId, `draft-${Date.now()}`, item.title, item.contentSnippet, `<p>${item.contentSnippet}</p>`)
  ]);
  return articleId;
}