import { ClerkProvider } from "@clerk/nextjs";
import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Providers } from "@/components/Providers";

/**
 * Brand Kit v2 typography — kit fonts only, no substitutes
 * (docs/brand/06-brand-kit-v2.md §4).
 *
 * Cormorant Garamond is the kit's headline font and the only one of the three
 * that is openly licensed (SIL OFL), so it is the loaded serif —
 * **self-hosted** in src/fonts/ because Google Fonts is unreachable from this
 * build machine and a brand's typography cannot depend on a flaky network.
 *
 * Canela (display) and Neue Haas Grotesk (body) are commercial: their names
 * lead the CSS stacks in globals.css and take over automatically once licensed
 * files are installed here. Nothing outside the kit's lineage is ever loaded.
 */
const cormorant = localFont({
  src: [
    { path: "../fonts/cormorant-garamond-var.woff2", weight: "400 600", style: "normal" },
    { path: "../fonts/cormorant-garamond-italic-var.woff2", weight: "400 600", style: "italic" },
  ],
  variable: "--font-cormorant",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://beyondlace.com"),
  title: {
    default: "Beyond Lace — Luxury HD Lace Human Hair Wigs",
    template: "%s — Beyond Lace",
  },
  // Category is stated explicitly and early: the name reads as an intimates
  // brand to search and ad classifiers otherwise. See 05-visual-identity §8.
  description:
    "Luxury human hair wigs and HD Swiss lace units. Hand-tied, pre-plucked, batch-consistent. Beyond Lace. Beyond Beautiful.",
  keywords: [
    "human hair wigs",
    "HD lace wigs",
    "Swiss lace frontal",
    "glueless wigs",
    "virgin Remy hair",
    "wholesale wigs",
    "private label wigs",
  ],
  openGraph: {
    title: "Beyond Lace — Luxury HD Lace Human Hair Wigs",
    description: "We don't sell hair. We sell the version of you that exists beyond the wig.",
    type: "website",
    siteName: "Beyond Lace",
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={cormorant.variable}>
      <body className="min-h-screen antialiased">
        <ClerkProvider>
          <Providers>
            <a
              href="#main"
              className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[100] focus:bg-plum-700 focus:px-4 focus:py-2 focus:text-paper"
            >
              Skip to content
            </a>
            <Header />
            <main id="main">{children}</main>
            <Footer />
          </Providers>
        </ClerkProvider>
      </body>
    </html>
  );
}
