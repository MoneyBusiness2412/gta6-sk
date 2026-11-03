// src/lib/i18n.ts
export type Language = 'sk' | 'cs' | 'en';

export const LANGUAGES: Language[] = ['sk', 'cs', 'en'];

export const i18nDictionary = {
  sk: {
    nav: {
      news: "Novinky",
      official: "Oficiálne",
      leaks: "Úniky",
      media: "Médiá",
    },
    footer: {
      disclaimer: "GTA6.SK je nezávislý fanúšikovský portál. Nie je prepojený s Rockstar Games ani Take-Two Interactive.",
      rights: "Všetky práva vyhradené.",
    }
  },
  cs: {
    nav: {
      news: "Novinky",
      official: "Oficiální",
      leaks: "Úniky",
      media: "Média",
    },
    footer: {
      disclaimer: "GTA6.SK je nezávislý fanouškovský portál. Není propojen s Rockstar Games ani Take-Two Interactive.",
      rights: "Všechna práva vyhrazena.",
    }
  },
  en: {
    nav: {
      news: "News",
      official: "Official",
      leaks: "Leaks",
      media: "Media",
    },
    footer: {
      disclaimer: "GTA6.SK is an independent fan portal. Not affiliated with Rockstar Games or Take-Two Interactive.",
      rights: "All rights reserved.",
    }
  }
};