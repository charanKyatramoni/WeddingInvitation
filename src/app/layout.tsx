import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Vowcraft | Wedding invitation platform",
  description: "Create and manage elegant wedding invitation websites.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
