import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

// PUT /api/wedding/[id] – update a wedding
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Nicht autorisiert." }, { status: 401 });
    }

    const { id } = await params;
    const weddingId = parseInt(id);
    if (isNaN(weddingId)) {
      return NextResponse.json({ error: "Ungültige ID." }, { status: 400 });
    }

    // Verify ownership
    const wedding = await db.wedding.findUnique({
      where: { id: weddingId },
      include: {
        planners: {
          include: { planner: true },
        },
      },
    });

    if (!wedding) {
      return NextResponse.json({ error: "Hochzeit nicht gefunden." }, { status: 404 });
    }

    const isOwner = wedding.planners.some(
      (wp) => wp.planner.userId === session.user.id
    );
    if (!isOwner) {
      return NextResponse.json({ error: "Keine Berechtigung." }, { status: 403 });
    }

    const { weddingDate, zipcode, location, estimateBudget, alias } =
      await req.json();

    // Validate alias uniqueness if changed
    if (alias && alias !== wedding.alias) {
      const existing = await db.wedding.findUnique({ where: { alias } });
      if (existing) {
        return NextResponse.json(
          { error: "Dieser URL-Alias ist bereits vergeben." },
          { status: 409 }
        );
      }
    }

    const updated = await db.wedding.update({
      where: { id: weddingId },
      data: {
        weddingDate: weddingDate ? new Date(weddingDate) : null,
        zipcode: zipcode || null,
        location: location || null,
        estimateBudget: estimateBudget ? parseFloat(estimateBudget) : null,
        alias: alias || null,
      },
    });

    return NextResponse.json({
      message: "Hochzeit erfolgreich aktualisiert.",
      wedding: updated,
    });
  } catch (error) {
    console.error("Update wedding error:", error);
    return NextResponse.json(
      { error: "Ein Fehler ist aufgetreten. Bitte versuche es erneut." },
      { status: 500 }
    );
  }
}

// GET /api/wedding/[id] – get a specific wedding
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Nicht autorisiert." }, { status: 401 });
    }

    const { id } = await params;
    const weddingId = parseInt(id);
    if (isNaN(weddingId)) {
      return NextResponse.json({ error: "Ungültige ID." }, { status: 400 });
    }

    const wedding = await db.wedding.findUnique({
      where: { id: weddingId },
      include: {
        planners: {
          include: { planner: true },
        },
      },
    });

    if (!wedding) {
      return NextResponse.json({ error: "Hochzeit nicht gefunden." }, { status: 404 });
    }

    const isOwner = wedding.planners.some(
      (wp) => wp.planner.userId === session.user.id
    );
    if (!isOwner) {
      return NextResponse.json({ error: "Keine Berechtigung." }, { status: 403 });
    }

    return NextResponse.json({ wedding });
  } catch (error) {
    console.error("Get wedding error:", error);
    return NextResponse.json(
      { error: "Ein Fehler ist aufgetreten." },
      { status: 500 }
    );
  }
}
