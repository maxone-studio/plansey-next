"use client";

import { Session } from "next-auth";
import { signOut } from "next-auth/react";
import { Bell, LogOut, Menu } from "lucide-react";
import { useState } from "react";
import Link from "next/link";

interface Props {
  session: Session;
}

export default function DashboardHeader({ session }: Props) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="flex h-16 items-center justify-between border-b border-border bg-card px-4 md:px-6">
      {/* Mobile menu button */}
      <button
        className="md:hidden rounded-lg p-2 text-muted-foreground hover:bg-muted"
        onClick={() => setMenuOpen(!menuOpen)}
      >
        <Menu className="h-5 w-5" />
      </button>

      {/* Page title placeholder – filled by child pages */}
      <div className="hidden md:block" />

      {/* Right side */}
      <div className="flex items-center gap-2">
        {/* Notifications (placeholder) */}
        <button className="rounded-lg p-2 text-muted-foreground hover:bg-muted transition-colors">
          <Bell className="h-5 w-5" />
        </button>

        {/* User menu */}
        <div className="relative">
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="flex items-center gap-2 rounded-lg px-3 py-1.5 text-sm hover:bg-muted transition-colors"
          >
            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-primary/10 text-primary text-xs font-medium">
              {session.user.name?.charAt(0).toUpperCase() ?? "U"}
            </div>
            <span className="hidden sm:block text-sm font-medium text-foreground">
              {session.user.name ?? session.user.email}
            </span>
          </button>

          {menuOpen && (
            <>
              {/* Backdrop */}
              <div
                className="fixed inset-0 z-10"
                onClick={() => setMenuOpen(false)}
              />
              {/* Dropdown */}
              <div className="absolute right-0 top-full z-20 mt-1 w-48 rounded-xl border border-border bg-card shadow-lg py-1">
                <div className="px-3 py-2 border-b border-border">
                  <p className="text-xs text-muted-foreground">Angemeldet als</p>
                  <p className="text-sm font-medium text-foreground truncate">
                    {session.user.email}
                  </p>
                </div>
                <Link
                  href="/de/dashboard/settings"
                  className="flex items-center gap-2 px-3 py-2 text-sm text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                  onClick={() => setMenuOpen(false)}
                >
                  Einstellungen
                </Link>
                <button
                  onClick={() => signOut({ callbackUrl: "/de" })}
                  className="flex w-full items-center gap-2 px-3 py-2 text-sm text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                >
                  <LogOut className="h-4 w-4" />
                  Abmelden
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
