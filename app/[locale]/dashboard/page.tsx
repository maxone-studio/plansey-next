import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
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
} from "lucide-react";
import Link from "next/link";
import type { Session } from "next-auth";

export default async function DashboardPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/de/auth/login");
  }

  const role = session.user.defaultAccount || "planner";
  const firstName = session.user.name?.split(" ")[0] ?? "dort";

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
      {role === "planner" && <PlannerDashboard session={session} />}
      {role === "vendor" && <VendorDashboard session={session} />}
      {role === "storyteller" && <StorytellerDashboard session={session} />}
    </div>
  );
}

function PlannerDashboard({ session }: { session: Session }) {
  const locale = "de";
  return (
    <div className="space-y-6">
      {/* Setup banner for first login */}
      {session?.user.isFirstLogin && (
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

function VendorDashboard({ session: _session }: { session: Session }) {
  const locale = "de";
  return (
    <div className="space-y-6">
      {/* Setup banner */}
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

function StorytellerDashboard({ session: _session }: { session: Session }) {
  const locale = "de";
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
