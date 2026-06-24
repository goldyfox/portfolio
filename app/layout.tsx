import type { Metadata } from "next";
import { Inter, Newsreader } from "next/font/google";
import Link from "next/link";
import { MainNav } from "@/components/main-nav";
import { FooterNav } from "@/components/footer-nav";
import { FlipTitle } from "@/components/flip-title";
import { SITE_CONTENT_SHELL } from "@/lib/site-layout";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const newsreader = Newsreader({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  style: ["normal", "italic"],
  variable: "--font-newsreader",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://www.lisaaufox.com"),
  title: "Lisa Aufox — Product Design",
  description:
    "Portfolio of Lisa Aufox, a product designer working at the intersection of AI, monetization, and messaging at Meta.",
  openGraph: {
    title: "Lisa Aufox — Product Design",
    description:
      "Portfolio of Lisa Aufox, a product designer working at the intersection of AI, monetization, and messaging at Meta.",
    url: "/",
    siteName: "Lisa Aufox",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Lisa Aufox — Product Design",
    description:
      "Portfolio of Lisa Aufox, a product designer working at the intersection of AI, monetization, and messaging at Meta.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${newsreader.variable} h-full antialiased`}
    >
      <body className="min-h-full">
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
          rel="stylesheet"
        />
        <div className="azure-halo" aria-hidden />
        <div className="relative z-10 flex min-h-full flex-col">
          <header className="pointer-events-auto fixed top-0 right-0 left-0 z-50 isolate border-b border-transparent bg-ethos-cream/80 backdrop-blur-[12px]">
            <div
              className={`relative z-10 flex flex-wrap items-center gap-4 py-5 min-[975px]:gap-8 ${SITE_CONTENT_SHELL}`}
            >
              <Link
                href="/"
                aria-label="Lisa Aufox, Product Design"
                className="order-1 site-title-link inline-flex flex-wrap items-baseline gap-x-0 font-sans text-[14px] tracking-[0.1em] text-gray-900 uppercase"
              >
                <span className="font-serif text-[18px] leading-none font-bold text-ethos-blue italic normal-case tracking-normal">
                  Lisa Aufox
                </span>
                <span
                  className="not-italic inline-block shrink-0 py-0 pl-[0.5em] pr-[0.58em] text-center font-sans text-[14px] leading-none tracking-normal text-gray-900"
                  aria-hidden
                >
                  |
                </span>
                <FlipTitle />
              </Link>

              <Link
                href="/contact"
                aria-label="Contact"
                className="group relative order-2 ml-auto -translate-y-[2.5px] min-[975px]:order-3 min-[975px]:ml-0 min-[975px]:-translate-y-[1px]"
              >
                <svg
                  className="transition-opacity duration-200 group-hover:opacity-0"
                  width="18"
                  height="18"
                  viewBox="0 0 18 18"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden
                >
                  <rect x="0.5" y="5" width="17" height="12" rx="1" />
                  <path d="M0.5 5L9 13L17.5 5" />
                </svg>
                <svg
                  className="absolute inset-0 opacity-0 transition-opacity duration-200 group-hover:opacity-100"
                  width="18"
                  height="18"
                  viewBox="0 0 18 18"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden
                >
                  <path d="M0.5 5V17H17.5V5" />
                  <polygon points="0.5,5 9,0.5 17.5,5" fill="#1313ec" stroke="currentColor" />
                  <polygon points="0.5,5 9,13 17.5,5" fill="#1313ec" stroke="currentColor" />
                  <path d="M0.5 5L9 0.5L17.5 5" />
                </svg>
              </Link>

              <div className="order-3 basis-full min-[975px]:order-2 min-[975px]:basis-auto min-[975px]:flex-1">
                <MainNav />
              </div>
            </div>
          </header>

          <main className="relative z-0 flex flex-1 flex-col pt-[7rem] min-[975px]:pt-[5.5rem]">
            <div className={`flex min-h-0 flex-1 flex-col ${SITE_CONTENT_SHELL}`}>
              {children}
            </div>
          </main>

          <footer className="border-t border-gray-900/10 bg-ethos-cream">
            <div
              className={`flex items-baseline justify-between gap-3 py-4 ${SITE_CONTENT_SHELL}`}
            >
              <p className="font-sans text-[13px] leading-tight tracking-[0.08em] text-gray-600 uppercase">
                © {new Date().getFullYear()} Lisa Aufox
              </p>
              <FooterNav />
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}
