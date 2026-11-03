// src/app/layout.tsx
import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'GTA6.SK | Slovenský herný portál o GTA VI',
  description: 'Všetky novinky, oficiálne správy, úniky a informácie o Grand Theft Auto VI na jednom mieste.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="sk">
      <body className="bg-[#0d0d11] text-gray-100 antialiased min-h-screen selection:bg-purple-600 selection:text-white">
        {children}
      </body>
    </html>
  );
}