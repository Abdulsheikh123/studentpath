    import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// ✅ Slug
function makeSlug(text) {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

// ✅ Categories List
const categories = [
  "Engineering",
  "Medical",
  "Management",
  "Law",
  "Arts",
  "Science",
  "Commerce",
  "Pharmacy",
  "Education",
  "Design",
  "Mass Communication",
  "Hotel Management",
  "Agriculture",
  "Computer Applications",
  "Architecture",
  "Paramedical",
  "Animation",
  "Aviation",
  "Fashion Design",
  "Fine Arts"
];

// ✅ MAIN
async function seedCategories() {
  for (const name of categories) {
    const slug = makeSlug(name);

    await prisma.category.upsert({
      where: { slug },
      update: {},
      create: {
        name,
        slug
      }
    });

    console.log("✅ Category:", name);
  }

  console.log("🎉 Categories Seeded");
}

seedCategories()
  .catch(console.error)
  .finally(() => prisma.$disconnect()); 