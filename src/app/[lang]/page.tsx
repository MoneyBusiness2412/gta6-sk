// src/app/[lang]/page.tsx
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

const translations: Record<string, any> = {
  sk: { 
    title: 'GTA VI - Slovenský portál', 
    subtitle: 'Všetky novinky, úniky a oficiálne informácie na jednom mieste.', 
    days: 'Dní', hours: 'Hodín', minutes: 'Minút', seconds: 'Sekúnd',
    readMore: 'Čítať viac →',
    admin: 'Admin Panel',
    categories: { all: 'Všetky', leaks: 'Úniky', official: 'Oficiálne' }
  },
  cs: { 
    title: 'GTA VI - Český portál', 
    subtitle: 'Všechny novinky, úniky a oficiální informace na jednom místě.', 
    days: 'Dnů', hours: 'Hodin', minutes: 'Minut', seconds: 'Sekund',
    readMore: 'Číst více →',
    admin: 'Admin Panel',
    categories: { all: 'Všechny', leaks: 'Úniky', official: 'Oficiální' }
  },
  en: { 
    title: 'GTA VI - News Portal', 
    subtitle: 'All the latest news, leaks, and official info in one place.', 
    days: 'Days', hours: 'Hours', minutes: 'Minutes', seconds: 'Seconds',
    readMore: 'Read more →',
    admin: 'Admin Panel',
    categories: { all: 'All', leaks: 'Leaks', official: 'Official' }
  }
};

