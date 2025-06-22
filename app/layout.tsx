import type { Metadata } from 'next';
import './globals.css';
import '@/styles/mobile.css';
import { AppProvider } from '@/contexts/AppContext';

export const metadata: Metadata = {
  title: 'SnapDish - 智能菜单扫描',
  description: '拍照扫描菜单，AI智能分析菜品信息，为您推荐美食',
  generator: 'SnapDish',
  viewport:
    'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no, viewport-fit=cover',
  themeColor: '#8B7355',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'SnapDish',
  },
  formatDetection: {
    telephone: false,
    email: false,
    address: false,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <head>
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="SnapDish" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="msapplication-TileColor" content="#8B7355" />
        <meta name="msapplication-tap-highlight" content="no" />
        <link rel="apple-touch-icon" href="/icon-192x192.png" />
        <link rel="manifest" href="/manifest.json" />
      </head>
      <body className="antialiased">
        <AppProvider>{children}</AppProvider>
      </body>
    </html>
  );
}
