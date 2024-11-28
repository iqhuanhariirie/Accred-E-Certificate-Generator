export default function CertificateLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div >
      <main className="flex-grow bg-slate-50 dark:bg-slate-900">
        {children}
      </main>
    </div>
  );
}
