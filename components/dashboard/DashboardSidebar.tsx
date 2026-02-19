"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Session } from "next-auth";
import {
  Heart,
  LayoutDashboard,
  CheckSquare,
  Wallet,
  Users,
  Grid3X3,
  Building2,
  Image,
  Tag,
  Camera,
  BookOpen,
  LogOut,
} from "lucide-react";
import { signOut } from "next-auth/react";

interface NavItem {
  href: string;
  label: string;
  icon: React.ElementType;
}

function getPlannerNav(locale: string): NavItem[] {
  return [
    { href: `/${locale}/dashboard`, label: "Übersicht", icon: LayoutDashboard },
    { href: `/${locale}/dashboard/tasks`, label: "Aufgaben", icon: CheckSquare },
    { href: `/${locale}/dashboard/budget`, label: "Budget", icon: Wallet },
    { href: `/${locale}/dashboard/guests`, label: "Gästeliste", icon: Users },
    { href: `/${locale}/dashboard/seating`, label: "Tischplanung", icon: Grid3X3 },
  ];
}

function getVendorNav(locale: string): NavItem[] {
  return [
    { href: `/${locale}/dashboard`, label: "Übersicht", icon: LayoutDashboard },
    { href: `/${locale}/dashboard/profile`, label: "Profil", icon: Building2 },
    { href: `/${locale}/dashboard/photos`, label: "Fotos", icon: Image },
    { href: `/${locale}/dashboard/deals`, label: "Deals", icon: Tag },
  ];
}

function getStorytellerNav(locale: string): NavItem[] {
  return [
    { href: `/${locale}/dashboard`, label: "Übersicht", icon: LayoutDashboard },
    { href: `/${locale}/dashboard/stories`, label: "Meine Stories", icon: Camera },
    { href: `/${locale}/dashboard/stories/new`, label: "Story erstellen", icon: BookOpen },
  ];
}

interface Props {
  session: Session;
}

export default function DashboardSidebar({ session }: Props) {
  const pathname = usePathname();
  const locale = pathname.split("/")[1] || "de";
  const role = session.user.defaultAccount || "planner";

  let navItems: NavItem[] = [];
  if (role === "planner") navItems = getPlannerNav(locale);
  else if (role === "vendor") navItems = getVendorNav(locale);
  else if (role === "storyteller") navItems = getStorytellerNav(locale);

  const roleLabel = {
    planner: "Brautpaar",
    vendor: "Dienstleister",
    storyteller: "Storyteller",
  }[role] ?? "Dashboard";

  return (
    <aside className="hidden md:flex w-64 flex-col border-r border-border bg-card">
      {/* Logo */}
      <div className="flex h-16 items-center gap-2 border-b border-border px-6">
        <Heart className="h-5 w-5 fill-primary text-primary" />
        <span className="font-serif text-lg font-bold text-foreground">Plansey</span>
      </div>

      {/* Role badge */}
      <div className="px-4 pt-4 pb-2">
        <div className="rounded-lg bg-primary/5 border border-primary/10 px-3 py-2">
          <p className="text-xs text-muted-foreground">Angemeldet als</p>
          <p className="text-sm font-medium text-foreground">{roleLabel}</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-2 space-y-0.5">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors ${
                isActive
                  ? "bg-primary/10 text-primary font-medium"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              }`}
            >
              <Icon className="h-4 w-4 flex-shrink-0" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* User + Logout */}
      <div className="border-t border-border p-4">
        <div className="mb-3 flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary text-sm font-medium">
            {session.user.name?.charAt(0).toUpperCase() ?? "U"}
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-medium text-foreground">
              {session.user.name ?? session.user.email}
            </p>
            <p className="truncate text-xs text-muted-foreground">{session.user.email}</p>
          </div>
        </div>
        <button
          onClick={() => signOut({ callbackUrl: "/de" })}
          className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
        >
          <LogOut className="h-4 w-4" />
          Abmelden
        </button>
      </div>
    </aside>
  );
}
