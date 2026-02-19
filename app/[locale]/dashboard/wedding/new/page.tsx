import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import WeddingForm from "@/components/wedding/WeddingForm";

export default async function NewWeddingPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const session = await auth();
  if (!session?.user) redirect("/de/auth/login");

  const { locale } = await params;

  // If planner already has a wedding, redirect to edit
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

  if (planner?.weddingPlanners?.[0]?.wedding) {
    const weddingId = planner.weddingPlanners[0].wedding.id;
    redirect(`/${locale}/dashboard/wedding/${weddingId}/edit`);
  }

  return (
    <div className="py-2">
      <WeddingForm locale={locale} />
    </div>
  );
}
