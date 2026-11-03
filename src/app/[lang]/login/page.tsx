// src/app/[lang]/admin/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';

export default function AdminPage() {
  const params = useParams();
  const lang = params?.lang === 'cs' || params?.lang === 'en' ? params.lang : 'sk';

  const [articles, setArticles] = useState<any[]>([]);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('Novinky');
  const [imageUrl, setImageUrl] = useState('');
  const [articleLang, setArticleLang] = useState(lang);
  const [loading, setLoading] = useState(false);

  // Načítanie článkov
  const fetchArticles = async () => {
    try {
      const res = await fetch('/api/articles');
      if (res.ok) {
        const data = await res.json();
        setArticles(data);
      }
    } catch (err) {
      console.error('Chyba pri načítaní:', err);
    }
  };

  useEffect(() => {
    fetchArticles();
  }, []);

  // Pridanie článku
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch('/api/articles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          content,
          category,
          imageUrl,
          language: articleLang,
          status: 'Published',
        }),
      });

      if (res.ok) {
        setTitle('');
        setContent('');
        setImageUrl('');
        fetchArticles();
      }
    } catch (err) {
      console.error('Chyba pri ukladaní:', err);
    } finally {
      setLoading(false);
    }
  };

  // Zmazanie článku
  const handleDelete = async (id: number) => {
    if (!confirm('Naozaj chcete zmazať tento článok?')) return;

    try {
      const res = await fetch(`/api/articles?id=${id}`, { method: 'DELETE' });
      if (res.ok) {
        fetchArticles();
      }
    } catch (err) {
      console.error('Chyba pri mazaní:', err);
    }
  };

  return (
    <div style={{ backgroundColor: '#0d0d11', color: '#f3f4f6', minHeight: '100vh', padding: '40px 24px', fontFamily: 'sans-serif' }}>
      <div style={{ maxWidth: '900px', margin: '0 auto' }}>
        
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px', borderBottom: '1px solid #1f2937', paddingBottom: '16px' }}>
          <h1 style={{ fontSize: '24px', fontWeight: 'bold', color: '#22d3ee' }}>GTA VI – Admin CMS</h1>
          <Link href={`/${lang}`} style={{ color: '#9ca3af', textDecoration: 'none', fontSize: '14px' }}>
            ← Späť na web
          </Link>
        </div>

        {/* Formulár */}
        <form onSubmit={handleSubmit} style={{ backgroundColor: '#16161e', border: '1px solid #1f2937', padding: '24px', borderRadius: '12px', marginBottom: '40px' }}>
          <h2 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '20px', color: '#fff' }}>Pridať nový článok</h2>

          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontSize: '13px', color: '#9ca3af', marginBottom: '6px' }}>Názov článku</label>
            <input 
              type="text" 
              value={title} 
              onChange={(e) => setTitle(e.target.value)} 
              required 
              style={{ width: '100%', backgroundColor: '#0d0d11', border: '1px solid #1f2937', color: '#fff', padding: '10px', borderRadius: '6px', boxSizing: 'border-box' }}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '13px', color: '#9ca3af', marginBottom: '6px' }}>Kategória</label>
              <select 
                value={category} 
                onChange={(e) => setCategory(e.target.value)}
                style={{ width: '100%', backgroundColor: '#0d0d11', border: '1px solid #1f2937', color: '#fff', padding: '10px', borderRadius: '6px' }}
              >
                <option value="Novinky">Novinky</option>
                <option value="Oficiálne">Oficiálne</option>
                <option value="Úniky">Úniky</option>
                <option value="Médiá">Médiá</option>
              </select>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '13px', color: '#9ca3af', marginBottom: '6px' }}>Jazyk</label>
              <select 
                value={articleLang} 
                onChange={(e) => setArticleLang(e.target.value)}
                style={{ width: '100%', backgroundColor: '#0d0d11', border: '1px solid #1f2937', color: '#fff', padding: '10px', borderRadius: '6px' }}
              >
                <option value="sk">Slovenčina (SK)</option>
                <option value="cs">Čeština (CS)</option>
                <option value="en">Angličtina (EN)</option>
              </select>
            </div>
          </div>

          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontSize: '13px', color: '#9ca3af', marginBottom: '6px' }}>URL obrázka (voliteľné)</label>
            <input 
              type="url" 
              value={imageUrl} 
              onChange={(e) => setImageUrl(e.target.value)} 
              placeholder="https://images.unsplash.com/..."
              style={{ width: '100%', backgroundColor: '#0d0d11', border: '1px solid #1f2937', color: '#fff', padding: '10px', borderRadius: '6px', boxSizing: 'border-box' }}
            />
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', fontSize: '13px', color: '#9ca3af', marginBottom: '6px' }}>Obsah článku</label>
            <textarea 
              value={content} 
              onChange={(e) => setContent(e.target.value)} 
              rows={5} 
              required 
              style={{ width: '100%', backgroundColor: '#0d0d11', border: '1px solid #1f2937', color: '#fff', padding: '10px', borderRadius: '6px', boxSizing: 'border-box' }}
            />
          </div>

          <button 
            type="submit" 
            disabled={loading}
            style={{ backgroundColor: '#9333ea', color: '#fff', border: 'none', padding: '12px 24px', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer' }}
          >
            {loading ? 'Ukladám...' : 'Publikovať článok'}
          </button>
        </form>

        {/* Zoznam článkov */}
        <h2 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '16px', color: '#fff' }}>Zoznam článkov v databáze</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {articles.map((art) => (
            <div key={art.id} style={{ backgroundColor: '#16161e', border: '1px solid #1f2937', padding: '16px', borderRadius: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <span style={{ fontSize: '10px', backgroundColor: '#1f2937', color: '#22d3ee', padding: '3px 8px', borderRadius: '4px', textTransform: 'uppercase', marginRight: '8px' }}>
                  {art.language}
                </span>
                <span style={{ fontSize: '10px', backgroundColor: '#1f2937', color: '#a855f7', padding: '3px 8px', borderRadius: '4px', textTransform: 'uppercase', marginRight: '12px' }}>
                  {art.category}
                </span>
                <strong style={{ color: '#fff', fontSize: '14px' }}>{art.title}</strong>
              </div>
              <button 
                onClick={() => handleDelete(art.id)}
                style={{ backgroundColor: 'rgba(239, 68, 68, 0.2)', border: '1px solid #ef4444', color: '#ef4444', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer', fontSize: '12px', fontWeight: 'bold' }}
              >
                Zmazať
              </button>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}