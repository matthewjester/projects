import type { ReactNode } from "react";

// Root layout is a passthrough — locale layout handles <html>/<body>
// This avoids duplicate <html> and <body> tags
export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return children;
}
