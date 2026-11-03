// src/app/api/articles/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET: Načítanie všetkých článkov
export async function GET() {
  try {
    const articles = await prisma.article.findMany({
      orderBy: { id: 'desc' },
    });
    return NextResponse.json(articles);
  } catch (error) {
    console.error('Chyba pri načítavaní článkov:', error);
    return NextResponse.json({ error: 'Nepodarilo sa načítať články' }, { status: 500 });
  }
}

// POST: Vytvorenie nového článku
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { title, content, category, imageUrl, language, status } = body;

    const newArticle = await prisma.article.create({
      data: {
        title,
        content,
        category,
        imageUrl: imageUrl || '',
        language: language || 'sk',
        status: status || 'Published',
        date: new Date().toLocaleDateString('sk-SK'),
      },
    });

    return NextResponse.json(newArticle, { status: 201 });
  } catch (error) {
    console.error('Chyba pri vytváraní článku:', error);
    return NextResponse.json({ error: 'Nepodarilo sa vytvoriť článok' }, { status: 500 });
  }
}

// DELETE: Zmazanie článku
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Chýba ID článku' }, { status: 400 });
    }

    await prisma.article.delete({
      where: { id: Number(id) },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Chyba pri mazaní článku:', error);
    return NextResponse.json({ error: 'Nepodarilo sa zmazať článok' }, { status: 500 });
  }
}