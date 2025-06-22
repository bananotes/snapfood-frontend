import type { Metadata, Viewport } from 'next';
import './globals.css';
import '@/styles/mobile.css';
import { AppProvider } from '@/contexts/AppContext';
import { I18nProvider } from '@/contexts/I18nContext';
import LanguageSwitcher from '@/components/LanguageSwitcher';

export const metadata: Metadata = {
  title: 'SnapDish - 智能菜单扫描',
  description: '拍照扫描菜单，AI智能分析菜品信息，为您推荐美食',
  generator: 'SnapDish',
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

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: 'cover',
  themeColor: '#8B7355',
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
        <I18nProvider>
          <AppProvider>
            <div className="absolute top-4 right-4 z-50">
              <LanguageSwitcher />
            </div>
            {children}
          </AppProvider>
        </I18nProvider>
      </body>
    </html>
  );
}
