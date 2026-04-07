import { ThemeProvider } from "@/components/theme-provider"
import { Metadata, Viewport } from "next";
import "@/styles/global.css";
import { Inter, DM_Sans, JetBrains_Mono } from "next/font/google";
export const metadata: Metadata = {
  title: "Remotion rendering on Vercel Sandbox",
  description: "Remotion rendering on Vercel Sandbox",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

const fontSans = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

const fontSerif = DM_Sans({
  subsets: ["latin"],
  variable: "--font-serif",
});

const fontMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
});


export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={` bg-background ${fontSans.variable} ${fontSerif.variable} ${fontMono.variable} antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
          themes={["light", "dark", "zen-dark","zen-light"]} 
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
