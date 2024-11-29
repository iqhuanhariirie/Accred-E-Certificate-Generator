import { AuthContextProvider } from "@/context/AuthContext";
import { ThemeContext } from "@/context/ThemeContext";
import { Inter } from "next/font/google";
import { Toaster } from 'react-hot-toast';
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "UITM KT E-Certificate System",
  description: "An E-Certificate System",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthContextProvider>
          <ThemeContext>
            {children}
            <Toaster />
          </ThemeContext>
        </AuthContextProvider>
      </body>
    </html>
  );
}
