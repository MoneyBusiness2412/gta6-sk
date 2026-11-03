// src/app/[lang]/kategoria/[category]/page.tsx
import Link from 'next/link';
import { prisma } from '@/lib/prisma';

export default async function CategoryPage({ params }: { params: { lang: string; category: string } }) {
  const lang = params.lang === 'cs' || params.lang === 'en' ? params.lang : 'sk';
  
  // Mapovanie URL slugu na reálnu kategóriu v databáze
  const rawCat = decodeURIComponent(params.category).toLowerCase();
  
  const categoryMap: Record<string, string> = {
    novinky: 'Novinky',
    oficialne: 'Oficiálne',
    uniky: 'Úniky',
    media: 'Médiá',
  };

  const dbCategory = categoryMap[rawCat] || 'Novinky';

  // Načítanie publikovaných článkov pre danú kategóriu a jazyk z databázy
  const articles = await prisma.article.findMany({
    where: {
      status: 'Published',
      category: dbCategory,
      language: lang, // Správne definovaný jazyk
    },
    orderBy: { id: 'desc' },
  });

  return (
    <div style={{ backgroundColor: '#0d0d11', color: '#f3f4f6', minHeight: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', fontFamily: 'sans-serif' }}>
      
      {/* Header */}
      <header style={{ borderBottom: '1px solid #1f2937', backgroundColor: 'rgba(13, 13, 17, 0.95)', position: 'sticky', top: 0, zIndex: 50 }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '16px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Link href={`/${lang}`} style={{ fontSize: '24px', fontWeight: 'bold', textDecoration: 'none', color: '#22d3ee' }}>
            GTA6<span style={{ color: '#a855f7' }}>.SK</span>
          </Link>
          <Link href={`/${lang}`} style={{ fontSize: '14px', color: '#9ca3af', textDecoration: 'none', fontWeight: '600' }}>
            ← Späť na prehľad
          </Link>
        </div>
      </header>

      {/* Main content */}
      <main style={{ maxWidth: '1000px', margin: '0 auto', padding: '48px 24px', flexGrow: 1, width: '100%', boxSizing: 'border-box' }}>
        <h1 style={{ fontSize: '28px', fontWeight: 'bold', marginBottom: '32px', color: '#ffffff', borderBottom: '1px solid #1f2937', paddingBottom: '12px' }}>
          Kategória: {dbCategory}
        </h1>

        {articles.length > 0 ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
            {articles.map((art) => (
              <div key={art.id} style={{ backgroundColor: '#16161e', border: '1px solid #1f2937', borderRadius: '12px', padding: '20px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ fontSize: '11px', color: '#a855f7', fontWeight: 'bold', textTransform: 'uppercase', marginBottom: '8px' }}>
                    {art.category}
                  </div>
                  <Link href={`/${lang}/clanky/${art.id}`} style={{ textDecoration: 'none' }}>
                    <h3 style={{ fontSize: '16px', fontWeight: 'bold', color: '#ffffff', marginBottom: '12px', lineHeight: '1.4' }}>
                      {art.title}
                    </h3>
                  </Link>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '16px', borderTop: '1px solid #1f2937', paddingTop: '12px' }}>
                  <span style={{ fontSize: '12px', color: '#9ca3af' }}>{art.date}</span>
                  <Link href={`/${lang}/clanky/${art.id}`} style={{ fontSize: '12px', color: '#22d3ee', textDecoration: 'none', fontWeight: 'bold' }}>
                    Čítať →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p style={{ color: '#9ca3af', fontSize: '16px' }}>V tejto kategórii zatiaľ nie sú žiadne publikované články pre zvolený jazyk.</p>
        )}
      </main>

      {/* Footer */}
      <footer style={{ borderTop: '1px solid #1f2937', backgroundColor: '#0a0a0e', color: '#9ca3af', fontSize: '12px', padding: '32px 24px', textAlign: 'center' }}>
        <p>© 2026 GTA6.SK. Všetky práva vyhradené.</p>
      </footer>
    </div>
  );
}