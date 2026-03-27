import type {Metadata} from 'next';
import { Inter, Lora } from 'next/font/google';
import './globals.css'; // Global styles

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' });
const lora = Lora({ subsets: ['latin'], variable: '--font-serif', style: ['normal', 'italic'] });

export const metadata: Metadata = {
  title: 'Zikir Sayacı',
  description: 'Digital Tasbih and Dhikr Counter',
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="en" className={`${inter.variable} ${lora.variable}`}>
      <body className="font-sans antialiased bg-[#1A2E24]" suppressHydrationWarning>{children}</body>
    </html>
  );
}
