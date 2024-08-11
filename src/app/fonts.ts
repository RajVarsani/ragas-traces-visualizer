import { Onest as FontSans, Space_Mono } from "next/font/google";

export const fontSans = FontSans({
    subsets: ["latin"],
    variable: "--font-sans",
});

export const fontMono = Space_Mono({
    subsets: ["latin"],
    weight: ["400", "700"],
    variable: "--font-modo",
});