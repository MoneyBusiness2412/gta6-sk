// src/lib/types.ts

export type Language = 'sk' | 'cs' | 'en';
export type TrustLevel = 'OFFICIAL' | 'VERIFIED' | 'RUMOR' | 'LEAK' | 'OPINION';
export type ArticleStatus = 'draft' | 'pending_approval' | 'scheduled' | 'published';

export interface ArticleTranslation {
  id: string;
  articleId: string;
  language: Language;
  slug: string;
  title: string;
  perex: string;
  contentHtml: string;
  seoTitle?: string;
  seoDescription?: string;
}

export interface Article {
  id: string;
  categoryId: string;
  authorId: string;
  status: ArticleStatus;
  trustLevel: TrustLevel;
  featuredImageUrl?: string;
  readingTimeMin: number;
  publishedAt?: string;
  createdAt: string;
  updatedAt: string;
  translations?: Partial<Record<Language, ArticleTranslation>>;
}

export interface Category {
  id: string;
  slugSk: string;
  slugCs: string;
  slugEn: string;
  nameSk: string;
  nameCs: string;
  nameEn: string;
}