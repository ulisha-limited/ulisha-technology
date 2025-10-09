import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";


const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});


const geistMono = Geist({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Ulisha Tech - High-Performance Software & SEO Solutions",
  metadataBase: new URL("https://ulishatechnologies.com"), 

  
  description:
    "Ulisha Technologies builds high-performance software and SEO-driven websites that don't just compete—they dominate. Let's build your competitive edge.",

 
  keywords: [
   
    "SEO",
    "Web Development",
    "Custom Software",
    "Ulisha Tech",
  ],

  authors: [{ name: "Ulisha Tech", url: "https://utech.ulishalimited.com" }],
  creator: "Ulisha Tech",
  publisher: "Ulisha Tech",

  openGraph: {
    title: "Ulisha Tech - High-Performance Software & SEO Solutions",
    description:
      "Ulisha Technologies builds high-performance software and SEO-driven websites that don't just compete—they dominate.",
    url: "https://utech.ulishalimited.com",
    siteName: "Ulisha Tech",
    images: [
      {
        url: "/ulishalimited.png", // Path to your Open Graph image (place in /public folder)
        width: 1200,
        height: 630,
        alt: "Ulisha Tech - Digital Growth Engine",
      },
    ],
    locale: "en_US",
    type: "website",
  },

  twitter: {
    card: "summary_large_image",
    title: "Ulisha Tech - High-Performance Software & SEO Solutions",
    description:
      "Ulisha Technologies builds high-performance software and SEO-driven websites that don't just compete—they dominate.",
    creator: "@UlishaTech", // Replace with your Twitter handle
    images: ["/twitter-image.png"], // Path to your Twitter card image (place in /public folder)
  },

  // For PWA or mobile app integrations.
  appleWebApp: {
    title: "Ulisha Tech",
    statusBarStyle: "default",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // --- JSON-LD Schema for Rich Snippets ---
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Ulisha Tech',
    url: 'https://ulishatechnologies.com.ng',
  };

  return (
    <html lang="en" suppressHydrationWarning={true}>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-white text-gray-800`}
      >
      
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        {children}
      </body>
    </html>
  );
}