import { PrismaClient } from "@prisma/client";

const db = new PrismaClient();

const chapters = [
  {
    name: "Erste Schritte",
    order: 1,
    tasks: [
      { name: "Hochzeitsbudget festlegen", order: 1 },
      { name: "Hochzeitsdatum wählen", order: 2 },
      { name: "Gästeliste erstellen (erste Version)", order: 3 },
      { name: "Hochzeitsstil & Motto festlegen", order: 4 },
      { name: "Standesamt kontaktieren", order: 5 },
    ],
  },
  {
    name: "Location & Catering",
    order: 2,
    tasks: [
      { name: "Hochzeitslocation besichtigen & buchen", order: 1 },
      { name: "Caterer anfragen & Menü planen", order: 2 },
      { name: "Hochzeitstorte planen", order: 3 },
      { name: "Getränke & Bar organisieren", order: 4 },
      { name: "Sitzplan erstellen", order: 5 },
    ],
  },
  {
    name: "Dienstleister",
    order: 3,
    tasks: [
      { name: "Fotograf buchen", order: 1 },
      { name: "Videograf buchen", order: 2 },
      { name: "DJ oder Band buchen", order: 3 },
      { name: "Florist & Blumendeko planen", order: 4 },
      { name: "Trauredner / Standesbeamten kontaktieren", order: 5 },
      { name: "Hairstylist & Make-up Artist buchen", order: 6 },
    ],
  },
  {
    name: "Kleidung & Ringe",
    order: 4,
    tasks: [
      { name: "Brautkleid aussuchen & kaufen", order: 1 },
      { name: "Anzug / Bräutigamoutfit planen", order: 2 },
      { name: "Eheringe aussuchen & bestellen", order: 3 },
      { name: "Brautschuhe & Accessoires kaufen", order: 4 },
      { name: "Outfits für Trauzeugen planen", order: 5 },
    ],
  },
  {
    name: "Einladungen & Papeterie",
    order: 5,
    tasks: [
      { name: "Save-the-Date Karten versenden", order: 1 },
      { name: "Einladungen gestalten & versenden", order: 2 },
      { name: "Menükarten gestalten", order: 3 },
      { name: "Tischkarten erstellen", order: 4 },
      { name: "Dankeskarten vorbereiten", order: 5 },
    ],
  },
  {
    name: "Flitterwochen & Reise",
    order: 6,
    tasks: [
      { name: "Reiseziel für Flitterwochen wählen", order: 1 },
      { name: "Flüge & Hotel buchen", order: 2 },
      { name: "Reisedokumente prüfen (Reisepass etc.)", order: 3 },
      { name: "Reiseversicherung abschließen", order: 4 },
    ],
  },
  {
    name: "Letzte Vorbereitungen",
    order: 7,
    tasks: [
      { name: "Ablaufplan für den Hochzeitstag erstellen", order: 1 },
      { name: "Endgültige Gästeliste & RSVP prüfen", order: 2 },
      { name: "Alle Dienstleister nochmals bestätigen", order: 3 },
      { name: "Ringe & Dokumente bereit legen", order: 4 },
      { name: "Notfallkit packen (Nadel, Faden, Pflaster etc.)", order: 5 },
    ],
  },
];

async function main() {
  console.log("🌱 Seeding chapters and tasks...");

  for (const chapterData of chapters) {
    const chapter = await db.chapter.upsert({
      where: { id: chapters.indexOf(chapterData) + 1 },
      update: { name: chapterData.name, order: chapterData.order },
      create: {
        name: chapterData.name,
        order: chapterData.order,
        isPublic: true,
      },
    });

    for (const taskData of chapterData.tasks) {
      await db.task.upsert({
        where: {
          id:
            chapters
              .slice(0, chapters.indexOf(chapterData))
              .reduce((acc, c) => acc + c.tasks.length, 0) +
            chapterData.tasks.indexOf(taskData) +
            1,
        },
        update: { name: taskData.name, order: taskData.order },
        create: {
          chapterId: chapter.id,
          name: taskData.name,
          order: taskData.order,
          isPublic: true,
        },
      });
    }

    console.log(`  ✓ Chapter "${chapterData.name}" with ${chapterData.tasks.length} tasks`);
  }

  console.log("✅ Seed complete!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });
