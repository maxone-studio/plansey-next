"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { Heart, Building2, Camera, ArrowRight, Eye, EyeOff, Loader2 } from "lucide-react";

type Role = "planner" | "vendor" | "storyteller";

const roles = [
  {
    id: "planner" as Role,
    icon: Heart,
    title: "Brautpaar",
    description: "Plane deine Traumhochzeit mit Checklisten, Budget & Gästeliste",
    color: "text-primary",
    bg: "bg-primary/10",
    border: "border-primary",
  },
  {
    id: "vendor" as Role,
    icon: Building2,
    title: "Dienstleister",
    description: "Präsentiere dein Business und werde von Brautpaaren gefunden",
    color: "text-plansey-gold",
    bg: "bg-plansey-gold/10",
    border: "border-plansey-gold",
  },
  {
    id: "storyteller" as Role,
    icon: Camera,
    title: "Storyteller",
    description: "Teile Hochzeits-Reportagen und inspiriere andere Paare",
    color: "text-blue-500",
    bg: "bg-blue-50",
    border: "border-blue-400",
  },
];

export default function RegisterPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const defaultRole = (searchParams.get("role") as Role) || "planner";

  const [selectedRole, setSelectedRole] = useState<Role>(defaultRole);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, role: selectedRole }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Ein Fehler ist aufgetreten.");
        return;
      }

      // Auto-login after registration
      const signInResult = await signIn("credentials", {
        email: form.email,
        password: form.password,
        redirect: false,
      });

      if (signInResult?.ok) {
        router.push("/de/dashboard");
      } else {
        router.push("/de/auth/login?registered=true");
      }
    } catch {
      setError("Ein Fehler ist aufgetreten. Bitte versuche es erneut.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-plansey-blush to-background flex flex-col items-center justify-center px-4 py-12">
      <div className="w-full max-w-lg">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/de" className="inline-flex items-center gap-2">
            <Heart className="h-6 w-6 fill-primary text-primary" />
            <span className="font-serif text-2xl font-bold text-foreground">Plansey</span>
          </Link>
          <h1 className="mt-4 text-2xl font-bold text-foreground">Konto erstellen</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Bereits registriert?{" "}
            <Link href="/de/auth/login" className="text-primary hover:underline font-medium">
              Anmelden
            </Link>
          </p>
        </div>

        <div className="bg-card rounded-2xl border border-border shadow-sm p-6 md:p-8">
          {/* Role Selection */}
          <div className="mb-6">
            <p className="text-sm font-medium text-foreground mb-3">Ich bin …</p>
            <div className="grid grid-cols-1 gap-3">
              {roles.map((role) => {
                const Icon = role.icon;
                const isSelected = selectedRole === role.id;
                return (
                  <button
                    key={role.id}
                    type="button"
                    onClick={() => setSelectedRole(role.id)}
                    className={`flex items-center gap-4 rounded-xl border-2 p-4 text-left transition-all ${
                      isSelected
                        ? `${role.border} ${role.bg}`
                        : "border-border hover:border-muted-foreground/30 hover:bg-muted/30"
                    }`}
                  >
                    <div className={`flex-shrink-0 rounded-lg p-2 ${isSelected ? role.bg : "bg-muted"}`}>
                      <Icon className={`h-5 w-5 ${isSelected ? role.color : "text-muted-foreground"}`} />
                    </div>
                    <div>
                      <div className={`font-medium text-sm ${isSelected ? "text-foreground" : "text-muted-foreground"}`}>
                        {role.title}
                      </div>
                      <div className="text-xs text-muted-foreground mt-0.5">{role.description}</div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">
                  Vorname <span className="text-destructive">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={form.firstName}
                  onChange={(e) => setForm({ ...form, firstName: e.target.value })}
                  className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors"
                  placeholder="Max"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">
                  Nachname
                </label>
                <input
                  type="text"
                  value={form.lastName}
                  onChange={(e) => setForm({ ...form, lastName: e.target.value })}
                  className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors"
                  placeholder="Mustermann"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">
                E-Mail-Adresse <span className="text-destructive">*</span>
              </label>
              <input
                type="email"
                required
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors"
                placeholder="max@beispiel.de"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">
                Passwort <span className="text-destructive">*</span>
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  minLength={8}
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  className="w-full rounded-lg border border-input bg-background px-3 py-2 pr-10 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors"
                  placeholder="Mindestens 8 Zeichen"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {error && (
              <div className="rounded-lg bg-destructive/10 border border-destructive/20 px-4 py-3 text-sm text-destructive">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground shadow hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <>
                  Konto erstellen
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>

            <p className="text-xs text-center text-muted-foreground">
              Mit der Registrierung stimmst du unseren{" "}
              <Link href="/de/agb" className="underline hover:text-foreground">
                AGB
              </Link>{" "}
              und der{" "}
              <Link href="/de/datenschutz" className="underline hover:text-foreground">
                Datenschutzerklärung
              </Link>{" "}
              zu.
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
