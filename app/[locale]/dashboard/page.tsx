import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import {
  Heart,
  CheckSquare,
  Wallet,
  Users,
  Building2,
  Image,
  Camera,
  ArrowRight,
  Sparkles,
  Calendar,
  MapPin,
  Pencil,
  Clock,
} from "lucide-react";
import Link from "next/link";
import type { Session } from "next-auth";
import type { Wedding } from "@prisma/client";

export default async function DashboardPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const session = await auth();
  if (!session?.user) redirect("/de/auth/login");

  const { locale } = await params;
  const role = session.user.defaultAccount || "planner";
  const firstName = session.user.name?.split(" ")[0] ?? "dort";

  // Load wedding for planners
  let wedding: Wedding | null = null;
  if (role === "planner") {
    const planner = await db.planner.findUnique({
      where: { userId: session.user.id },
      include: {
        weddingPlanners: {
          include: { wedding: true },
          orderBy: { id: "desc" },
          take: 1,
        },
      },
    });
    wedding = planner?.weddingPlanners?.[0]?.wedding ?? null;
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Welcome */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-1">
          <Sparkles className="h-5 w-5 text-primary" />
          <h1 className="text-2xl font-bold text-foreground">
            Willkommen zurück, {firstName}!
          </h1>
        </div>
        <p className="text-muted-foreground">
          {role === "planner" && "Hier ist deine Hochzeitsplanung auf einen Blick."}
          {role === "vendor" && "Verwalte dein Dienstleister-Profil und deine Anfragen."}
          {role === "storyteller" && "Erstelle und verwalte deine Hochzeits-Reportagen."}
        </p>
      </div>

      {/* Role-specific dashboard */}
      {role === "planner" && (
        <PlannerDashboard session={session} wedding={wedding} locale={locale} />
      )}
      {role === "vendor" && <VendorDashboard session={session} locale={locale} />}
      {role === "storyteller" && (
        <StorytellerDashboard session={session} locale={locale} />
      )}
    </div>
  );
}

