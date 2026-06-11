import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import { APP_NAME } from "@/lib/appConfig";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  title: APP_NAME,
  description: "A secure Next.js + Supabase app template with Google OAuth and role-based access",
  // metadataBase is auto-resolved from the deployment URL on Vercel; omit it (local dev logs a harmless warning).
  openGraph: { title: APP_NAME, description: "A secure Next.js + Supabase app template with Google OAuth and role-based access", type: "website", images: ["/og.png"] },
  twitter: { card: "summary_large_image", title: APP_NAME, description: "A secure Next.js + Supabase app template with Google OAuth and role-based access", images: ["/og.png"] },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        {/* Runs before paint to set the theme and prevent a dark-mode flash; must stay inline. */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('webapp-theme');if(t==='dark'||(!t&&window.matchMedia('(prefers-color-scheme:dark)').matches)){document.documentElement.setAttribute('data-theme','dark')}}catch(e){}})()`,
          }}
        />
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
