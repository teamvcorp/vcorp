"use client";
import "./globals.css";
import { Lato } from "next/font/google";

const lato = Lato({ subsets: ["latin"], weight: ["100", "300", "400", "700", "900"] });

export const metadata = {
  title: "Von Der Becke Academy Corp",
  description:
    "Enabling transformative change through the power of education, compassion, and innovative problem-solving.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <style jsx global>{`
          html {
            font-family: ${lato.style.fontFamily};
          }
        `}</style>
      </head>
      <body>{children}</body>
    </html>
  );
}
