"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Calendar,
  MapPin,
  Wallet,
  Link as LinkIcon,
  Loader2,
  Heart,
} from "lucide-react";

interface WeddingFormData {
  weddingDate: string;
  zipcode: string;
  location: string;
  estimateBudget: string;
  alias: string;
}

interface WeddingFormProps {
  weddingId?: number;
  initialData?: Partial<WeddingFormData>;
  locale?: string;
}

export default function WeddingForm({
  weddingId,
  initialData,
  locale = "de",
}: WeddingFormProps) {
  const router = useRouter();
  const isEdit = !!weddingId;

  const [form, setForm] = useState<WeddingFormData>({
    weddingDate: initialData?.weddingDate ?? "",
    zipcode: initialData?.zipcode ?? "",
    location: initialData?.location ?? "",
    estimateBudget: initialData?.estimateBudget ?? "",
    alias: initialData?.alias ?? "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const url = isEdit ? `/api/wedding/${weddingId}` : "/api/wedding";
      const method = isEdit ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          weddingDate: form.weddingDate || null,
          zipcode: form.zipcode || null,
          location: form.location || null,
          estimateBudget: form.estimateBudget || null,
          alias: form.alias || null,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error ?? "Ein Fehler ist aufgetreten.");
        return;
      }

      setSuccess(true);

      // Redirect to dashboard after short delay
      setTimeout(() => {
        router.push(`/${locale}/dashboard`);
        router.refresh();
      }, 800);
    } catch {
      setError("Netzwerkfehler. Bitte versuche es erneut.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
            <Heart className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">
              {isEdit ? "Hochzeit bearbeiten" : "Hochzeit anlegen"}
            </h1>
            <p className="text-sm text-muted-foreground">
              {isEdit
                ? "Aktualisiere deine Hochzeitsdetails."
                : "Starte mit den wichtigsten Infos – du kannst alles später noch ändern."}
            </p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Wedding Date */}
        <div className="rounded-xl border border-border bg-card p-6 space-y-4">
          <h2 className="font-semibold text-foreground flex items-center gap-2">
            <Calendar className="h-4 w-4 text-primary" />
            Hochzeitsdatum
          </h2>
          <div>
            <label
              htmlFor="weddingDate"
              className="block text-sm font-medium text-foreground mb-1.5"
            >
              Datum der Hochzeit
            </label>
            <input
              type="date"
              id="weddingDate"
              name="weddingDate"
              value={form.weddingDate}
              onChange={handleChange}
              className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
            />
            <p className="mt-1 text-xs text-muted-foreground">
              Noch kein Datum? Kein Problem – du kannst es später eintragen.
            </p>
          </div>
        </div>

        {/* Location */}
        <div className="rounded-xl border border-border bg-card p-6 space-y-4">
          <h2 className="font-semibold text-foreground flex items-center gap-2">
            <MapPin className="h-4 w-4 text-primary" />
            Ort
          </h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div>
              <label
                htmlFor="zipcode"
                className="block text-sm font-medium text-foreground mb-1.5"
              >
                PLZ
              </label>
              <input
                type="text"
                id="zipcode"
                name="zipcode"
                value={form.zipcode}
                onChange={handleChange}
                placeholder="12345"
                maxLength={10}
                className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
              />
            </div>
            <div className="sm:col-span-2">
              <label
                htmlFor="location"
                className="block text-sm font-medium text-foreground mb-1.5"
              >
                Stadt / Ort
              </label>
              <input
                type="text"
                id="location"
                name="location"
                value={form.location}
                onChange={handleChange}
                placeholder="z.B. München"
                className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
              />
            </div>
          </div>
        </div>

        {/* Budget */}
        <div className="rounded-xl border border-border bg-card p-6 space-y-4">
          <h2 className="font-semibold text-foreground flex items-center gap-2">
            <Wallet className="h-4 w-4 text-plansey-gold" />
            Budget
          </h2>
          <div>
            <label
              htmlFor="estimateBudget"
              className="block text-sm font-medium text-foreground mb-1.5"
            >
              Geschätztes Gesamtbudget (€)
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">
                €
              </span>
              <input
                type="number"
                id="estimateBudget"
                name="estimateBudget"
                value={form.estimateBudget}
                onChange={handleChange}
                placeholder="15000"
                min="0"
                step="100"
                className="w-full rounded-lg border border-input bg-background pl-7 pr-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
              />
            </div>
            <p className="mt-1 text-xs text-muted-foreground">
              Dient als Richtwert für deine Budget-Übersicht.
            </p>
          </div>
        </div>

        {/* Alias / URL */}
        <div className="rounded-xl border border-border bg-card p-6 space-y-4">
          <h2 className="font-semibold text-foreground flex items-center gap-2">
            <LinkIcon className="h-4 w-4 text-blue-500" />
            Persönliche URL (optional)
          </h2>
          <div>
            <label
              htmlFor="alias"
              className="block text-sm font-medium text-foreground mb-1.5"
            >
              URL-Alias
            </label>
            <div className="flex items-center gap-0">
              <span className="flex items-center rounded-l-lg border border-r-0 border-input bg-muted px-3 py-2 text-sm text-muted-foreground whitespace-nowrap">
                plansey.de/
              </span>
              <input
                type="text"
                id="alias"
                name="alias"
                value={form.alias}
                onChange={handleChange}
                placeholder="max-und-anna"
                maxLength={30}
                pattern="[a-z0-9-]+"
                className="flex-1 rounded-r-lg border border-input bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
              />
            </div>
            <p className="mt-1 text-xs text-muted-foreground">
              Nur Kleinbuchstaben, Zahlen und Bindestriche. Wird für die RSVP-Seite genutzt.
            </p>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="rounded-lg bg-destructive/10 border border-destructive/20 px-4 py-3 text-sm text-destructive">
            {error}
          </div>
        )}

        {/* Success */}
        {success && (
          <div className="rounded-lg bg-green-50 border border-green-200 px-4 py-3 text-sm text-green-700">
            ✓ {isEdit ? "Änderungen gespeichert!" : "Hochzeit erfolgreich angelegt!"} Du wirst weitergeleitet…
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center gap-3 justify-end">
          <button
            type="button"
            onClick={() => router.back()}
            className="rounded-lg border border-border px-4 py-2 text-sm font-medium text-foreground hover:bg-muted transition-colors"
          >
            Abbrechen
          </button>
          <button
            type="submit"
            disabled={loading || success}
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {loading && <Loader2 className="h-4 w-4 animate-spin" />}
            {isEdit ? "Änderungen speichern" : "Hochzeit anlegen"}
          </button>
        </div>
      </form>
    </div>
  );
}
