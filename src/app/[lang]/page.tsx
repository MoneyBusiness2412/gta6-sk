import { prisma } from "@/lib/prisma";

export default async function LangHomePage({
  params,
}: {
  params: { lang: string };
}) {
  const { lang } = params;

  let articles: any[] = [];
  try {
    articles = await prisma.article.findMany({
      orderBy: { id: "desc" },
    });
  } catch (error) {
    console.error("Failed to fetch articles:", error);
  }

  return (
    <main
      style={{
        padding: "40px",
        fontFamily: "sans-serif",
        backgroundColor: "#09090b",
        color: "#fff",
        minHeight: "100vh",
        maxWidth: "1200px",
        margin: "0 auto",
      }}
    >
      <header style={{ marginBottom: "40px", borderBottom: "1px solid #27272a", pb: "20px" }}>
        <h1 style={{ fontSize: "2.5rem", fontWeight: "bold" }}>
          GTA VI News Portal ({lang.toUpperCase()})
        </h1>
        <p style={{ color: "#a1a1aa", marginTop: "8px" }}>
          Najnovšie informácie, novinky a aktualizácie o Grand Theft Auto VI.
        </p>
      </header>

      <section>
        <h2 style={{ fontSize: "1.5rem", marginBottom: "20px" }}>Články</h2>
        {articles.length === 0 ? (
          <p style={{ color: "#71717a" }}>Žiadne články neboli nájdené.</p>
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
              gap: "20px",
            }}
          >
            {articles.map((article) => (
              <article
                key={article.id}
                style={{
                  backgroundColor: "#18181b",
                  borderRadius: "8px",
                  padding: "20px",
                  border: "1px solid #27272a",
                }}
              >
                <h3 style={{ fontSize: "1.25rem", marginBottom: "10px" }}>
                  {article.title}
                </h3>
                <p style={{ color: "#a1a1aa", fontSize: "0.9rem" }}>
                  {article.content
                    ? article.content.substring(0, 120) + "..."
                    : ""}
                </p>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}