import type { Metadata } from "next";
import { Figtree, Poppins, Quicksand } from "next/font/google";
import "@/styles/globals.css";
import { Toaster } from "sonner";
import Providers from "./providers";

const poppins = Poppins({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-poppins",
  // preload: true,
  weight: ["300", "400", "500", "600", "700", "800"],
});

const quicksand = Quicksand({
  subsets: ["latin"],
  display: "swap",
  // preload: true,
  variable: "--font-quicksand",
});

const figtree = Figtree({
  subsets: ["latin"],
  display: "swap",
  preload: true,
  variable: "--font-figtree",
});

/**
 * @todo: fix this metadata
 */

export const SiteConfig = {
  baseURL: "https://onlinecrockerystore.com",
  name: "Online Crockery Store",
  title: "Buy Premium Crockery Online | Dinner Sets, Tea Sets & More",
  description:
    "Discover premium crockery online at unbeatable prices. Shop dinner sets, plate sets, bowls, tea sets, glassware, melamine, and ceramic crockery. Perfect for every dining occasion.",
  keywords: [
    "Dinner Set",
    "Melamine",
    "Bowl Set",
    "Ceramic",
    "Opal",
    "Tea Set",
    "Water Set",
    "Jar Set",
  ],
};

const { baseURL, description, name, title, keywords } = SiteConfig;

// prettier-ignore
export const metadata: Metadata = {
  title: title,
  description: description,
  keywords: keywords,
  icons: [{ rel: "icon", url: "/icon.png" }],
  authors: [{ name: "Muhammad Umar Chaudhry", url: "https://www.linkedin.com/in/developer256/" }],
  creator: "Muhammad Umar Chaudhry",
  metadataBase: new URL(baseURL),
  openGraph: { type: "website", locale: "en_US", url: baseURL, title: title, description: description, siteName: name, images: `${baseURL}/opengraph-image.jpg` },
  twitter: {card: "summary_large_image", title: title, description: description, images: `${baseURL}/twitter-image.jpg`}, // creator: "@chaudhry"
  manifest: `${baseURL}/manifest.json`,
  robots: { index: true, follow: true, googleBot: { index: true, follow: true }},
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" style={{ scrollbarWidth: "thin" }}>
      <body
        className={`${figtree.className} ${quicksand.className} ${poppins.className} antialiased`}
      >
        <Providers>
          {children}
          <Toaster
            richColors
            position="bottom-center"
            closeButton
            theme="dark"
          />
        </Providers>
      </body>
    </html>
  );
}
