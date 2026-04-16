import prisma from "../config/prisma.db.js";

export const getStandaloneInstitutes = async (req, res) => {
  try {
    const { stateId, districtId, categoryId } = req.query;

    const where = {};
    if (stateId) where.stateId = Number(stateId);
    if (districtId) where.districtId = Number(districtId);
    if (categoryId) where.categoryId = Number(categoryId);

    const institutes = await prisma.standaloneInstitute.findMany({
      where,
      include: {
        subDistrict: {
          include: {
            district: {
              include: {
                state: true,
              },
            },
          },
        },
        category: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return res.status(200).json({
      success: true,
      message: "Standalone institutes fetched successfully",
      data: institutes,
    });
  } catch (error) {
    console.log("Get Standalone Institutes Error:", error);
    return res.status(500).json({
      success: false,
      message: "Unable to fetch standalone institutes",
    });
  }
};

export const getStandaloneInstituteBySlug = async (req, res) => {
  try {
    const { slug } = req.params;

    const institute = await prisma.standaloneInstitute.findUnique({
      where: {
        slug,
      },
      include: {
        subDistrict: {
          include: {
            district: {
              include: {
                state: true,
              },
            },
          },
        },
        category: true,
      },
    });

    if (!institute) {
      return res.status(404).json({
        success: false,
        message: "Standalone institute not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Standalone institute fetched successfully",
      data: institute,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Unable to fetch standalone institute details",
    });
  }
};
