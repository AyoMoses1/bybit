import "./globals.css";
import ReactQueryProvider from "@/components/ReactQueryProvider";
import AppSidebarLayout from "@/components/layout/sidebar/sidebarLayout";
import type { Metadata } from "next";
import {
  Inter,
  Nunito,
  Poppins,
  Roboto,
  Source_Sans_3,
} from "next/font/google";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const nunito = Nunito({ subsets: ["latin"], variable: "--font-nunito" });
const poppins = Poppins({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-poppins",
});
const roboto = Roboto({
  subsets: ["latin"],
  weight: ["100", "300", "400", "500", "700", "900"],
  variable: "--font-roboto",
});
const sourceSans3 = Source_Sans_3({
  subsets: ["latin"],
  weight: ["200", "300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-source-sans",
});

export const metadata: Metadata = {
  title: "Bybit Affiliates",
  description: "Bybit Affiliates Dashboard",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${nunito.variable} ${poppins.variable} ${roboto.variable} ${sourceSans3.variable}`}
    >
      <body>
        <AppSidebarLayout>
          <ReactQueryProvider>{children}</ReactQueryProvider>
        </AppSidebarLayout>
      </body>
    </html>
  );
}
