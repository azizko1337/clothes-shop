import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/Theme/theme-provider";
import { CartProvider } from "@/context/CartContext";
import GlobalOverlay from "@/components/Layout/GlobalOverlay";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "chandra.store",
  description: "Oficjalna dystrybucja produktów Chandra",
  authors: [{ name: "Chandra" }, { name: "Antoni Załupka", url: "https://azalupka.cc" }],
  keywords: ["chandra", "sklep", "store", "oficjalny sklep", "gadżety", "ubrania", "koszulki", "hoodie"],
};

export const revalidate = 0;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem
            disableTransitionOnChange
          >
            <CartProvider>
              {children}
              <GlobalOverlay />
            </CartProvider>
          </ThemeProvider>
      </body>
    </html>
  );
}
