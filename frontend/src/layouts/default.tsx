import { ReactNode } from "react";
import { Navbar } from "@/components/navbar";

export default function DefaultLayout({ children }: { children: ReactNode }) {
  return (
    //Full-page wrapper with app background
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      {/* Sticky top navbar with solid background */}
      <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-md border-b border-default-100">
        <Navbar />
      </header>

      {/* Main content area */}
      <main className="flex-1 container mx-auto max-w-7xl px-6 pt-8">
        {children}
      </main>
    </div>
  );
}
