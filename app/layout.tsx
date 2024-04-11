import type { Metadata } from "next";
import { Inter, Quicksand } from "next/font/google";
import "./globals.css";
import { BottomBar } from "@/components/BottomBar";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const quicksand = Quicksand({
  subsets: ["latin"],
  variable: "--font-quicksand",
});

export const metadata: Metadata = {
  title: "Plateo",
  description: "Plateo – AI calorie tracker and meal planner",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.className} ${quicksand.className} min-h-screen flex flex-col`}
      >
        <div className="flex-grow flex flex-col pb-32 relative">{children}</div>
        <BottomBar />
      </body>
    </html>
  );
}
