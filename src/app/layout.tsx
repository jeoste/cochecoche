import type { Metadata } from "next";
import { Figtree, IBM_Plex_Mono, Syne } from "next/font/google";
import { TooltipProvider } from "@/components/ui/tooltip";
import "./globals.css";

const display = Syne({
  subsets: ["latin"],
  variable: "--font-syne",
});

const sans = Figtree({
  subsets: ["latin"],
  variable: "--font-figtree",
});

const mono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-ibm",
});

export const metadata: Metadata = {
  title: "Desk — tâches",
  description: "Liste privée de tâches, alimentée par toi et par l’agent.",
  robots: { index: false, follow: false },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="fr"
      className={`${display.variable} ${sans.variable} ${mono.variable} dark h-full antialiased`}
    >
      <body className="flex min-h-full flex-col bg-background text-foreground">
        <TooltipProvider>{children}</TooltipProvider>
      </body>
    </html>
  );
}
