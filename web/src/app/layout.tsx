import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "CNN Quiz Trainer — Latihan CNN Berdasarkan Materi Kuliah",
  description:
    "Platform latihan kuis Convolutional Neural Network (CNN) berbasis materi kuliah Pengolahan Citra Digital. Berlatih convolution, ReLU, pooling, feature map, dan arsitektur CNN.",
  keywords: ["CNN", "Convolutional Neural Network", "quiz", "latihan", "kuliah", "pengolahan citra"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;500&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
