import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { Toaster } from "sonner";

const inter = Inter({ subsets: ["latin"] });

// Metadata for the application (SEO and page information)
export const metadata: Metadata = {
  title: "Chat App",
  description: "A Next.js chat application with AI assistance",
};

/**
 * Root layout component that wraps all pages.
 * Provides:
 * - Basic HTML structure
 * - Global font (Inter)
 * - Theme provider for dark/light mode
 * - Supabase authentication context
 * 
 * @param children - The page content to be rendered
 */
export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Initialize Supabase for server components
  const cookieStore = cookies();
  const supabase = createServerClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
        set(name: string, value: string, options: any) {
          cookieStore.set({ name, value, ...options });
        },
        remove(name: string, options: any) {
          cookieStore.set({ name, value: '', ...options });
        },
      },
    }
  );

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
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
