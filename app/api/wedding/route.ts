import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

// POST /api/wedding – create a new wedding
export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Nicht autorisiert." }, { status: 401 });
    }

    // Only planners can create weddings
    const planner = await db.planner.findUnique({
      where: { userId: session.user.id },
    });
    if (!planner) {
      return NextResponse.json(
        { error: "Nur Planner können Hochzeiten erstellen." },
        { status: 403 }
      );
    }

    const { weddingDate, zipcode, location, estimateBudget, alias } =
      await req.json();

    // Validate alias uniqueness if provided
    if (alias) {
      const existing = await db.wedding.findUnique({ where: { alias } });
      if (existing) {
        return NextResponse.json(
          { error: "Dieser URL-Alias ist bereits vergeben." },
          { status: 409 }
        );
      }
    }

    // Generate a random 6-char RSVP code
    const code = Math.random().toString(36).substring(2, 8).toUpperCase();

    const wedding = await db.$transaction(async (tx) => {
      const newWedding = await tx.wedding.create({
        data: {
          weddingDate: weddingDate ? new Date(weddingDate) : null,
          zipcode: zipcode || null,
          location: location || null,
          estimateBudget: estimateBudget ? parseFloat(estimateBudget) : null,
          alias: alias || null,
          code,
          createdBy: session.user.id,
        },
      });

      // Link planner to wedding
      await tx.weddingPlanner.create({
        data: {
          weddingId: newWedding.id,
          plannerId: planner.id,
        },
      });

      // Mark user as no longer first login
      await tx.user.update({
        where: { id: session.user.id },
        data: { isFirstLogin: false },
      });

      return newWedding;
    });

    return NextResponse.json(
      { message: "Hochzeit erfolgreich erstellt.", weddingId: wedding.id },
      { status: 201 }
    );
  } catch (error) {
    console.error("Create wedding error:", error);
    return NextResponse.json(
      { error: "Ein Fehler ist aufgetreten. Bitte versuche es erneut." },
      { status: 500 }
    );
  }
}

// GET /api/wedding – get current user's wedding
export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Nicht autorisiert." }, { status: 401 });
    }

    const planner = await db.planner.findUnique({
      where: { userId: session.user.id },
      include: {
        weddingPlanners: {
          include: {
            wedding: true,
          },
          orderBy: { id: "desc" },
          take: 1,
        },
      },
    });

    if (!planner || planner.weddingPlanners.length === 0) {
      return NextResponse.json({ wedding: null });
    }

    return NextResponse.json({ wedding: planner.weddingPlanners[0].wedding });
  } catch (error) {
    console.error("Get wedding error:", error);
    return NextResponse.json(
      { error: "Ein Fehler ist aufgetreten." },
      { status: 500 }
    );
  }
}
