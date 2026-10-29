import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from 'sonner';
import { ThemeProvider } from '@/theme/ThemeProvider';

export const metadata: Metadata = {
  title: {
    default: 'Floci Studio | Home',
    template: 'Floci Studio | %s',
  },
  description: 'Drag-and-drop local cloud infrastructure playground with live Floci runtime',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full w-full">
      <body className="antialiased h-full w-full overflow-hidden">
        <ThemeProvider>
          {children}
        </ThemeProvider>
        <Toaster position="bottom-right" richColors />
      </body>
    </html>
  );
}
