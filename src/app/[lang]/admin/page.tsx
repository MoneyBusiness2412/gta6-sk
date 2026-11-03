// src/app/[lang]/admin/page.tsx
import Link from 'next/link';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

const translations: Record<string, any> = {
  sk: { 
    title: 'Admin Panel - Správa článkov', 
    back: '← Späť na web', 
    newArticle: '+ Vytvoriť nový článok', 
    tableTitle: 'Nadpis', 
    tableCategory: 'Kategória', 
    tableStatus: 'Stav', 
    tableActions: 'Akcie',
    edit: 'Upraviť',
    delete: 'Zmazať'
  },
  cs: { 
    title: 'Admin Panel - Správa článků', 
    back: '← Zpět na web', 
    newArticle: '+ Vytvořit nový článek', 
    tableTitle: 'Nadpis', 
    tableCategory: 'Kategorie', 
    tableStatus: 'Stav', 
    tableActions: 'Akce',
    edit: 'Upravit',
    delete: 'Smazat'
  },
  en: { 
    title: 'Admin Panel - Article Management', 
    back: '← Back to website', 
    newArticle: '+ Create New Article', 
    tableTitle: 'Title', 
    tableCategory: 'Category', 
    tableStatus: 'Status', 
    tableActions: 'Actions',
    edit: 'Edit',
    delete: 'Delete'
  }
};

export default async function AdminPage({ params }: { params: { lang: string } }) {
  const lang = ['sk', 'cs', 'en'].includes(params.lang) ? params.lang : 'sk';
  const t = translations[lang];

  let articles: any[] = [];
  try {
    articles = await prisma.article.findMany({
      orderBy: { id: 'desc' },
    });
  } catch (error) {
    console.error("Failed to fetch articles:", error);
  }

  return (
    <div style={{ background: '#0d0d11', color: '#f3f4f6', minHeight: '100vh', fontFamily: 'sans-serif', padding: '40px 24px' }}>
      <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
          <div>
            <Link href={`/${lang}`} style={{ fontSize: '14px', color: '#9ca3af', textDecoration: 'none', display: 'inline-block', marginBottom: '8px' }}>
              {t.back}
            </Link>
            <h1 style={{ fontSize: '28px', fontWeight: 'bold', color: '#fff' }}>{t.title}</h1>
          </div>
          <Link href={`/${lang}/admin/new`} style={{ backgroundColor: '#22d3ee', color: '#000', padding: '10px 20px', borderRadius: '8px', fontSize: '14px', fontWeight: 'bold', textDecoration: 'none' }}>
            {t.newArticle}
          </Link>
        </div>

        <div style={{ backgroundColor: '#16161e', border: '1px solid #1f2937', borderRadius: '12px', overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid #1f2937', color: '#9ca3af', fontSize: '13px', backgroundColor: '#111827' }}>
                <th style={{ padding: '16px' }}>{t.tableTitle}</th>
                <th style={{ padding: '16px' }}>{t.tableCategory}</th>
                <th style={{ padding: '16px' }}>{t.tableStatus}</th>
                <th style={{ padding: '16px', textAlign: 'right' }}>{t.tableActions}</th>
              </tr>
            </thead>
            <tbody>
              {articles.map((article: any) => (
                <tr key={article.id} style={{ borderBottom: '1px solid #1f2937' }}>
                  <td style={{ padding: '16px', fontWeight: 'bold', color: '#fff' }}>{article.title}</td>
                  <td style={{ padding: '16px', color: '#22d3ee' }}>{article.category}</td>
                  <td style={{ padding: '16px', color: '#9ca3af' }}>{article.status}</td>
                  <td style={{ padding: '16px', textAlign: 'right', display: 'flex', gap: '12px', justifyContent: 'flex-end', alignItems: 'center' }}>
                    <Link href={`/${lang}/admin/edit/${article.id}`} style={{ color: '#22d3ee', textDecoration: 'none', fontSize: '14px', fontWeight: 'bold' }}>
                      {t.edit}
                    </Link>
                  </td>
                </tr>
              ))}
              {articles.length === 0 && (
                <tr>
                  <td colSpan={4} style={{ padding: '32px', textAlign: 'center', color: '#9ca3af' }}>Žiadne články.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

      </div>
    </div>
  );
}