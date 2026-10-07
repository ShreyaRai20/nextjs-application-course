import { Navbar } from "@/components/web/navbar";
import { Metadata } from "next";
import { ReactNode } from "react";

export const metadata: Metadata = {
    title: "dashboard",
    description: "home",
};

export default function SharedLayout({ children }: { children: ReactNode }) {
    return (
        <>
            <Navbar />
            {children}
        </>
    )
}