"use client";

import {
  BookOpen,
  Package,
  ArrowRightLeft,
  BarChart3,
  Users,
  Image as ImageIcon,
  LayoutDashboard,
  ShieldCheck,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/app/components/ui/Button";

export default function HowToUsePage() {
  const guides = [
    {
      title: "Dashboard Overview",
      icon: LayoutDashboard,
      description:
        "Your command center. View real-time stats, stock alerts, and recent activity at a glance.",
      steps: [
        "Check total inventory value and sales.",
        "Monitor low stock alerts.",
        "View recent stock movements.",
      ],
      color: "text-blue-500",
      bg: "bg-blue-500/10",
    },
    {
      title: "Managing Products",
      icon: Package,
      description:
        "Create and edit your inventory items. Set prices, categories, and track stock levels.",
      steps: [
        "Go to 'Inventory' to list all items.",
        "Click 'Add Product' to create new items.",
        "Set buy/sell prices and min quantity alerts.",
        "Upload product images.",
      ],
      color: "text-purple-500",
      bg: "bg-purple-500/10",
    },
    {
      title: "Stock & Sales",
      icon: ArrowRightLeft,
      description:
        "The core engine. Record new stock arrivals and process customer sales.",
      steps: [
        "Select 'Stock & Sales' from the menu.",
        "Choose 'Add Stock (IN)' to replenish inventory.",
        "Choose 'Sell Stock (OUT)' to make a sale.",
        "For phones, you can track specific IMEIs.",
      ],
      color: "text-emerald-500",
      bg: "bg-emerald-500/10",
    },
    {
      title: "Reports & Analytics",
      icon: BarChart3,
      description:
        "Track your performance. See financial summaries and detailed transaction histories.",
      steps: [
        "View total spending and revenue.",
        "Filter by payment method (Cash, Transfer, POS).",
        "Export or review daily transaction logs.",
      ],
      color: "text-orange-500",
      bg: "bg-orange-500/10",
    },
    {
      title: "Media Library",
      icon: ImageIcon,
      description:
        " centralized storage for all your product images and assets.",
      steps: [
        "Upload high-quality images.",
        "Copy image URLs for use in products.",
        "Manage and delete unused files.",
      ],
      color: "text-pink-500",
      bg: "bg-pink-500/10",
    },
    {
      title: "Admin Controls",
      icon: ShieldCheck,
      description:
        "For administrators only. Manage staff access and system settings.",
      steps: [
        "Create accounts for staff members.",
        "Assign roles (Admin/Staff).",
        "Monitor user-specific activity.",
      ],
      color: "text-indigo-500",
      bg: "bg-indigo-500/10",
    },
  ];

  return (
    <div className="space-y-10 animate-fade-in max-w-7xl mx-auto pb-20">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-4xl font-black tracking-tight text-foreground uppercase">
            How to Use
          </h1>
          <p className="text-muted-foreground font-medium text-lg mt-2">
            Master your inventory management system with these guides.
          </p>
        </div>
        <div className="flex gap-3">
          <Link href="/dashboard">
            <Button className="font-bold">Go to Dashboard</Button>
          </Link>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {guides.map((guide, i) => (
          <div
            key={i}
            className="group relative overflow-hidden rounded-3xl border border-border bg-card p-8 shadow-sm transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
          >
            <div
              className={`absolute top-0 right-0 h-32 w-32 translate-x-8 translate-y--8 rounded-full ${guide.bg} blur-3xl opacity-50 group-hover:opacity-100 transition-opacity`}
            />

            <div className="relative z-10 font-bold">
              <div
                className={`flex h-14 w-14 items-center justify-center rounded-2xl ${guide.bg} ${guide.color} mb-6 transition-transform group-hover:scale-110 duration-500`}
              >
                <guide.icon className="h-7 w-7" />
              </div>

              <h3 className="text-xl font-black tracking-tight text-foreground mb-3">
                {guide.title}
              </h3>
              <p className="text-muted-foreground text-sm font-medium mb-6 leading-relaxed">
                {guide.description}
              </p>

              <ul className="space-y-3">
                {guide.steps.map((step, idx) => (
                  <li
                    key={idx}
                    className="flex items-start gap-3 text-sm text-foreground/80"
                  >
                    <span
                      className={`mt-1.5 h-1.5 w-1.5 rounded-full shrink-0 bg-current opacity-50`}
                    />
                    <span>{step}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>

      <div className="rounded-3xl border border-primary/20 bg-linear-to-br from-primary/5 to-primary/10 p-12 text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-white/10 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))] -z-10" />
        <h2 className="text-3xl font-black text-foreground mb-4">
          Need more help?
        </h2>
        <p className="text-muted-foreground font-medium max-w-xl mx-auto mb-8">
          If you encounter any issues or need technical assistance, please contact
          your system administrator.
        </p>
        <div className="flex justify-center gap-4">
          <Button size="lg" className="font-bold gap-2">
            <Users className="h-4 w-4" /> Contact Support
          </Button>
        </div>
      </div>
    </div>
  );
}
