import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

// GET /api/tasks – get all chapters + tasks for the current wedding
export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Nicht autorisiert." }, { status: 401 });
    }

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

    // Load all public chapters with their tasks
    const chapters = await db.chapter.findMany({
      where: { isPublic: true },
      orderBy: { order: "asc" },
      include: {
        tasks: {
          where: { isPublic: true },
          orderBy: { order: "asc" },
          include: {
            // Include wedding task status if wedding exists
            weddingTasks: wedding
              ? {
                  where: { weddingId: wedding.id },
                  take: 1,
                }
              : false,
          },
        },
      },
    });

    return NextResponse.json({ chapters, weddingId: wedding?.id ?? null });
  } catch (error) {
    console.error("Get tasks error:", error);
    return NextResponse.json({ error: "Ein Fehler ist aufgetreten." }, { status: 500 });
  }
}
