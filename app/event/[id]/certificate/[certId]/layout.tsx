import { Footer } from "@/components/Footer";

export default function CertificateLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-grow bg-slate-50 dark:bg-slate-900">
        {children}
      </main>
      <Footer />
    </div>
  );
}
