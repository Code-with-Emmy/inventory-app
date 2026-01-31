"use client";

import { useState } from "react";
import Sidebar from "@/app/components/Sidebar";
import { Menu, X } from "lucide-react";
import { Button } from "@/app/components/ui/Button";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-background relative">
      {/* Desktop Sidebar */}
      <div className="hidden lg:block">
        <Sidebar />
      </div>

      {/* Mobile Sidebar Overlay */}
      <div
        className={`fixed inset-0 z-50 lg:hidden transition-all duration-300 ${
          isMobileMenuOpen
            ? "opacity-100 visible"
            : "opacity-0 invisible pointer-events-none"
        }`}
      >
        <div
          className="absolute inset-0 bg-background/80 backdrop-blur-sm"
          onClick={() => setIsMobileMenuOpen(false)}
        />
        <div
          className={`absolute left-0 top-0 h-full w-72 bg-card transition-transform duration-300 ease-out border-r border-border shadow-2xl ${
            isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <div className="absolute right-4 top-4 z-10">
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
          <Sidebar isMobile onClose={() => setIsMobileMenuOpen(false)} />
        </div>
      </div>

      <main className="flex-1 min-w-0 flex flex-col relative">
        {/* Mobile Header */}
        <header className="lg:hidden h-16 border-b border-border bg-card/50 backdrop-blur-xl px-4 flex items-center justify-between sticky top-0 z-40">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="sm"
              className="lg:hidden h-10 w-10 p-0 rounded-xl"
              onClick={() => setIsMobileMenuOpen(true)}
            >
              <Menu className="h-6 w-6" />
            </Button>
            <span className="text-lg font-black tracking-tight uppercase">
              Flux<span className="text-primary">Stock</span>
            </span>
          </div>
        </header>

        <div className="flex-1 p-4 lg:p-10 overflow-x-hidden relative">
          {/* Subtle background pattern */}
          <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] bg-size-[24px_24px] opacity-20 pointer-events-none" />

          <div className="mx-auto max-w-7xl relative animate-fade-in">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
}