function getDaysUntilWedding(weddingDate: Date): number {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const target = new Date(weddingDate);
  target.setHours(0, 0, 0, 0);
  return Math.ceil((target.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
}

function PlannerDashboard({
  session,
  wedding,
  locale,
}: {
  session: Session;
  wedding: Wedding | null;
  locale: string;
}) {
  return (
    <div className="space-y-6">
      {/* No wedding yet – setup banner */}
      {!wedding && (
        <div className="rounded-xl bg-gradient-to-r from-primary/10 to-plansey-blush border border-primary/20 p-6">
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0 rounded-full bg-primary/10 p-2">
              <Heart className="h-5 w-5 text-primary" />
            </div>
            <div className="flex-1">
              <h2 className="font-semibold text-foreground mb-1">
                Erstelle deine Hochzeit 💍
              </h2>
              <p className="text-sm text-muted-foreground mb-4">
                Starte mit dem Hochzeitsdatum, Ort und Budget – alles andere kommt danach.
              </p>
              <Link
                href={`/${locale}/dashboard/wedding/new`}
                className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
              >
                Hochzeit anlegen
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Wedding card – if exists */}
      {wedding && (
        <WeddingCard wedding={wedding} locale={locale} />
      )}

      {/* Quick actions */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <QuickCard
          href={`/${locale}/dashboard/tasks`}
          icon={CheckSquare}
          title="Aufgaben"
          description="Checkliste & Planung"
          color="text-primary"
          bg="bg-primary/10"
        />
        <QuickCard
          href={`/${locale}/dashboard/budget`}
          icon={Wallet}
          title="Budget"
          description="Kosten im Überblick"
          color="text-plansey-gold"
          bg="bg-plansey-gold/10"
        />
        <QuickCard
          href={`/${locale}/dashboard/guests`}
          icon={Users}
          title="Gästeliste"
          description="Gäste & RSVP verwalten"
          color="text-blue-500"
          bg="bg-blue-50"
        />
      </div>
    </div>
  );
}

function WeddingCard({ wedding, locale }: { wedding: Wedding; locale: string }) {
  const daysUntil = wedding.weddingDate
    ? getDaysUntilWedding(new Date(wedding.weddingDate))
    : null;

  const dateFormatted = wedding.weddingDate
    ? new Date(wedding.weddingDate).toLocaleDateString("de-DE", {
        day: "2-digit",
        month: "long",
        year: "numeric",
      })
    : null;

  return (
    <div className="rounded-xl border border-primary/20 bg-gradient-to-br from-primary/5 to-background p-6">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-2">
          <Heart className="h-5 w-5 fill-primary text-primary" />
          <h2 className="font-semibold text-foreground">Meine Hochzeit</h2>
        </div>
        <Link
          href={`/${locale}/dashboard/wedding/${wedding.id}/edit`}
          className="flex items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-xs font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
        >
          <Pencil className="h-3 w-3" />
          Bearbeiten
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {/* Countdown */}
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0 rounded-lg bg-primary/10 p-2">
            <Clock className="h-4 w-4 text-primary" />
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Countdown</p>
            {daysUntil !== null ? (
              <p className="font-semibold text-foreground">
                {daysUntil > 0
                  ? `${daysUntil} Tage`
                  : daysUntil === 0
                  ? "Heute! 🎉"
                  : `vor ${Math.abs(daysUntil)} Tagen`}
              </p>
            ) : (
              <p className="text-sm text-muted-foreground italic">Noch kein Datum</p>
            )}
          </div>
        </div>

        {/* Date */}
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0 rounded-lg bg-primary/10 p-2">
            <Calendar className="h-4 w-4 text-primary" />
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Datum</p>
            {dateFormatted ? (
              <p className="font-semibold text-foreground text-sm">{dateFormatted}</p>
            ) : (
              <p className="text-sm text-muted-foreground italic">Nicht gesetzt</p>
            )}
          </div>
        </div>

        {/* Location */}
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0 rounded-lg bg-primary/10 p-2">
            <MapPin className="h-4 w-4 text-primary" />
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Ort</p>
            {wedding.location ? (
              <p className="font-semibold text-foreground text-sm">
                {wedding.zipcode ? `${wedding.zipcode} ` : ""}
                {wedding.location}
              </p>
            ) : (
              <p className="text-sm text-muted-foreground italic">Nicht gesetzt</p>
            )}
          </div>
        </div>
      </div>

      {/* Budget bar */}
      {wedding.estimateBudget && (
        <div className="mt-4 pt-4 border-t border-border/50">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Geplantes Budget</span>
            <span className="font-semibold text-foreground">
              {new Intl.NumberFormat("de-DE", {
                style: "currency",
                currency: "EUR",
                maximumFractionDigits: 0,
              }).format(wedding.estimateBudget)}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}

function VendorDashboard({
  session: _session,
  locale,
}: {
  session: Session;
  locale: string;
}) {
  return (
    <div className="space-y-6">
      <div className="rounded-xl bg-gradient-to-r from-plansey-gold/10 to-background border border-plansey-gold/20 p-6">
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0 rounded-full bg-plansey-gold/10 p-2">
            <Building2 className="h-5 w-5 text-plansey-gold" />
          </div>
          <div className="flex-1">
            <h2 className="font-semibold text-foreground mb-1">
              Vervollständige dein Profil
            </h2>
            <p className="text-sm text-muted-foreground mb-4">
              Ein vollständiges Profil wird von Brautpaaren 3x häufiger kontaktiert.
            </p>
            <Link
              href={`/${locale}/dashboard/profile`}
              className="inline-flex items-center gap-2 rounded-lg bg-plansey-gold px-4 py-2 text-sm font-medium text-white hover:bg-plansey-gold/90 transition-colors"
            >
              Profil bearbeiten
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <QuickCard
          href={`/${locale}/dashboard/photos`}
          icon={Image}
          title="Portfolio"
          description="Fotos hochladen & verwalten"
          color="text-green-500"
          bg="bg-green-50"
        />
        <QuickCard
          href={`/${locale}/dashboard/deals`}
          icon={Heart}
          title="Deals"
          description="Rabattaktionen erstellen"
          color="text-primary"
          bg="bg-primary/10"
        />
      </div>
    </div>
  );
}

function StorytellerDashboard({
  session: _session,
  locale,
}: {
  session: Session;
  locale: string;
}) {
  return (
    <div className="space-y-6">
      <div className="rounded-xl bg-gradient-to-r from-blue-50 to-background border border-blue-200 p-6">
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0 rounded-full bg-blue-50 p-2">
            <Camera className="h-5 w-5 text-blue-500" />
          </div>
          <div className="flex-1">
            <h2 className="font-semibold text-foreground mb-1">
              Erstelle deine erste Story
            </h2>
            <p className="text-sm text-muted-foreground mb-4">
              Teile eine Hochzeits-Reportage und inspiriere tausende Brautpaare.
            </p>
            <Link
              href={`/${locale}/dashboard/stories/new`}
              className="inline-flex items-center gap-2 rounded-lg bg-blue-500 px-4 py-2 text-sm font-medium text-white hover:bg-blue-600 transition-colors"
            >
              Story erstellen
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>

      <QuickCard
        href={`/${locale}/dashboard/stories`}
        icon={Camera}
        title="Meine Stories"
        description="Alle Reportagen verwalten"
        color="text-blue-500"
        bg="bg-blue-50"
      />
    </div>
  );
}

function QuickCard({
  href,
  icon: Icon,
  title,
  description,
  color,
  bg,
}: {
  href: string;
  icon: React.ElementType;
  title: string;
  description: string;
  color: string;
  bg: string;
}) {
  return (
    <Link
      href={href}
      className="group flex items-center gap-4 rounded-xl border border-border bg-card p-5 shadow-sm hover:shadow-md hover:border-primary/20 transition-all"
    >
      <div className={`flex-shrink-0 rounded-lg p-2.5 ${bg}`}>
        <Icon className={`h-5 w-5 ${color}`} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-medium text-foreground text-sm">{title}</p>
        <p className="text-xs text-muted-foreground mt-0.5">{description}</p>
      </div>
      <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-0.5 transition-all flex-shrink-0" />
    </Link>
  );
}
