import type { Metadata } from "next";
import { pretendard, caveat } from "styles/fonts";

import "./globals.scss";
import Header from "components/Header";
import { StoreProvider } from "shared/store/StoreContext";
import Footer from "components/Footer";

export const metadata: Metadata = {
  title: "Andrew Kiverin | Portfolio",
  description: "Web site portfolio",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html className={`${pretendard.variable} ${caveat.variable}`} lang="ru">
      <StoreProvider>
        <body>
          <Header />
          {children}
          <Footer />
        </body>
      </StoreProvider>
    </html>
  );
}
