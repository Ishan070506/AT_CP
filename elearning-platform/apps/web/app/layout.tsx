import "./globals.css";

import { ReactNode } from "react";

import { Shell } from "../components/Shell";


export const metadata = {
  title: "AI E-Learning Platform",
  description: "Multi-tenant adaptive learning with integrity monitoring"
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Shell>{children}</Shell>
      </body>
    </html>
  );
}
