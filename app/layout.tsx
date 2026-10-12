import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Torfinn",
  description: "The portfolio of Akhand Veer Singh, a full-stack developer building digital matter that moves.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <nav
          aria-label="Portfolio view switcher"
          className="fixed right-4 top-4 z-30 flex items-center gap-1 rounded-full border border-white/10 bg-[#111]/90 p-1 text-xs text-white shadow-lg backdrop-blur sm:right-6 sm:top-6"
        >
          <a href="#chooser" className="rounded-full px-3 py-2 transition-colors hover:bg-white/10">
            Choose
          </a>
          <a href="#current" className="rounded-full px-3 py-2 transition-colors hover:bg-white/10">
            Original
          </a>
          <a href="#alternate" className="rounded-full px-3 py-2 transition-colors hover:bg-white/10">
            New design
          </a>
        </nav>
        {children}
      </body>
    </html>
  );
}
