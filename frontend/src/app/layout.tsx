import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Laravel 13 + Next.js 16 REST API Monorepo',
  description: 'Full-stack application powered by Laravel 13 (PHP 8.4 REST API), Next.js 16.3 (Node 26), and MySQL 9.7 Database',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="antialiased min-h-screen flex flex-col selection:bg-indigo-500 selection:text-white">
        {children}
      </body>
    </html>
  );
}
