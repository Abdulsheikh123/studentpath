const fs = require("fs");
const path = require("path");
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

function makeSlug(text) {
  return text
    ?.toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

// SEO friendly institute description generator
function generateInstituteDescription(
  instituteName,
  stateName,
  instituteType,
  universityName
) {
  const templates = [
    `${instituteName} is a reputed ${instituteType || "institute"} located in ${stateName}. The institute is known for providing quality education, practical training, and modern facilities for students. ${instituteName} is affiliated with ${universityName || "a recognized university"} and offers a supportive environment that helps students build strong academic and career skills.`,

    `${instituteName}, situated in ${stateName}, is one of the popular choices for students looking for professional education. The institute offers various diploma and degree programs with experienced faculty and updated infrastructure. Affiliated with ${universityName || "a well-known university"}, ${instituteName} focuses on academic growth and better career opportunities.`,

    `${instituteName} is a well-known educational institute in ${stateName}. It provides students with quality learning, skilled teachers, and industry-focused programs. The institute is connected with ${universityName || "a recognized university"} and is appreciated for its student-friendly campus, practical knowledge, and career-oriented approach.`,

    `Located in ${stateName}, ${instituteName} is a respected ${instituteType || "institution"} offering a wide range of educational opportunities. The institute is affiliated with ${universityName || "a reputed university"} and is known for its modern campus, experienced faculty, and focus on practical learning for students.`,

    `${instituteName} in ${stateName} is recognized for delivering quality education and valuable training to students. With affiliation to ${universityName || "a trusted university"}, the institute provides good infrastructure, helpful faculty, and multiple academic programs that prepare students for successful careers.`
  ];

  return templates[Math.floor(Math.random() * templates.length)];
}

async function importStandaloneInstitutes() {
  const rawData = fs.readFileSync(
    path.resolve(__dirname, "..", "data", "getStandaloneInstituteList.json"),
    "utf-8"
  );

  const json = JSON.parse(rawData);

  const institutes = json.institutionDirectoryDto || [];

  console.log("Total Institutes:", institutes.length);

  for (const item of institutes) {
    try {
      let stateName = item.stateName?.trim();

      if (stateName === "NCT of Delhi") stateName = "Delhi";
      if (stateName === "Orissa") stateName = "Odisha";
      if (stateName === "Uttaranchal") stateName = "Uttarakhand";

      const state = await prisma.state.findFirst({
        where: {
          name: stateName,
        },
      });

      if (!state) {
        console.log("State not found:", item.stateName);
        continue;
      }

      let district = null;

      if (item.districtName) {
        district = await prisma.district.findFirst({
          where: {
            name: item.districtName.trim(),
            stateId: state.id,
          },
        });
      }

      // Category find
      const type = (item.institutionType || "").toLowerCase();
      const name = (item.name || "").toLowerCase();

      let categoryName = "General College";

      if (type.includes("polytechnic") || name.includes("polytechnic")) {
        categoryName = "Polytechnic";
      } else if (type.includes("iti") || name.includes("iti")) {
        categoryName = "ITI";
      } else if (name.includes("engineering")) {
        categoryName = "Engineering College";
      } else if (name.includes("management")) {
        categoryName = "Management College";
      }

      const category = await prisma.category.findFirst({
        where: {
          name: categoryName,
        },
      });

      let slug = makeSlug(item.name);

      const existing = await prisma.standaloneInstitute.findFirst({
        where: { slug },
      });

      if (existing) {
        slug = `${slug}-${item.aisheCode?.toLowerCase()}`;
      }

      // Description generate
      const description = generateInstituteDescription(
        item.name,
        stateName || "India",
        item.institutionType,
        item.universityName
      );

      await prisma.standaloneInstitute.create({
        data: {
          name: item.name,
          slug,

          description,

          image: null,

          instituteType: item.institutionType || null,
          management: item.manegement || null,

          affiliatedUniversityName: item.universityName || null,
          affiliatedUniversityType: item.universityType || null,

          locationType: item.location || null,
          website: item.webSite || null,

          yearOfEstablishment: item.yearOfEstablishment
            ? parseInt(item.yearOfEstablishment)
            : null,

          stateId: state.id,
          districtId: district ? district.id : null,
          subDistrictId: null,

          categoryId: category ? category.id : null,
        },
      });

      console.log("Saved:", item.name);
    } catch (error) {
      console.log("Error:", item.name);
      console.log(error.message);
    }
  }

  console.log("Standalone institute import completed");
}

importStandaloneInstitutes()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
  });