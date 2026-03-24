import type { Metadata, Viewport } from "next";
import { Orbitron, Inter, Noto_Sans_SC, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const orbitron = Orbitron({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});

const notoSansSC = Noto_Sans_SC({
  subsets: ["latin"],
  variable: "--font-noto",
  display: "swap",
  weight: ["300", "400", "500", "700"],
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
  weight: ["400", "500", "600"],
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#050a15",
};

export const metadata: Metadata = {
  metadataBase: new URL("https://lingqitech.com"),
  title: {
    default: "软件加工厂 | AI-Driven Software Development",
    template: "%s | 软件加工厂",
  },
  description:
    "软件加工厂 - 纯AI驱动的软件开发公司。与AI对话，即可获得网站、小程序、游戏等数字产品。",
  keywords: [
    "AI开发",
    "软件开发",
    "软件加工厂",
    "网站开发",
    "小程序开发",
    "游戏开发",
    "AI定制",
  ],
  icons: {
    icon: "/logo.avif",
    apple: "/logo.avif",
  },
  openGraph: {
    title: "软件加工厂 | AI-Driven Software Development",
    description:
      "纯AI驱动的软件开发公司。与AI对话，即可获得网站、小程序、游戏等数字产品。",
    url: "https://lingqitech.com",
    siteName: "软件加工厂",
    locale: "zh_CN",
    type: "website",
    images: [
      {
        url: "/logo.avif",
        width: 800,
        height: 800,
        alt: "软件加工厂",
      },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="zh-CN"
      className={`${orbitron.variable} ${inter.variable} ${notoSansSC.variable} ${jetbrainsMono.variable}`}
    >
      <body className="min-h-screen bg-bg-primary text-text-primary font-body antialiased">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[10000] focus:px-4 focus:py-2 focus:rounded-lg focus:bg-neon-cyan focus:text-bg-deep focus:font-medium focus:text-sm"
        >
          跳转到主要内容
        </a>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              name: "软件加工厂",
              url: "https://lingqitech.com",
              logo: "https://lingqitech.com/logo.avif",
              description: "纯AI驱动的软件开发公司",
            }),
          }}
        />
        {children}
      </body>
    </html>
  );
}
