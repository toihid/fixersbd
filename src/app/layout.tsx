import type { Metadata } from "next";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import { Toaster } from "sonner";
import { AuthProvider } from "@/components/providers/AuthProvider";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "FixersBD - Find Trusted Local Workers in Bangladesh",
    template: "%s | FixersBD",
  },
  description:
    "Find verified electricians, plumbers, mechanics, and skilled workers near you in Bangladesh. Trusted, fast, and easy.",
  keywords: [
    "FixersBD",
    "local workers Bangladesh",
    "electrician near me",
    "plumber Bangladesh",
    "handyman service",
    "skilled workers",
  ],
  openGraph: {
    title: "FixersBD - Find Trusted Local Workers",
    description: "Your trusted local worker marketplace in Bangladesh",
    type: "website",
    locale: "en_BD",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen flex flex-col">
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <AuthProvider>
            <Navbar />
            <main className="flex-1">{children}</main>
            <Footer />
            <Toaster position="top-right" richColors />
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
