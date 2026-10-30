import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Floci Studio',
  description: 'AWS Visual Cloud Infrastructure Playground',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="bg-zinc-950 text-zinc-100 antialiased selection:bg-rose-500/20">
        {children}
      </body>
    </html>
  );
}

