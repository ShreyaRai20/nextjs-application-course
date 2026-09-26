import type { Metadata } from "next";
import { Navbar } from "@/components/web/navbar";
import { ReactNode } from "react";


export const metadata: Metadata = {
  title: "dashboard",
  description: "home",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <Navbar />
      {children}
    </>
  );
}
