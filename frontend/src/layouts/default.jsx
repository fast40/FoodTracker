export default function DefaultLayout({ children }) {
  return (
    <div className="relative flex flex-col h-screen">
      <main className="container mx-auto max-w-7xl px-6 flex-grow">
        {children}
      </main>
    </div>
  );
}