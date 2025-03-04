import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";

const inter = Inter({ subsets: ["latin"] });

// Metadata for the application (SEO and page information)
export const metadata: Metadata = {
  title: "Chat App",
  description: "A Next.js chat application",
};

/**
 * Root layout component that wraps all pages
 * Provides the basic HTML structure and applies global fonts
 * 
 * @param children - The page content to be rendered
 */
export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
