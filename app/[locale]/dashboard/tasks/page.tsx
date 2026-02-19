import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import TasksView from "@/components/tasks/TasksView";

export default async function TasksPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const session = await auth();
  if (!session?.user) redirect("/de/auth/login");

  const { locale } = await params;

  // Get planner's wedding
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

  const wedding = planner?.weddingPlanners?.[0]?.wedding ?? null;

  // Load all public chapters with tasks + wedding task statuses
  const chapters = await db.chapter.findMany({
    where: { isPublic: true },
    orderBy: { order: "asc" },
    include: {
      tasks: {
        where: { isPublic: true },
        orderBy: { order: "asc" },
        include: {
          weddingTasks: wedding
            ? {
                where: { weddingId: wedding.id },
                take: 1,
                select: { id: true, status: true, deadline: true },
              }
            : false,
        },
      },
    },
  });

  // Serialize for client component
  const serializedChapters = chapters.map((chapter) => ({
    id: chapter.id,
    name: chapter.name,
    order: chapter.order,
    tasks: chapter.tasks.map((task) => ({
      id: task.id,
      name: task.name,
      order: task.order,
      weddingTasks: (task.weddingTasks ?? []).map((wt) => ({
        id: wt.id,
        status: wt.status,
        deadline: wt.deadline ? wt.deadline.toISOString() : null,
      })),
    })),
  }));

  return (
    <div className="py-2">
      <TasksView
        chapters={serializedChapters}
        weddingId={wedding?.id ?? null}
        locale={locale}
      />
    </div>
  );
}
