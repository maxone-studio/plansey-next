import { auth } from "@/lib/auth";
import { redirect, notFound } from "next/navigation";
import { db } from "@/lib/db";
import WeddingForm from "@/components/wedding/WeddingForm";

export default async function EditWeddingPage({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const session = await auth();
  if (!session?.user) redirect("/de/auth/login");

  const { locale, id } = await params;
  const weddingId = parseInt(id);
  if (isNaN(weddingId)) notFound();

  const wedding = await db.wedding.findUnique({
    where: { id: weddingId },
    include: {
      planners: {
        include: { planner: true },
      },
    },
  });

  if (!wedding) notFound();

  // Verify ownership
  const isOwner = wedding.planners.some(
    (wp) => wp.planner.userId === session.user.id
  );
  if (!isOwner) redirect(`/${locale}/dashboard`);

  // Format date for input[type=date]
  const weddingDateStr = wedding.weddingDate
    ? new Date(wedding.weddingDate).toISOString().split("T")[0]
    : "";

  return (
    <div className="py-2">
      <WeddingForm
        weddingId={wedding.id}
        locale={locale}
        initialData={{
          weddingDate: weddingDateStr,
          zipcode: wedding.zipcode ?? "",
          location: wedding.location ?? "",
          estimateBudget: wedding.estimateBudget?.toString() ?? "",
          alias: wedding.alias ?? "",
        }}
      />
    </div>
  );
}
