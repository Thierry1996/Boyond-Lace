import "dotenv/config";
import { prisma } from "../src/lib/prisma";

/**
 * Seed a handful of demo rows into self-contained tables. Idempotent: each block
 * only runs when its table is empty, so re-running never duplicates. Run with
 * `npx prisma db seed` (wired via prisma.config.ts → migrations.seed).
 */
async function main() {
  if ((await prisma.contactMessage.count()) === 0) {
    await prisma.contactMessage.createMany({
      data: [
        {
          name: "Amara O.",
          email: "amara@example.com",
          topic: "fit",
          body: 'Which cap size suits a 22.5" circumference?',
        },
        {
          name: "Nadia R.",
          email: "nadia@example.com",
          topic: "order",
          body: "Can I change the shade on my open order?",
        },
        {
          name: "Priya S.",
          email: "priya@example.com",
          topic: "wholesale",
          body: "Interested in a salon partner account.",
        },
      ],
    });
  }

  if ((await prisma.quizLead.count()) === 0) {
    await prisma.quizLead.createMany({
      data: [
        {
          email: "lead1@example.com",
          answers: { goal: "everyday", texture: "body-wave", length: "medium" },
        },
        {
          email: "lead2@example.com",
          answers: { goal: "protective", texture: "deep-wave", length: "long" },
        },
      ],
    });
  }

  if ((await prisma.wholesaleApplication.count()) === 0) {
    await prisma.wholesaleApplication.createMany({
      data: [
        {
          businessName: "Velvet Rooms Salon",
          businessType: "salon",
          contactName: "A. Partner",
          email: "owner@velvetrooms.example",
          phone: "+1 404 555 0100",
          country: "United States",
          estimatedVolume: "50-200",
        },
        {
          businessName: "Lagos Lace Co.",
          businessType: "reseller",
          contactName: "T. Okafor",
          email: "hello@lagoslace.example",
          phone: "+234 801 555 0100",
          country: "Nigeria",
          estimatedVolume: "5-50",
        },
      ],
    });
  }

  const counts = {
    contactMessage: await prisma.contactMessage.count(),
    quizLead: await prisma.quizLead.count(),
    wholesaleApplication: await prisma.wholesaleApplication.count(),
  };
  console.log("🌱 Seed complete:", counts);
}

main()
  .then(() => process.exit(0))
  .catch((e) => {
    console.error("Seed failed:", e);
    process.exit(1);
  });
