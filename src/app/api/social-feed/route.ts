// src/app/api/social-feed/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request) {
  try {
    // Voliteľný filter pre jazyk, napr. /api/social-feed?lang=sk
    const { searchParams } = new URL(request.url);
    const lang = searchParams.get('lang') || 'sk';

    // Vyberieme posledných 5 publikovaných článkov
    const articles = await prisma.article.findMany({
      where: {
        status: 'Published',
        language: lang,
      },
      orderBy: { id: 'desc' },
      take: 5,
    });

    // Pripravíme dáta špeciálne optimalizované pre formátovanie na sociálne siete (TikTok/Shorts/IG)
    const socialPayload = articles.map((art) => ({
      id: art.id,
      headline: art.title,
      category: art.category,
      summary: art.content ? art.content.substring(0, 150) + '...' : '',
      image: art.imageUrl || 'https://images.unsplash.com/photo-1542751371-adc38448a05e',
      publishedAt: art.date,
      // Hashtagy generované automaticky na základe kategórie
      hashtags: `#GTA6 #GTA6News #${art.category.replace(/\s+/g, '')} #RockstarGames #Gaming`,
    }));

    return NextResponse.json({
      success: true,
      count: socialPayload.length,
      data: socialPayload,
    });
  } catch (error) {
    console.error('Chyba pri generovaní social feedu:', error);
    return NextResponse.json({ success: false, error: 'Nepodarilo sa načítať dáta pre sociálne siete' }, { status: 500 });
  }
}