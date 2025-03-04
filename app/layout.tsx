import type { Metadata } from "next";
import "./globals.css";

// Metadata for the application (SEO and page information)
export const metadata: Metadata = {
  title: "ChatGPT Next.js App",
  description: "A modern chat application built with Next.js and Anthropic's Claude",
};

/**
 * Root layout component that wraps all pages
 * Provides the basic HTML structure and applies global fonts
 * 
 * @param children - The page content to be rendered
 */
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}
