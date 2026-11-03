// social-bot.js
// Spustenie v terminale: node social-bot.js

async function fetchSocialFeed() {
  try {
    console.log('🤖 Sťahujem najnovšie dáta pre sociálne siete z GTA6.SK...');
    
    // Voláme naše Next.js API
    const response = await fetch('http://localhost:3000/api/social-feed?lang=sk');
    const result = await response.json();

    if (!result.success || !result.data) {
      console.error('❌ Nepodarilo sa získať dáta.');
      return;
    }

    console.log(`\n✅ Úspešne stiahnutých článkov: ${result.count}\n`);
    console.log('--------------------------------------------------');

    // Prejdeme každý článok a vypíšeme podklady pre video / príspevok
    result.data.forEach((item, index) => {
      console.log(`\n📌 [VIDEO/POST #${index + 1}] ID: ${item.id}`);
      console.log(`📢 NADPIS (HOOK): ${item.headline}`);
      console.log(`📂 KATEGÓRIA: ${item.category}`);
      console.log(`📝 ZHRNUTIE PRE VOICE-OVER: ${item.summary}`);
      console.log(`🖼️ OBRÁZOK URL: ${item.image}`);
      console.log(`🏷️ HASHTAGY: ${item.hashtags}`);
      console.log('--------------------------------------------------');
    });

  } catch (error) {
    console.error('❌ Nastala chyba pri komunikácii s API (Uistite sa, že vám beží npm run dev):', error.message);
  }
}

fetchSocialFeed();