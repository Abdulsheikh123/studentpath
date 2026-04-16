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

// ✅ Slug
function makeSlug(text) {
  return text
    ?.toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

// ✅ Pixabay Image (FIXED 🔥)
async function getUniversityImage(name) {
  try {
    const API_KEY = process.env.PIXABAY_API_KEY;

    const query = `${name} university campus india`;

    const url = `https://pixabay.com/api/?key=${API_KEY}&q=${encodeURIComponent(
      query
    )}&image_type=photo&orientation=horizontal&per_page=10`;

    const res = await axios.get(url);

    const images = res.data.hits;

    if (!images || images.length === 0) {
      return "https://images.unsplash.com/photo-1523050854058-8df90110c9f1";
    }

    const randomImage =
      images[Math.floor(Math.random() * images.length)];

    return randomImage.largeImageURL;
  } catch (error) {
    return "https://images.unsplash.com/photo-1523050854058-8df90110c9f1";
  }
}

// ✅ Description
function generateUniversityDescription(name, state, type, year, location) {
  const templates = [
    `${name} is a reputed ${type || "university"} located in ${state}. It is known for quality education, experienced faculty, and modern campus facilities.`,

    `${name}, situated in ${state}, offers a wide range of courses for students. Established in ${
      year || "recent years"
    }, the university focuses on academic excellence and career growth.`,

    `${name} is one of the well-known institutions in ${state}. It provides modern infrastructure, skilled faculty, and a supportive learning environment in a ${
      location || "well-developed"
    } area.`,

    `Located in ${state}, ${name} is a popular choice among students for higher education. It offers diverse programs and focuses on skill development.`,

    `${name} in ${state} is recognized for its academic standards and student-friendly environment. It provides quality education along with modern facilities.`
  ];

  return templates[Math.floor(Math.random() * templates.length)];
}

// ✅ MAIN FUNCTION
async function importUniversities() {
  const filePath = path.resolve(
    __dirname,
    "..",
    "data",
    "getUniversityList.json"
  );

  const rawData = fs.readFileSync(filePath, "utf-8");
  const json = JSON.parse(rawData);

  const universities =
    json?.institutionDirectoryDto || json?.data || [];

  console.log(`🚀 Total Universities: ${universities.length}`);

  for (const item of universities) {
    try {
      if (!item.name || !item.stateName) continue;

      // ✅ State
      const state = await prisma.state.findFirst({
        where: {
          name: {
            equals: item.stateName.trim(),
            mode: "insensitive",
          },
        },
      });

      if (!state) {
        console.log("❌ State not found:", item.stateName);
        continue;
      }

      // ✅ District
      let district = null;

      if (item.districtName) {
        district = await prisma.district.findFirst({
          where: {
            name: {
              equals: item.districtName.trim(),
              mode: "insensitive",
            },
            stateId: state.id,
          },
        });
      }

      // ✅ Slug
      let slug = makeSlug(item.name);

      // ✅ IMAGE (await IMPORTANT 🔥)
      const image = await getUniversityImage(item.name);

      // ✅ UPSERT
      await prisma.university.upsert({
        where: { slug },
        update: {},

        create: {
          name: item.name,
          slug,

          description: generateUniversityDescription(
            item.name,
            item.stateName,
            item.institutionType,
            item.yearOfEstablishment,
            item.location
          ),

          image,

          universityType: item.institutionType || null,

          yearOfEstablishment: item.yearOfEstablishment
            ? Number(item.yearOfEstablishment)
            : null,

          website: item.webSite || null,
          locationType: item.location || null,

          stateId: state.id,
          districtId: district?.id || null,
        },
      });

      console.log("✅ Saved:", item.name);
    } catch (err) {
      console.log("❌ Error:", item.name);
      console.log(err.message);
    }
  }

  console.log("🎉 Import Completed");
}

// ✅ RUN
importUniversities()
  .catch(console.error)
  .finally(() => prisma.$disconnect());