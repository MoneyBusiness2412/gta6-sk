-- schema.sql: Kompletná databázová štruktúra pre Cloudflare D1 (SQLite)

-- 1. Používatelia a roly
CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    name TEXT NOT NULL,
    role TEXT CHECK(role IN ('admin', 'editor', 'author')) NOT NULL DEFAULT 'author',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 2. Kategórie (s podporou prekladov názvu/slugu)
CREATE TABLE IF NOT EXISTS categories (
    id TEXT PRIMARY KEY,
    slug_sk TEXT UNIQUE NOT NULL,
    slug_cs TEXT UNIQUE NOT NULL,
    slug_en TEXT UNIQUE NOT NULL,
    name_sk TEXT NOT NULL,
    name_cs TEXT NOT NULL,
    name_en TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 3. Hlavné články (Spoločný entitný identifikátor)
CREATE TABLE IF NOT EXISTS articles (
    id TEXT PRIMARY KEY,
    category_id TEXT NOT NULL,
    author_id TEXT NOT NULL,
    status TEXT CHECK(status IN ('draft', 'pending_approval', 'scheduled', 'published')) DEFAULT 'draft',
    trust_level TEXT CHECK(trust_level IN ('OFFICIAL', 'VERIFIED', 'RUMOR', 'LEAK', 'OPINION')) DEFAULT 'VERIFIED',
    featured_image_url TEXT,
    reading_time_min INTEGER DEFAULT 3,
    published_at DATETIME,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (category_id) REFERENCES categories(id),
    FOREIGN KEY (author_id) REFERENCES users(id)
);

-- 4. Jazykové verzie článkov (SK, CS, EN)
CREATE TABLE IF NOT EXISTS article_translations (
    id TEXT PRIMARY KEY,
    article_id TEXT NOT NULL,
    language TEXT CHECK(language IN ('sk', 'cs', 'en')) NOT NULL,
    slug TEXT NOT NULL,
    title TEXT NOT NULL,
    perex TEXT NOT NULL,
    content_html TEXT NOT NULL,
    seo_title TEXT,
    seo_description TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (article_id) REFERENCES articles(id) ON DELETE CASCADE,
    UNIQUE(language, slug),
    UNIQUE(article_id, language)
);

-- 5. Štítky (Tags)
CREATE TABLE IF NOT EXISTS tags (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL UNIQUE,
    slug TEXT NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS article_tags (
    article_id TEXT NOT NULL,
    tag_id TEXT NOT NULL,
    PRIMARY KEY (article_id, tag_id),
    FOREIGN KEY (article_id) REFERENCES articles(id) ON DELETE CASCADE,
    FOREIGN KEY (tag_id) REFERENCES tags(id) ON DELETE CASCADE
);

-- 6. RSS Zdroje pre AI Newsroom
CREATE TABLE IF NOT EXISTS sources (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    rss_url TEXT UNIQUE NOT NULL,
    website_url TEXT NOT NULL,
    default_trust_level TEXT CHECK(default_trust_level IN ('OFFICIAL', 'VERIFIED', 'RUMOR', 'LEAK', 'OPINION')) DEFAULT 'VERIFIED',
    is_active INTEGER DEFAULT 1,
    last_fetched_at DATETIME
);

CREATE TABLE IF NOT EXISTS article_sources (
    article_id TEXT NOT NULL,
    source_id TEXT NOT NULL,
    source_item_url TEXT NOT NULL,
    PRIMARY KEY (article_id, source_id),
    FOREIGN KEY (article_id) REFERENCES articles(id) ON DELETE CASCADE,
    FOREIGN KEY (source_id) REFERENCES sources(id) ON DELETE CASCADE
);

-- 7. Audit logy a AI spracovanie
CREATE TABLE IF NOT EXISTS agent_runs (
    id TEXT PRIMARY KEY,
    started_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    ended_at DATETIME,
    status TEXT CHECK(status IN ('running', 'success', 'failed')) DEFAULT 'running',
    items_found INTEGER DEFAULT 0,
    items_processed INTEGER DEFAULT 0,
    articles_created INTEGER DEFAULT 0,
    error_message TEXT
);

CREATE TABLE IF NOT EXISTS agent_settings (
    key TEXT PRIMARY KEY,
    value TEXT NOT NULL
);

-- Indexy pre vysokú rýchlosť vyhľadávania
CREATE INDEX IF NOT EXISTS idx_translations_lang_slug ON article_translations(language, slug);
CREATE INDEX IF NOT EXISTS idx_articles_status_published ON articles(status, published_at);
CREATE INDEX IF NOT EXISTS idx_articles_category ON articles(category_id);