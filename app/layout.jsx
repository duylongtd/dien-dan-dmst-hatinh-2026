import './globals.css';
import { Be_Vietnam_Pro, JetBrains_Mono } from 'next/font/google';

const display = Be_Vietnam_Pro({
  subsets: ['latin', 'vietnamese'],
  weight: ['400', '500', '600', '700', '800', '900'],
  variable: '--font-display',
  display: 'swap',
});

const mono = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
  variable: '--font-mono',
  display: 'swap',
});

export const metadata = {
  title: 'Diễn đàn ĐMST Hà Tĩnh 2026 — Từ ý tưởng đến thị trường',
  description:
    'Diễn đàn "Từ ý tưởng đến thị trường — Kết nối chuyên gia, nhà đầu tư với khởi nghiệp đổi mới sáng tạo Hà Tĩnh 2026". 08:00, 18/9/2026 tại Khách sạn Đại Bàng, Hà Tĩnh.',
  keywords: [
    'Đổi mới sáng tạo',
    'Khởi nghiệp',
    'Hà Tĩnh',
    'Nhà đầu tư',
    'Diễn đàn',
    'Công nghệ',
  ],
  openGraph: {
    title: 'Diễn đàn ĐMST Hà Tĩnh 2026 — Từ ý tưởng đến thị trường',
    description:
      'Kết nối chuyên gia, nhà đầu tư với khởi nghiệp đổi mới sáng tạo Hà Tĩnh. 18/9/2026.',
    type: 'website',
  },
};

export const viewport = {
  themeColor: '#050B2E',
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({ children }) {
  return (
    <html lang="vi" className={`${display.variable} ${mono.variable}`}>
      <body>{children}</body>
    </html>
  );
}
