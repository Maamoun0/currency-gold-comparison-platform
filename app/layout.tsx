import type { Metadata } from "next";
import { Cairo, Inter } from "next/font/google";
import "@/styles/globals.css";

const cairo = Cairo({
  subsets: ["arabic"],
  variable: "--font-cairo",
  weight: ["400", "700"],
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "منصة أسعار العملات والذهب",
  description: "مقارنة لحظية لأسعار العملات في البنوك المصرية، الذهب، و USDT",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl" suppressHydrationWarning>
      <body className={`${cairo.variable} ${inter.variable} font-cairo antialiased`}>
        {children}
      </body>
    </html>
  );
}
