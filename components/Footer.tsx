"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export const Footer = () => {
  const [mounted, setMounted] = useState(false);
  const { theme } = useTheme();
  const currentYear = new Date().getFullYear();

  useEffect(() => {
    setMounted(true);
  }, []);

  // Return a simplified version during SSR
  if (!mounted) {
    return (
      <footer className="flex flex-col text-sm bg-white drop-shadow-[0_0px_10px_rgba(0,0,0,0.25)] p-5 justify-between text-center dark:bg-[#080E1D]">
        <p className="m-auto text-center text-gray-500"> {currentYear} UITM KT E-certificate System</p>
      </footer>
    );
  }

  return (
    <footer className={`flex flex-col text-sm ${theme === 'dark' ? 'bg-[#080E1D]' : 'bg-white'} drop-shadow-[0_0px_10px_rgba(0,0,0,0.25)] p-5 justify-between text-center`}>
      <p className="m-auto text-center text-gray-500"> {currentYear} UITM KT E-certificate System</p>
    </footer>
  );
};
