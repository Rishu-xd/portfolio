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
          className="fixed bottom-4 left-4 z-30 flex items-center rounded-full border border-white/10 bg-[#111]/90 p-1 text-[11px] text-white shadow-lg backdrop-blur lg:bottom-auto lg:left-[calc(50%+320px)] lg:top-4"
        >
          <a href="#chooser" className="whitespace-nowrap rounded-full px-2 py-2 transition-colors hover:bg-white/10">
            Choose
          </a>
          <a href="#current" className="whitespace-nowrap rounded-full px-2 py-2 transition-colors hover:bg-white/10">
            Original
          </a>
          <a href="#alternate" className="whitespace-nowrap rounded-full px-2 py-2 transition-colors hover:bg-white/10">
            New UI
          </a>
        </nav>
        {children}
      </body>
    </html>
  );
}
