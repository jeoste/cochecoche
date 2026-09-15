import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import { Public_Sans } from "next/font/google";
import { TooltipProvider } from "@/components/ui/tooltip";
import "./globals.css";

const sans = Public_Sans({
  subsets: ["latin"],
  variable: "--font-public-sans",
});

export const metadata: Metadata = {
  title: "CocheCoche",
  description: "La liste de tâches open-source. Coche, date, projets, clients.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="fr" className={`${sans.variable} h-full min-w-0 overflow-x-hidden antialiased`}>
      <body className="flex min-h-full min-w-0 flex-col bg-background text-foreground">
        <ClerkProvider
          appearance={{
            variables: {
              colorPrimary: "#DC4C3E",
              colorBackground: "#ffffff",
              borderRadius: "0.5rem",
              fontFamily:
                "var(--font-public-sans), ui-sans-serif, system-ui, sans-serif",
            },
          }}
        >
          <TooltipProvider>{children}</TooltipProvider>
        </ClerkProvider>
      </body>
    </html>
  );
}
