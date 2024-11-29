export default function VerifyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col">
      <main className="flex-grow bg-slate-50 dark:bg-slate-900">
        {children}
      </main>
    </div>
  );
}
