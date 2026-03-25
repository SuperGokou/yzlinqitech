"use client";

import { LocaleProvider } from "@/contexts/LocaleContext";
import Navbar from "@/components/sections/Navbar";
import Footer from "@/components/sections/Footer";
import ChatWidget from "@/components/chat/ChatWidget";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <LocaleProvider>
      <Navbar />
      <main>{children}</main>
      <Footer />
      <ChatWidget />
    </LocaleProvider>
  );
}
