import { Footer } from "@/components/Footer";
import { GuestNavbar } from "@/components/Navbar";
import { ReactNode } from "react";

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <GuestNavbar />
      {children}
      <Footer />
    </div>
  );
}
