import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import Navbar from '@/components/layout/Navbar'; // Import our Navbar component

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Kasese Socials', // Application title
  description: 'Connect and share with your community.', // Application description
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        {/* Render the Navbar at the top of every page */}
        <main>{children}</main>
        <Navbar />
        {/* Main content area for pages */}
        <main>{children}</main>
        {/* You could add a Footer component here later */}
      </body>
    </html>
  );
}
