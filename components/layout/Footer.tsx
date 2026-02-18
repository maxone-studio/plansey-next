import { useTranslations } from "next-intl";
import Link from "next/link";
import { Heart } from "lucide-react";

export default function Footer() {
  const t = useTranslations("nav");
  const tApp = useTranslations("app");

  return (
    <footer className="border-t border-border bg-muted/30">
      <div className="container py-12">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          {/* Brand */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 font-serif text-xl font-bold text-primary mb-3">
              <Heart className="h-5 w-5 fill-primary" />
              <span>Plansey</span>
            </div>
            <p className="text-sm text-muted-foreground">
              {tApp("tagline")}
            </p>
          </div>

          {/* Platform */}
          <div>
            <h3 className="text-sm font-semibold mb-3">Plansey</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link href="/de/vendors" className="hover:text-foreground transition-colors">
                  {t("vendors")}
                </Link>
              </li>
              <li>
                <Link href="/de/stories" className="hover:text-foreground transition-colors">
                  {t("stories")}
                </Link>
              </li>
              <li>
                <Link href="/de/register" className="hover:text-foreground transition-colors">
                  {t("register")}
                </Link>
              </li>
            </ul>
          </div>

          {/* For Vendors */}
          <div>
            <h3 className="text-sm font-semibold mb-3">Für Dienstleister</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link href="/de/register?role=vendor" className="hover:text-foreground transition-colors">
                  Jetzt registrieren
                </Link>
              </li>
              <li>
                <Link href="/de/cooperation" className="hover:text-foreground transition-colors">
                  Kooperation
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="text-sm font-semibold mb-3">Rechtliches</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link href="/de/imprint" className="hover:text-foreground transition-colors">
                  Impressum
                </Link>
              </li>
              <li>
                <Link href="/de/privacy" className="hover:text-foreground transition-colors">
                  Datenschutz
                </Link>
              </li>
              <li>
                <Link href="/de/terms" className="hover:text-foreground transition-colors">
                  AGB
                </Link>
              </li>
              <li>
                <Link href="/de/contact" className="hover:text-foreground transition-colors">
                  Kontakt
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-border flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} Plansey. Alle Rechte vorbehalten.
          </p>
          <p className="text-xs text-muted-foreground">
            Made with <Heart className="inline h-3 w-3 fill-primary text-primary" /> for couples in love
          </p>
        </div>
      </div>
    </footer>
  );
}
