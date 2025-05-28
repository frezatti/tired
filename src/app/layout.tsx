import "@/styles/globals.css";

import { type Metadata } from "next";
import { Geist } from "next/font/google";

import { TRPCReactProvider } from "@/trpc/react";
import { HeroUIProviderWrapper } from "./_components/HeroWrapper";

export const metadata: Metadata = {
    title: "Controle de estoque",
    description: "Controle de estoque",
    icons: [{ rel: "icon", url: "/favicon.ico" }],
};

const geist = Geist({
    subsets: ["latin"],
    variable: "--font-geist-sans",
});

export default function RootLayout({
    children,
}: Readonly<{ children: React.ReactNode }>) {
    return (
        <html lang="pt-BR" className={`${geist.variable} dark`}>
            <body>
                <HeroUIProviderWrapper>
                    <TRPCReactProvider>
                        {children}
                    </TRPCReactProvider>
                </HeroUIProviderWrapper>
            </body>
        </html>
    );
}
