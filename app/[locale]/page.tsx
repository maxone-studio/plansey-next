import { useTranslations } from "next-intl";
import Link from "next/link";
import { CheckCircle2, Users, Wallet, MapPin, ArrowRight, Heart, Camera, Star } from "lucide-react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

export default function HomePage() {
  const t = useTranslations("app");

  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-gradient-to-b from-plansey-blush to-background py-20 md:py-32">
          <div className="container relative z-10">
            <div className="mx-auto max-w-3xl text-center">
              {/* Badge */}
              <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary">
                <Heart className="h-3.5 w-3.5 fill-primary" />
                <span>Hochzeitsplanung leicht gemacht</span>
              </div>

              {/* Headline */}
              <h1 className="font-serif text-4xl font-bold tracking-tight text-foreground sm:text-5xl md:text-6xl">
                {t("hero.headline")}
              </h1>

              {/* Subheadline */}
              <p className="mt-6 text-lg text-muted-foreground md:text-xl">
                {t("hero.subheadline")}
              </p>

              {/* CTAs */}
              <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
                <Link
                  href="/de/register?role=planner"
                  className="inline-flex items-center gap-2 rounded-md bg-primary px-6 py-3 text-base font-medium text-primary-foreground shadow-lg hover:bg-primary/90 transition-colors"
                >
                  {t("hero.cta_planner")}
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  href="/de/stories"
                  className="inline-flex items-center gap-2 rounded-md border border-border bg-background px-6 py-3 text-base font-medium text-foreground hover:bg-muted transition-colors"
                >
                  {t("hero.cta_stories")}
                </Link>
              </div>

              {/* Trust indicators */}
              <div className="mt-12 flex flex-wrap items-center justify-center gap-6 text-sm text-muted-foreground">
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="h-4 w-4 text-primary" />
                  <span>Kostenlos starten</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="h-4 w-4 text-primary" />
                  <span>Keine Kreditkarte nötig</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="h-4 w-4 text-primary" />
                  <span>DSGVO-konform</span>
                </div>
              </div>
            </div>
          </div>

          {/* Decorative elements */}
          <div className="absolute -top-24 -right-24 h-96 w-96 rounded-full bg-primary/5 blur-3xl" />
          <div className="absolute -bottom-24 -left-24 h-96 w-96 rounded-full bg-plansey-gold/10 blur-3xl" />
        </section>

        {/* Features Section */}
        <section className="py-20 bg-background">
          <div className="container">
            <div className="mx-auto max-w-2xl text-center mb-12">
              <h2 className="font-serif text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                {t("features.title")}
              </h2>
            </div>

            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
              {/* Checklist */}
              <div className="group rounded-xl border border-border bg-card p-6 shadow-sm hover:shadow-md transition-shadow">
                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                  <CheckCircle2 className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold text-foreground mb-2">
                  {t("features.checklist.title")}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {t("features.checklist.description")}
                </p>
              </div>

              {/* Budget */}
              <div className="group rounded-xl border border-border bg-card p-6 shadow-sm hover:shadow-md transition-shadow">
                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-plansey-gold/10">
                  <Wallet className="h-6 w-6 text-plansey-gold" />
                </div>
                <h3 className="font-semibold text-foreground mb-2">
                  {t("features.budget.title")}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {t("features.budget.description")}
                </p>
              </div>

              {/* Guests */}
              <div className="group rounded-xl border border-border bg-card p-6 shadow-sm hover:shadow-md transition-shadow">
                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-blue-50">
                  <Users className="h-6 w-6 text-blue-500" />
                </div>
                <h3 className="font-semibold text-foreground mb-2">
                  {t("features.guests.title")}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {t("features.guests.description")}
                </p>
              </div>

              {/* Vendors */}
              <div className="group rounded-xl border border-border bg-card p-6 shadow-sm hover:shadow-md transition-shadow">
                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-green-50">
                  <MapPin className="h-6 w-6 text-green-500" />
                </div>
                <h3 className="font-semibold text-foreground mb-2">
                  {t("features.vendors.title")}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {t("features.vendors.description")}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-16 bg-muted/30">
          <div className="container">
            <div className="grid grid-cols-1 gap-8 md:grid-cols-3 text-center">
              <div>
                <div className="font-serif text-4xl font-bold text-primary">1.000+</div>
                <div className="mt-1 text-sm text-muted-foreground">{t("stats.vendors")}</div>
              </div>
              <div>
                <div className="font-serif text-4xl font-bold text-primary">500+</div>
                <div className="mt-1 text-sm text-muted-foreground">{t("stats.stories")}</div>
              </div>
              <div>
                <div className="font-serif text-4xl font-bold text-primary">5.000+</div>
                <div className="mt-1 text-sm text-muted-foreground">{t("stats.couples")}</div>
              </div>
            </div>
          </div>
        </section>

        {/* For Vendors CTA */}
        <section className="py-20 bg-background">
          <div className="container">
            <div className="mx-auto max-w-2xl rounded-2xl bg-gradient-to-br from-primary/5 to-plansey-blush p-8 md:p-12 text-center border border-primary/10">
              <div className="mb-4 inline-flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
                <Star className="h-7 w-7 text-primary" />
              </div>
              <h2 className="font-serif text-2xl font-bold text-foreground md:text-3xl mb-4">
                Du bist Hochzeits-Dienstleister?
              </h2>
              <p className="text-muted-foreground mb-8">
                Präsentiere dein Business tausenden Brautpaaren. Erstelle dein kostenloses Profil und werde gefunden.
              </p>
              <Link
                href="/de/register?role=vendor"
                className="inline-flex items-center gap-2 rounded-md bg-primary px-6 py-3 text-base font-medium text-primary-foreground shadow hover:bg-primary/90 transition-colors"
              >
                {t("hero.cta_vendor")}
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </section>

        {/* Inspiration / Stories Teaser */}
        <section className="py-20 bg-muted/30">
          <div className="container">
            <div className="mx-auto max-w-2xl text-center mb-12">
              <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary">
                <Camera className="h-3.5 w-3.5" />
                <span>Hochzeits-Inspirationen</span>
              </div>
              <h2 className="font-serif text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                Lass dich inspirieren
              </h2>
              <p className="mt-4 text-muted-foreground">
                Echte Hochzeiten, echte Geschichten – entdecke Ideen für deinen großen Tag.
              </p>
            </div>

            <div className="text-center">
              <Link
                href="/de/stories"
                className="inline-flex items-center gap-2 rounded-md border border-border bg-background px-6 py-3 text-base font-medium text-foreground hover:bg-muted transition-colors"
              >
                Alle Inspirationen entdecken
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
