// src/app/[lang]/admin/new/page.tsx
import { prisma } from '@/lib/prisma';
import { redirect } from 'next/navigation';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

async function createArticle(formData: FormData) {
  'use server';
  const title = formData.get('title') as string;
  const content = formData.get('content') as string;
  const category = formData.get('category') as string;
  const imageUrl = formData.get('imageUrl') as string;
  const lang = formData.get('lang') as string;

  await prisma.article.create({
    data: {
      title,
      content,
      category,
      imageUrl: imageUrl || null,
      language: lang,
      status: 'Published',
      date: new Date().toLocaleDateString('sk-SK'),
    },
  });

  redirect(`/${lang}/admin`);
}

export default async function NewArticlePage({ params }: { params: { lang: string } }) {
  const lang = ['sk', 'cs', 'en'].includes(params.lang) ? params.lang : 'sk';

  return (
    <div style={{ background: '#0d0d11', color: '#f3f4f6', minHeight: '100vh', fontFamily: 'sans-serif', padding: '40px 24px' }}>
      <div style={{ maxWidth: '700px', margin: '0 auto' }}>
        
        <Link href={`/${lang}/admin`} style={{ fontSize: '14px', color: '#9ca3af', textDecoration: 'none', display: 'inline-block', marginBottom: '16px' }}>
          ← Späť do admin panelu
        </Link>
        <h1 style={{ fontSize: '28px', fontWeight: 'bold', color: '#fff', marginBottom: '24px' }}>Vytvoriť nový článok</h1>

        <form action={createArticle} style={{ backgroundColor: '#16161e', border: '1px solid #1f2937', borderRadius: '12px', padding: '32px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          <input type="hidden" name="lang" value={lang} />

          <div>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: 'bold', marginBottom: '8px', color: '#9ca3af' }}>Nadpis článku</label>
            <input 
              type="text" 
              name="title" 
              required 
              placeholder="Zadajte nadpis..."
              style={{ width: '100%', padding: '12px', borderRadius: '8px', backgroundColor: '#0d0d11', border: '1px solid #1f2937', color: '#fff', fontSize: '15px', boxSizing: 'border-box' }} 
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: 'bold', marginBottom: '8px', color: '#9ca3af' }}>Kategória</label>
            <select 
              name="category" 
              style={{ width: '100%', padding: '12px', borderRadius: '8px', backgroundColor: '#0d0d11', border: '1px solid #1f2937', color: '#fff', fontSize: '15px', boxSizing: 'border-box' }}
            >
              <option value="Úniky">Úniky</option>
              <option value="Oficiálne">Oficiálne</option>
            </select>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: 'bold', marginBottom: '8px', color: '#9ca3af' }}>URL adresa obrázka</label>
            <input 
              type="text" 
              name="imageUrl" 
              placeholder="https://images.unsplash.com/..." 
              style={{ width: '100%', padding: '12px', borderRadius: '8px', backgroundColor: '#0d0d11', border: '1px solid #1f2937', color: '#fff', fontSize: '15px', boxSizing: 'border-box' }} 
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: 'bold', marginBottom: '8px', color: '#9ca3af' }}>Obsah článku</label>
            <textarea 
              name="content" 
              rows={8} 
              required 
              placeholder="Napíšte obsah článku..."
              style={{ width: '100%', padding: '12px', borderRadius: '8px', backgroundColor: '#0d0d11', border: '1px solid #1f2937', color: '#fff', fontSize: '15px', boxSizing: 'border-box', resize: 'vertical' }} 
            />
          </div>

          <button 
            type="submit" 
            style={{ backgroundColor: '#22d3ee', color: '#000', padding: '14px', borderRadius: '8px', fontSize: '16px', fontWeight: 'bold', border: 'none', cursor: 'pointer', marginTop: '10px' }}
          >
            Publikovať článok
          </button>

        </form>

      </div>
    </div>
  );
}