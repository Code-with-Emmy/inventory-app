"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { useUser } from "@/app/hooks/useUser";
import {
  LayoutDashboard,
  Package,
  ArrowRightLeft,
  Users,
  LogOut,
  Box,
  BarChart3,
  Image,
  Settings,
  Truck,
  ShoppingCart,
  CreditCard,
  History,
  ChevronLeft,
  ChevronRight,
  BookOpen,
} from "lucide-react";
import { ModeToggle } from "@/app/components/mode-toggle";

interface User {
  name: string;
  role: "ADMIN" | "MANAGER" | "STAFF";
}

interface SidebarProps {
  isMobile?: boolean;
  onClose?: () => void;
}

export default function Sidebar({ isMobile, onClose }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const { data: session } = useUser();

  const handleSignOut = async () => {
    document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    router.push("/login");
  };

  const inventoryItems = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "Products", href: "/products", icon: Package },
    { name: "Stock Ledger", href: "/stock", icon: ArrowRightLeft },
    { name: "History", href: "/history", icon: History },
  ];

  const purchaseItems = [
    { name: "Purchases", href: "/purchases", icon: ShoppingCart },
    { name: "Suppliers", href: "/suppliers", icon: Truck },
  ];

  const financeItems = [
    { name: "Financial Reports", href: "/reports", icon: BarChart3 },
  ];

  const isActive = (path: string) => pathname.startsWith(path);

  const NavItem = ({ item }: { item: any }) => {
    const Icon = item.icon;
    const active = isActive(item.href);
    return (
      <Link
        key={item.name}
        href={item.href}
        onClick={() => isMobile && onClose?.()}
        className={`group flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition-all duration-300 ease-out ${
          active
            ? "bg-primary text-primary-foreground shadow-[0_8px_20px_-6px_rgba(var(--primary),0.4)]"
            : "text-muted-foreground hover:bg-muted hover:text-foreground"
        } ${isCollapsed ? "justify-center px-2" : ""}`}
        title={isCollapsed ? item.name : ""}
      >
        <Icon
          className={`h-5 w-5 shrink-0 transition-transform duration-300 ${active ? "scale-110" : "group-hover:scale-110"}`}
        />
        {!isCollapsed && <span className="truncate">{item.name}</span>}
      </Link>
    );
  };

  return (
    <div
      className={`flex h-full sticky top-0 shrink-0 flex-col bg-card/80 backdrop-blur-xl text-card-foreground transition-all duration-500 ease-in-out ${
        isCollapsed ? "w-20" : "w-72"
      } ${!isMobile ? "border-r border-border" : ""}`}
    >
      <div
        className={`flex h-24 items-center gap-3 px-6 relative ${isCollapsed ? "justify-center" : ""}`}
      >
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-[0_4px_14px_0_rgba(var(--primary),0.39)]">
          <Box className="h-6 w-6" />
        </div>
        {!isCollapsed && (
          <span className="text-xl font-black tracking-tight uppercase truncate animate-fade-in mr-auto">
            Flux<span className="text-primary">Stock</span>
          </span>
        )}

        {/* Theme Toggle Button */}
        {!isCollapsed && (
          <div className="relative z-30">
            <ModeToggle />
          </div>
        )}

        {!isMobile && (
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="absolute -right-3 top-1/2 -translate-y-1/2 flex h-6 w-6 items-center justify-center rounded-full border border-border bg-card shadow-sm hover:bg-muted transition-colors z-20"
          >
            {isCollapsed ? (
              <ChevronRight className="h-3 w-3" />
            ) : (
              <ChevronLeft className="h-3 w-3" />
            )}
          </button>
        )}
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar p-4 space-y-8">
        <div>
          {!isCollapsed && (
            <p className="px-3 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/50 mb-4 animate-fade-in">
              Inventory
            </p>
          )}
          <nav className="space-y-1.5">
            {inventoryItems.map((item) => (
              <NavItem key={item.name} item={item} />
            ))}
          </nav>
        </div>

        <div>
          {!isCollapsed && (
            <p className="px-3 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/50 mb-4 animate-fade-in">
              Purchasing
            </p>
          )}
          <nav className="space-y-1.5">
            {purchaseItems.map((item) => (
              <NavItem key={item.name} item={item} />
            ))}
          </nav>
        </div>

        <div>
          {!isCollapsed && (
            <p className="px-3 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/50 mb-4 animate-fade-in">
              Finance & Analysis
            </p>
          )}
          <nav className="space-y-1.5">
            {financeItems.map((item) => (
              <NavItem key={item.name} item={item} />
            ))}
          </nav>
        </div>

        {(session?.user?.role === "ADMIN" ||
          session?.user?.role === "MANAGER") && (
          <div>
            {!isCollapsed && (
              <p className="px-3 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/50 mb-4 animate-fade-in">
                Administration
              </p>
            )}
            <nav className="space-y-1.5">
              <NavItem
                item={{
                  name: "User Management",
                  href: "/admin/users",
                  icon: Users,
                }}
              />
              <NavItem
                item={{
                  name: "System Settings",
                  href: "/admin/settings",
                  icon: Settings,
                }}
              />
              <NavItem
                item={{
                  name: "Media Library",
                  href: "/admin/storage",
                  icon: Image,
                }}
              />
            </nav>
          </div>
        )}

        <div>
          {!isCollapsed && (
            <p className="px-3 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/50 mb-4 animate-fade-in">
              Support
            </p>
          )}
          <nav className="space-y-1.5">
            <NavItem
              item={{
                name: "How to Use",
                href: "/how-to-use",
                icon: BookOpen,
              }}
            />
          </nav>
        </div>
      </div>

      <div className="p-4">
        <div
          className={`rounded-2xl bg-muted/30 border border-border/50 transition-all duration-300 ${isCollapsed ? "p-2" : "p-4"}`}
        >
          {!isCollapsed && (
            <div className="flex items-center justify-between mb-4 animate-fade-in">
              <div className="flex flex-col">
                <span className="text-[10px] font-black uppercase tracking-wider text-muted-foreground">
                  Profile
                </span>
                <span className="text-xs font-bold truncate max-w-[120px]">
                  {session?.user?.name || "Member"}
                </span>
              </div>
            </div>
          )}
          <button
            onClick={handleSignOut}
            className={`flex items-center rounded-xl text-xs font-black uppercase tracking-widest text-destructive transition-all hover:bg-destructive/10 border border-destructive/20 ${
              isCollapsed
                ? "w-10 h-10 justify-center p-0"
                : "w-full px-4 py-2.5 gap-3 hover:gap-4"
            }`}
            title={isCollapsed ? "Sign Out" : ""}
          >
            <LogOut className="h-4 w-4 shrink-0" />
            {!isCollapsed && <span>Sign Out</span>}
          </button>
        </div>
      </div>
    </div>
  );
}
