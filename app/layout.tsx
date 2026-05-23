import type { Metadata } from "next";
import { Cinzel, Lora } from "next/font/google";
import { BackgroundAudio } from "@/components/background-audio";
import "./globals.css";

const display = Cinzel({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["600", "700", "800", "900"],
});

const bodyText = Lora({
  subsets: ["latin"],
  variable: "--font-body",
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "DemonDash",
  description:
    "Turn bad decisions into cinematic parody skits about Hellcat chaos, fake flexes, and consequences.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${display.variable} ${bodyText.variable}`}>
        <div className="site-bg min-h-screen bg-void text-chrome-100">
          <div className="horror-face-bg fixed inset-0 -z-20" />
          <div className="grain-overlay fixed inset-0 -z-10" />
          {children}
          <BackgroundAudio />
        </div>
      </body>
    </html>
  );
}
