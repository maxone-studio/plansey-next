import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { db } from "@/lib/db";

type Role = "planner" | "vendor" | "storyteller";

export async function POST(req: NextRequest) {
  try {
    const { email, password, firstName, lastName, role } = await req.json();

    // Validation
    if (!email || !password || !firstName || !role) {
      return NextResponse.json(
        { error: "Alle Pflichtfelder müssen ausgefüllt sein." },
        { status: 400 }
      );
    }

    const validRoles: Role[] = ["planner", "vendor", "storyteller"];
    if (!validRoles.includes(role)) {
      return NextResponse.json({ error: "Ungültige Rolle." }, { status: 400 });
    }

    if (password.length < 8) {
      return NextResponse.json(
        { error: "Das Passwort muss mindestens 8 Zeichen lang sein." },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await db.user.findUnique({ where: { email } });
    if (existingUser) {
      return NextResponse.json(
        { error: "Diese E-Mail-Adresse ist bereits registriert." },
        { status: 409 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create user + role in transaction
    const user = await db.$transaction(async (tx) => {
      const newUser = await tx.user.create({
        data: {
          email,
          password: hashedPassword,
          firstName,
          lastName: lastName || null,
          defaultAccount: role as Role,
          isActive: true,
          isFirstLogin: true,
        },
      });

      if (role === "planner") {
        await tx.planner.create({
          data: {
            userId: newUser.id,
            firstName,
            lastName: lastName || null,
          },
        });
      } else if (role === "vendor") {
        await tx.vendor.create({
          data: {
            userId: newUser.id,
            name: `${firstName}${lastName ? " " + lastName : ""}`,
            email,
            type: "Basic",
          },
        });
      } else if (role === "storyteller") {
        await tx.storyteller.create({
          data: {
            userId: newUser.id,
            firstName,
            lastName: lastName || null,
          },
        });
      }

      return newUser;
    });

    return NextResponse.json(
      { message: "Registrierung erfolgreich.", userId: user.id },
      { status: 201 }
    );
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { error: "Ein Fehler ist aufgetreten. Bitte versuche es erneut." },
      { status: 500 }
    );
  }
}
