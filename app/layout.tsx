import type { Metadata } from "next";
import "./globals.css";
export const metadata:Metadata={title:"AKBS Poultry Farming CRM",description:"Production CRM for AKBS Poultry Farming"};
export default function RootLayout({children}:Readonly<{children:React.ReactNode}>){return <html lang="en"><body>{children}</body></html>}