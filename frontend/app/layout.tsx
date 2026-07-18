import type { Metadata } from "next";
import { SiteFooter } from "./components/SiteFooter";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://allone.ca"),
  title: "All@One Vietnamese Kitchen",
  description:
    "Organic Vietnamese restaurant with daily specialties, a roll-focused menu, vegan options, chef story, and contact details.",
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
  openGraph: {
    title: "All@One Vietnamese Kitchen",
    description: "Authentic Vietnamese rolls, daily specialties, and full vegan choices.",
    images: ["/vietnamese-rolls-hero.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        {children}
        <SiteFooter />
      </body>
    </html>
  );
}