export default function HomePage({ 
  params, 
  searchParams 
}: { 
  params: { lang: string }; 
  searchParams: { cat?: string } 
}) {
  const lang = ['sk', 'cs', 'en'].includes(params.lang) ? params.lang : 'sk';
  const t = translations[lang];
  const selectedCategory = searchParams.cat || 'all';

  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null);

  useEffect(() => {
    const targetTime = new Date('2026-11-19T01:00:00+01:00').getTime();

    const updateCountdown = () => {
      const now = new Date().getTime();
      const difference = targetTime - now;

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        });
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    };

    updateCountdown();
    const timer = setInterval(updateCountdown, 1000);

    return () => clearInterval(timer);
  }, []);

  const [articles, setArticles] = useState<any[]>([]);

  useEffect(() => {
    fetch('/api/articles')
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          // Tu vyfiltrujeme iba podľa kategórie, aby sa články zobrazovali v každom jazyku (SK/CS/EN)
          const filtered = data.filter((art: any) => {
            if (art.status && art.status !== 'Published') return false;
            if (selectedCategory === 'leaks' && art.category !== 'Úniky') return false;
            if (selectedCategory === 'official' && art.category !== 'Oficiálne') return false;
            return true;
          });
          setArticles(filtered);
        }
      })
      .catch((err) => console.error('Chyba načítania:', err));
  }, [lang, selectedCategory]);

  const activeOrHover = hoveredCategory || selectedCategory;
  let bgHue = 190;
  if (activeOrHover === 'leaks') bgHue = 345;
  if (activeOrHover === 'official') bgHue = 270;

  return (
    <div style={{ 
      background: `radial-gradient(circle at 50% 15%, hsla(${bgHue}, 80%, 25%, 0.3) 0%, rgba(10, 10, 15, 1) 65%), #0a0a0f`,
      color: '#f3f4f6', 
      minHeight: '100vh', 
      fontFamily: 'sans-serif', 
      display: 'flex', 
      flexDirection: 'column', 
      justifyContent: 'space-between',
      transition: 'background 0.5s ease-in-out'
    }}>
      
      {/* Header */}
      <header style={{ borderBottom: '1px solid #1f2937', backgroundColor: 'rgba(10, 10, 15, 0.85)', position: 'sticky', top: 0, zIndex: 50, backdropFilter: 'blur(12px)' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '16px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Link href={`/${lang}`} style={{ fontSize: '24px', fontWeight: 'bold', textDecoration: 'none', color: '#22d3ee', letterSpacing: '1px' }}>
            GTA6<span style={{ color: '#f43f5e' }}>.SK</span>
          </Link>
          <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
            <Link href={`/${lang}/admin`} style={{ fontSize: '13px', color: '#9ca3af', textDecoration: 'none', border: '1px solid #1f2937', padding: '6px 12px', borderRadius: '8px', backgroundColor: '#16161e' }}>
              {t.admin}
            </Link>
            <div style={{ display: 'flex', gap: '8px', fontSize: '14px' }}>
              <Link href="/sk" style={{ color: lang === 'sk' ? '#22d3ee' : '#9ca3af', textDecoration: 'none', fontWeight: 'bold' }}>SK</Link>
              <Link href="/cs" style={{ color: lang === 'cs' ? '#22d3ee' : '#9ca3af', textDecoration: 'none', fontWeight: 'bold' }}>CS</Link>
              <Link href="/en" style={{ color: lang === 'en' ? '#22d3ee' : '#9ca3af', textDecoration: 'none', fontWeight: 'bold' }}>EN</Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section & Live Countdown */}
      <main style={{ maxWidth: '1200px', margin: '0 auto', padding: '48px 24px', flexGrow: 1, width: '100%', boxSizing: 'border-box' }}>
        <div style={{ textAlign: 'center', marginBottom: '36px' }}>
          <h1 style={{ fontSize: '42px', fontWeight: '900', color: '#fff', marginBottom: '12px', textShadow: '0 0 20px rgba(244,63,94,0.3)' }}>{t.title}</h1>
          <p style={{ color: '#9ca3af', fontSize: '16px', marginBottom: '32px' }}>{t.subtitle}</p>
          
          {/* Živý odpočet box */}
          <div style={{ 
            display: 'inline-flex', 
            gap: '20px', 
            backgroundColor: 'rgba(22, 22, 30, 0.7)', 
            border: '1px solid rgba(255, 255, 255, 0.1)', 
            padding: '16px 32px', 
            borderRadius: '16px',
            backdropFilter: 'blur(10px)',
            boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
            marginBottom: '30px'
          }}>
            <div style={{ textAlign: 'center' }}><span style={{ fontSize: '24px', fontWeight: 'bold', color: '#22d3ee', display: 'block' }}>{timeLeft.days}</span><span style={{ fontSize: '11px', color: '#9ca3af', textTransform: 'uppercase' }}>{t.days}</span></div>
            <div style={{ fontSize: '24px', color: '#4b5563' }}>:</div>
            <div style={{ textAlign: 'center' }}><span style={{ fontSize: '24px', fontWeight: 'bold', color: '#f43f5e', display: 'block' }}>{timeLeft.hours}</span><span style={{ fontSize: '11px', color: '#9ca3af', textTransform: 'uppercase' }}>{t.hours}</span></div>
            <div style={{ fontSize: '24px', color: '#4b5563' }}>:</div>
            <div style={{ textAlign: 'center' }}><span style={{ fontSize: '24px', fontWeight: 'bold', color: '#a855f7', display: 'block' }}>{timeLeft.minutes}</span><span style={{ fontSize: '11px', color: '#9ca3af', textTransform: 'uppercase' }}>{t.minutes}</span></div>
            <div style={{ fontSize: '24px', color: '#4b5563' }}>:</div>
            <div style={{ textAlign: 'center' }}><span style={{ fontSize: '24px', fontWeight: 'bold', color: '#fbbf24', display: 'block' }}>{timeLeft.seconds}</span><span style={{ fontSize: '11px', color: '#9ca3af', textTransform: 'uppercase' }}>{t.seconds}</span></div>
          </div>
        </div>

        {/* Categories Filter */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '12px', marginBottom: '48px' }}>
          <Link 
            href={`/${lang}`} 
            onMouseEnter={() => setHoveredCategory('all')}
            onMouseLeave={() => setHoveredCategory(null)}
            style={{ padding: '8px 20px', borderRadius: '20px', fontSize: '14px', textDecoration: 'none', backgroundColor: selectedCategory === 'all' ? '#22d3ee' : '#16161e', color: selectedCategory === 'all' ? '#000' : '#9ca3af', fontWeight: 'bold', border: '1px solid #1f2937', transition: 'all 0.2s' }}
          >
            {t.categories.all}
          </Link>
          <Link 
            href={`/${lang}?cat=leaks`} 
            onMouseEnter={() => setHoveredCategory('leaks')}
            onMouseLeave={() => setHoveredCategory(null)}
            style={{ padding: '8px 20px', borderRadius: '20px', fontSize: '14px', textDecoration: 'none', backgroundColor: selectedCategory === 'leaks' ? '#f43f5e' : '#16161e', color: selectedCategory === 'leaks' ? '#fff' : '#9ca3af', fontWeight: 'bold', border: '1px solid #1f2937', transition: 'all 0.2s' }}
          >
            {t.categories.leaks}
          </Link>
          <Link 
            href={`/${lang}?cat=official`} 
            onMouseEnter={() => setHoveredCategory('official')}
            onMouseLeave={() => setHoveredCategory(null)}
            style={{ padding: '8px 20px', borderRadius: '20px', fontSize: '14px', textDecoration: 'none', backgroundColor: selectedCategory === 'official' ? '#a855f7' : '#16161e', color: selectedCategory === 'official' ? '#fff' : '#9ca3af', fontWeight: 'bold', border: '1px solid #1f2937', transition: 'all 0.2s' }}
          >
            {t.categories.official}
          </Link>
        </div>

        {/* Articles Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '28px' }}>
          {articles.map((article: any) => {
            const isLeak = article.category === 'Úniky';
            return (
              <Link 
                key={article.id} 
                href={`/${lang}/clanky/${article.id}`} 
                style={{ textDecoration: 'none', color: 'inherit', display: 'flex' }}
              >
                <div style={{ 
                  backgroundColor: 'rgba(22, 22, 30, 0.85)', 
                  border: `1px solid ${isLeak ? 'rgba(244, 63, 94, 0.4)' : '#1f2937'}`, 
                  borderRadius: '16px', 
                  overflow: 'hidden', 
                  display: 'flex', 
                  flexDirection: 'column', 
                  width: '100%',
                  backdropFilter: 'blur(10px)',
                  transition: 'transform 0.2s, border-color 0.2s',
                  boxShadow: isLeak ? '0 4px 20px rgba(244, 63, 94, 0.1)' : '0 4px 20px rgba(0,0,0,0.3)'
                }}>
                  {article.imageUrl ? (
                    <div style={{ height: '210px', width: '100%', overflow: 'hidden', backgroundColor: '#000' }}>
                      <img src={article.imageUrl} alt={article.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </div>
                  ) : (
                    <div style={{ height: '120px', width: '100%', background: 'linear-gradient(45deg, #1f2937, #111827)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#4b5563', fontSize: '12px', fontWeight: 'bold' }}>
                      GTA6.SK MEDIA
                    </div>
                  )}
                  <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', flexGrow: 1, justifyContent: 'space-between' }}>
                    <div>
                      <div style={{ fontSize: '11px', color: isLeak ? '#f43f5e' : '#22d3ee', fontWeight: 'bold', textTransform: 'uppercase', marginBottom: '8px', letterSpacing: '0.5px' }}>
                        ● {article.category}
                      </div>
                      <h2 style={{ fontSize: '18px', fontWeight: 'bold', color: '#fff', marginBottom: '12px', lineHeight: '1.4' }}>
                        {article.title}
                      </h2>
                      <p style={{ fontSize: '14px', color: '#9ca3af', lineHeight: '1.6', marginBottom: '20px' }}>
                        {article.content ? article.content.substring(0, 110) + '...' : ''}
                      </p>
                    </div>
                    <div style={{ fontSize: '13px', color: isLeak ? '#f43f5e' : '#22d3ee', fontWeight: 'bold' }}>
                      {t.readMore}
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </main>

      {/* Footer */}
      <footer style={{ borderTop: '1px solid #1f2937', backgroundColor: 'rgba(10, 10, 15, 0.9)', color: '#9ca3af', fontSize: '12px', padding: '32px 24px', textAlign: 'center', marginTop: '60px' }}>
        <p>GTA6.SK je nezávislý fanúšikovský portál. Všetky práva vyhradené.</p>
      </footer>
    </div>
  );
}