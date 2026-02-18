"use client";

import { useTranslations } from "next-intl";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { useState } from "react";
import { Menu, X, Heart } from "lucide-react";

export default function Header() {
  const t = useTranslations("nav");
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);

  // Detect current locale from pathname
  const locale = pathname.startsWith("/en") ? "en" : "de";
  const otherLocale = locale === "de" ? "en" : "de";

  // Strip locale prefix for link generation
  const pathnameWithoutLocale =
    pathname.replace(/^\/(de|en)/, "") || "/";

  const navLinks = [
    { href: `/${locale}/vendors`, label: t("vendors") },
    { href: `/${locale}/stories`, label: t("stories") },
  ];

  const switchLocale = () => {
    router.push(`/${otherLocale}${pathnameWithoutLocale}`);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        {/* Logo */}
        <Link
          href={`/${locale}`}
          className="flex items-center gap-2 font-serif text-xl font-bold text-primary"
        >
          <Heart className="h-5 w-5 fill-primary" />
          <span>Plansey</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Desktop Actions */}
        <div className="hidden md:flex items-center gap-3">
          {/* Language Switcher */}
          <button
            onClick={switchLocale}
            className="text-xs font-medium text-muted-foreground hover:text-foreground uppercase tracking-wider px-2 py-1 rounded border border-border hover:border-foreground/30 transition-colors"
            aria-label={t("language")}
          >
            {otherLocale.toUpperCase()}
          </button>

          <Link
            href={`/${locale}/login`}
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            {t("login")}
          </Link>

          <Link
            href={`/${locale}/register`}
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow hover:bg-primary/90 transition-colors"
          >
            {t("register")}
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden p-2 text-muted-foreground hover:text-foreground"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label={t("menu")}
        >
          {mobileOpen ? (
            <X className="h-5 w-5" />
          ) : (
            <Menu className="h-5 w-5" />
          )}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-border bg-background">
          <nav className="container py-4 flex flex-col gap-3">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm font-medium text-muted-foreground hover:text-foreground py-2"
                onClick={() => setMobileOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <hr className="border-border" />
            <Link
              href={`/${locale}/login`}
              className="text-sm font-medium text-muted-foreground hover:text-foreground py-2"
              onClick={() => setMobileOpen(false)}
            >
              {t("login")}
            </Link>
            <Link
              href={`/${locale}/register`}
              className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground"
              onClick={() => setMobileOpen(false)}
            >
              {t("register")}
            </Link>
            <button
              onClick={switchLocale}
              className="text-xs font-medium text-muted-foreground uppercase tracking-wider text-left py-2"
            >
              {t("language")}: {otherLocale.toUpperCase()}
            </button>
          </nav>
        </div>
      )}
    </header>
  );
}
