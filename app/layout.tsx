import type { Metadata, Viewport } from "next";
import { inter, plexSerif, plexMono } from "./fonts";
import "./globals.css";

const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH || "";
const SITE_URL = "https://pole.app";
const TITLE = "Поле — инструмент для книги длиной в год";
const DESCRIPTION =
  "Поле — пространство для длинного нон-фикшн. Источники, аргумент, черновики глав и связи между ними — в одном холсте, который не распадётся за 14 месяцев работы.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: TITLE,
    template: "%s · Поле",
  },
  description: DESCRIPTION,
  applicationName: "Поле",
  authors: [{ name: "Поле", url: SITE_URL }],
  keywords: [
    "non-fiction writing",
    "writing tool",
    "инструмент для книги",
    "long-form writing",
    "research management",
    "second brain",
    "canvas writing",
    "biography writing",
  ],
  icons: {
    icon: `${BASE_PATH}/favicon.png`,
    apple: `${BASE_PATH}/apple-touch-icon.png`,
  },
  openGraph: {
    title: TITLE,
    description: "Длинный нон-фикшн без потери нити.",
    url: SITE_URL,
    siteName: "Поле",
    locale: "ru_RU",
    type: "website",
    images: [
      {
        url: `${BASE_PATH}/og-image.png`,
        width: 1200,
        height: 630,
        alt: "Поле — инструмент для книги длиной в год",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: "Длинный нон-фикшн без потери нити.",
    images: [`${BASE_PATH}/og-image.png`],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: SITE_URL,
  },
  category: "productivity",
};

export const viewport: Viewport = {
  themeColor: "#1e2a2e",
  colorScheme: "dark",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="ru"
      className={`${inter.variable} ${plexSerif.variable} ${plexMono.variable}`}
    >
      <body className="bg-base text-cream font-sans antialiased">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[100] focus:px-3 focus:py-2 focus:bg-anchor focus:text-base-deep focus:font-mono focus:text-[11px] focus:uppercase focus:tracking-[0.22em]"
        >
          к основному контенту
        </a>
        {children}
      </body>
    </html>
  );
}
