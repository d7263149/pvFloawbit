
import { Flowbite, ThemeModeScript } from "flowbite-react";
import "./globals.css";
import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
// import { Inter } from "next/font/google";
import { authOptions } from "../pages/api/auth/[...nextauth]";
import { getServerSession } from "next-auth";
import SessionProvider from "./SessionProvider";
import Login from "./oldLogin";
import Home from "./pages/index";
import { Inter } from "next/font/google";
const inter = Inter({ subsets: ["latin"] });


export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

const session =  await getServerSession(authOptions);
  return (
    <Flowbite theme={{ mode: 'dark' }}>
    <html lang="en" suppressHydrationWarning={true}>
    <head>
        <ThemeModeScript />
      </head>
      
      <body suppressHydrationWarning={true}   >
        <SessionProvider session={session}>
        {children}
</SessionProvider>
        </body>
      
    </html>
    </Flowbite>
  );
}
