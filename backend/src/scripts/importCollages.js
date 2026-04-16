import fs from "fs";
import path from "path";
import dotenv from "dotenv";
import axios from "axios";
import { PrismaClient } from "@prisma/client";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({
  path: path.resolve(__dirname, "..", "..", ".env"),
});

const prisma = new PrismaClient();

// ✅ slug
function makeSlug(text) {
  return text
    ?.toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

// ✅ ✅ CLEAN NAME (🔥 MAIN FIX)
function cleanCollegeName(name) {
  if (!name) return "";

  return name
    // 🔥 remove starting codes (number + dash OR letter+number)
    .replace(/^[A-Z]?\d+\s*-?\s*/i, "")

    // remove ending dot
    .replace(/\.$/, "")

    // fix commas
    .replace(/\s*,\s*/g, ", ")

    // lowercase → proper case
    .toLowerCase()
    .replace(/\b\w/g, (c) => c.toUpperCase())

    // fix 'S
    .replace(/'S/g, "'s")

    .trim();
}

// ✅ category normalize
function getCategory(name) {
  if (!name) return "General";

  name = name.toLowerCase();

  if (name.includes("engineering")) return "Engineering";
  if (name.includes("medical")) return "Medical";
  if (name.includes("management")) return "Management";
  if (name.includes("law")) return "Law";
  if (name.includes("pharmacy")) return "Pharmacy";

  return "General";
}

// ✅ Pixabay image
async function getCollegeImage(name) {
  try {
    const API_KEY = process.env.PIXABAY_API_KEY;

    const url = `https://pixabay.com/api/?key=${API_KEY}&q=${encodeURIComponent(
      name + " college campus india"
    )}&image_type=photo&orientation=horizontal&per_page=5`;

    const res = await axios.get(url);

    const images = res.data.hits;

    if (!images || images.length === 0) {
      return "https://images.unsplash.com/photo-1523050854058-8df90110c9f1";
    }

    return images[Math.floor(Math.random() * images.length)].largeImageURL;
  } catch {
    return "https://images.unsplash.com/photo-1523050854058-8df90110c9f1";
  }
}

// ✅ description
function generateDescription(name, state, type) {
  return `${name} is a ${type || "college"} located in ${state}. It provides quality education, modern facilities, and a good academic environment for students.`;
}

// ✅ MAIN
async function seedColleges() {
  const filePath = path.resolve(
    __dirname,
    "..",
    "data",
    "getCollegeList.json"
  );

  const raw = fs.readFileSync(filePath, "utf-8");
  const json = JSON.parse(raw);

  const data =
    json?.institutionDirectoryDto ||
    json?.data ||
    (Array.isArray(json) ? json : []);

  console.log("🚀 Total Colleges:", data.length);

  for (const item of data) {
    try {
      if (!item.name) continue;

      // ✅ CLEAN NAME
      const cleanName = cleanCollegeName(item.name);

      const slug = makeSlug(cleanName);

      // ✅ category
      const categoryName = getCategory(cleanName);

      const category = await prisma.category.findFirst({
        where: {
          name: {
            equals: categoryName,
            mode: "insensitive",
          },
        },
      });

      // ✅ university
      let university = null;

      if (item.universityName) {
        university = await prisma.university.findFirst({
          where: {
            name: {
              contains: item.universityName.trim(),
              mode: "insensitive",
            },
          },
        });
      }

      // ✅ subDistrict
      const subDistrict = await prisma.subDistrict.findFirst({
        where: {
          name: {
            contains: item.districtName,
            mode: "insensitive",
          },
        },
      });

      if (!subDistrict) {
        console.log("⚠️ SubDistrict not found:", item.districtName);
        continue;
      }

      // ✅ image
      const image = await getCollegeImage(cleanName);

      // ✅ save
      await prisma.college.upsert({
        where: { slug },
        update: {},

        create: {
          name: cleanName,
          slug,

          address: item.address1 || null,

          description: generateDescription(
            cleanName,
            item.stateName,
            item.institutionType
          ),

          image,

          collegeType: item.institutionType || null,
          management: item.manegement || null,
          locationType: item.location || null,
          website: item.webSite || null,

          yearOfEstablishment: item.yearOfEstablishment
            ? Number(item.yearOfEstablishment)
            : null,

          subDistrictId: subDistrict.id,
          categoryId: category?.id || null,
          universityId: university?.id || null,
        },
      });

      console.log("✅ College:", cleanName);
    } catch (err) {
      console.log("❌ Error:", item.name);
      console.log(err.message);
    }
  }

  console.log("🎉 Colleges Seeded");
}

// RUN
seedColleges()
  .catch(console.error)
  .finally(() => prisma.$disconnect());