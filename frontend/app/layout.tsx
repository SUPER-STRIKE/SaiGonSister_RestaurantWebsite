import type { Metadata } from "next";
import { ScrollTopButton } from "./components/ScrollTopButton";
import { SiteFooter } from "./components/SiteFooter";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://saigonsister.ca"),
  title: "SaiGonSister Vietnamese Kitchen",
  description:
    "Organic Vietnamese restaurant with daily specialties, breakfast, lunch, dinner, drinks, vegan options, chef story, and contact details.",
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
  openGraph: {
    title: "SaiGonSister Vietnamese Kitchen",
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
        <ScrollTopButton />
        <SiteFooter />
      </body>
    </html>
  );
}
