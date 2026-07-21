import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Task Management System',
  description: 'Full-stack Task Management Application with Next.js, Node.js, Express & PostgreSQL',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-slate-50 antialiased text-slate-900">
        {children}
      </body>
    </html>
  );
}
