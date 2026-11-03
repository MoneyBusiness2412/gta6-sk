// src/app/[lang]/clanky/[id]/page.tsx
import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';

export const dynamic = 'force-dynamic';

const translations: Record<string, any> = {
  sk: { back: '← Späť na hlavnú stránku', publishedAt: 'Publikované', sourceButton: 'Prejsť na pôvodný zdroj ↗', disclaimer: 'GTA6.SK je nezávislý fanúšikovský portál.' },
  cs: { back: '← Zpět na hlavní stránku', publishedAt: 'Publikováno', sourceButton: 'Přejít na původní zdroj ↗', disclaimer: 'GTA6.SK je nezávislý fanouškovský portál.' },
  en: { back: '← Back to home', publishedAt: 'Published at', sourceButton: 'View original source ↗', disclaimer: 'GTA6.SK is an independent fan portal.' }
};

export default async function ArticleDetailPage({ params }: { params: { lang: string; id: string } }) {
  const lang = ['sk', 'cs', 'en'].includes(params.lang) ? params.lang : 'sk';
  const t = translations[lang];
  const articleId = Number(params.id);

  if (isNaN(articleId)) {
    notFound();
  }

  let article = null;
  try {
    article = await prisma.article.findUnique({
      where: { id: articleId },
    });
  } catch (error) {
    console.error('Chyba pri načítaní článku:', error);
  }

  if (!article) {
    notFound();
  }

  const isLeak = article.category === 'Úniky';
  const bg = isLeak 
    ? 'radial-gradient(circle at 50% 10%, rgba(244, 63, 94, 0.2) 0%, rgba(10, 10, 15, 1) 70%), #0a0a0f' 
    : 'radial-gradient(circle at 50% 10%, rgba(34, 211, 238, 0.15) 0%, rgba(10, 10, 15, 1) 70%), #0a0a0f';

  // Inteligentné oddelenie čistého textu od skrytému zdrojového odkazu
  let cleanContent = article.content || '';
  let extractedLink = 'https://news.google.com';

  if (cleanContent.includes('[SOURCE_URL]:')) {
    const parts = cleanContent.split('[SOURCE_URL]:');
    cleanContent = parts[0].trim();
    if (parts[1]) {
      extractedLink = parts[1].trim().split('\n')[0];
    }
  }

  return (
    <div style={{ background: bg, color: '#f3f4f6', minHeight: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', fontFamily: 'sans-serif' }}>
      
      {/* Header */}
      <header style={{ borderBottom: '1px solid #1f2937', backgroundColor: 'rgba(10, 10, 15, 0.85)', position: 'sticky', top: 0, zIndex: 50, backdropFilter: 'blur(12px)' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '16px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Link href={`/${lang}`} style={{ fontSize: '24px', fontWeight: 'bold', textDecoration: 'none', color: '#22d3ee', letterSpacing: '1px' }}>
            GTA6<span style={{ color: '#f43f5e' }}>.SK</span>
          </Link>
          <Link href={`/${lang}`} style={{ fontSize: '14px', color: '#9ca3af', textDecoration: 'none', fontWeight: 'bold', transition: 'color 0.2s' }}>
            {t.back}
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main style={{ maxWidth: '850px', margin: '0 auto', padding: '48px 24px', flexGrow: 1, width: '100%', boxSizing: 'border-box' }}>
        <article style={{ backgroundColor: 'rgba(22, 22, 30, 0.85)', border: `1px solid ${isLeak ? 'rgba(244, 63, 94, 0.4)' : '#1f2937'}`, borderRadius: '16px', padding: '40px', backdropFilter: 'blur(10px)', boxShadow: '0 8px 30px rgba(0,0,0,0.5)' }}>
          
          <div style={{ fontSize: '11px', color: isLeak ? '#f43f5e' : '#22d3ee', fontWeight: 'bold', textTransform: 'uppercase', marginBottom: '12px', letterSpacing: '1px' }}>
            ● {article.category}
          </div>

          <h1 style={{ fontSize: '32px', fontWeight: '800', color: '#fff', marginBottom: '20px', lineHeight: '1.25' }}>
            {article.title}
          </h1>

          <div style={{ fontSize: '13px', color: '#9ca3af', marginBottom: '24px', borderBottom: '1px solid #1f2937', paddingBottom: '16px', display: 'flex', justifyContent: 'space-between' }}>
            <span>{t.publishedAt}: {article.date || 'Dnes'}</span>
            <span style={{ color: '#4b5563' }}>Redakcia GTA6.sk</span>
          </div>

          {article.imageUrl && (
            <div style={{ width: '100%', maxHeight: '420px', overflow: 'hidden', borderRadius: '12px', marginBottom: '32px', border: '1px solid #1f2937', backgroundColor: '#000' }}>
              <img src={article.imageUrl} alt={article.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
          )}

          {/* Celý text článku bez HTML šumu */}
          <div style={{ color: '#d1d5db', fontSize: '17px', lineHeight: '1.8', whiteSpace: 'pre-wrap', marginBottom: '40px', wordBreak: 'break-word' }}>
            {cleanContent}
          </div>

          {/* Elegantné tlačidlo na presmerovanie na zdroj */}
          <div style={{ borderTop: '1px solid #1f2937', paddingTop: '28px', display: 'flex', justifyContent: 'flex-start' }}>
            <a 
              href={extractedLink} 
              target="_blank" 
              rel="noopener noreferrer" 
              style={{ 
                backgroundColor: isLeak ? '#f43f5e' : '#22d3ee', 
                color: isLeak ? '#fff' : '#000', 
                padding: '12px 24px', 
                borderRadius: '10px', 
                fontSize: '14px', 
                fontWeight: 'bold', 
                textDecoration: 'none', 
                boxShadow: isLeak ? '0 4px 15px rgba(244, 63, 94, 0.4)' : '0 4px 15px rgba(34, 211, 238, 0.4)',
                transition: 'transform 0.2s'
              }}
            >
              {t.sourceButton}
            </a>
          </div>

        </article>
      </main>

      {/* Footer */}
      <footer style={{ borderTop: '1px solid #1f2937', backgroundColor: 'rgba(10, 10, 15, 0.9)', color: '#9ca3af', fontSize: '12px', padding: '32px 24px', textAlign: 'center' }}>
        <p>{t.disclaimer}</p>
      </footer>
    </div>
  );
}