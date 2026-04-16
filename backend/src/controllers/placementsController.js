import prisma from "../config/prisma.db.js";

export const getPlacements = async (req, res) => {
  try {
    const { type, collegeId, universityId } = req.query;

    // Support querying different placement types
    if (type === "college" && collegeId) {
      const placements = await prisma.collegePlacement.findMany({
        where: { collegeId: Number(collegeId) },
        include: { college: true },
        orderBy: { createdAt: "desc" },
      });

      return res.status(200).json({
        success: true,
        message: "College placements fetched successfully",
        data: placements,
      });
    }

    if (type === "university" && universityId) {
      const placements = await prisma.universityPlacement.findMany({
        where: { universityId: Number(universityId) },
        include: { university: true },
        orderBy: { createdAt: "desc" },
      });

      return res.status(200).json({
        success: true,
        message: "University placements fetched successfully",
        data: placements,
      });
    }

    // Default: return college placements
    const placements = await prisma.collegePlacement.findMany({
      include: { college: true },
      orderBy: { createdAt: "desc" },
    });

    return res.status(200).json({
      success: true,
      message: "Placements fetched successfully",
      data: placements,
    });
  } catch (error) {
    console.error("Get Placements Error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Unable to fetch placements",
    });
  }
};

export const getPlacementById = async (req, res) => {
  try {
    const { id } = req.params;

    // Try to find in college placements first
    let placement = await prisma.collegePlacement.findUnique({
      where: { id: Number(id) },
      include: { college: true },
    });

    if (!placement) {
      // Try university placements
      placement = await prisma.universityPlacement.findUnique({
        where: { id: Number(id) },
        include: { university: true },
      });
    }

    if (!placement) {
      return res.status(404).json({
        success: false,
        message: "Placement not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Placement fetched successfully",
      data: placement,
    });
  } catch (error) {
    console.error("Get Placement Error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Unable to fetch placement",
    });
  }
};

export const createPlacement = async (req, res) => {
  try {
    const {
      type = "college",
      collegeId,
      year,
      totalStudents,
      placedStudents,
      averagePackage,
      highestPackage,
      lowestPackage,
      companies,
      topRecruiter,
    } = req.body;

    if (type === "college") {
      if (!collegeId) {
        return res.status(400).json({
          success: false,
          message: "collegeId is required for college placement",
        });
      }

      const placement = await prisma.collegePlacement.create({
        data: {
          collegeId: Number(collegeId),
          year: year ? Number(year) : null,
          totalStudents: totalStudents ? Number(totalStudents) : null,
          placedStudents: placedStudents ? Number(placedStudents) : null,
          averagePackage: averagePackage ? Number(averagePackage) : null,
          highestPackage: highestPackage ? Number(highestPackage) : null,
          lowestPackage: lowestPackage ? Number(lowestPackage) : null,
          companies: companies ? Number(companies) : null,
          topRecruiter: topRecruiter ? topRecruiter.trim() : null,
        },
        include: { college: true },
      });

      return res.status(201).json({
        success: true,
        message: "Placement created successfully",
        data: placement,
      });
    }

    return res.status(400).json({
      success: false,
      message: "Only college placements are currently supported",
    });
  } catch (error) {
    console.error("Create Placement Error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Unable to create placement",
    });
  }
};

export const updatePlacement = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      year,
      totalStudents,
      placedStudents,
      averagePackage,
      highestPackage,
      lowestPackage,
      companies,
      topRecruiter,
    } = req.body;

    // Try college placements
    let placement = await prisma.collegePlacement.findUnique({
      where: { id: Number(id) },
    });

    if (!placement) {
      return res.status(404).json({
        success: false,
        message: "Placement not found",
      });
    }

    const updateData = {};

    if (year !== undefined) updateData.year = year ? Number(year) : null;
    if (totalStudents !== undefined)
      updateData.totalStudents = totalStudents ? Number(totalStudents) : null;
    if (placedStudents !== undefined)
      updateData.placedStudents = placedStudents
        ? Number(placedStudents)
        : null;
    if (averagePackage !== undefined)
      updateData.averagePackage = averagePackage
        ? Number(averagePackage)
        : null;
    if (highestPackage !== undefined)
      updateData.highestPackage = highestPackage
        ? Number(highestPackage)
        : null;
    if (lowestPackage !== undefined)
      updateData.lowestPackage = lowestPackage ? Number(lowestPackage) : null;
    if (companies !== undefined)
      updateData.companies = companies ? Number(companies) : null;
    if (topRecruiter !== undefined)
      updateData.topRecruiter = topRecruiter ? topRecruiter.trim() : null;

    const updatedPlacement = await prisma.collegePlacement.update({
      where: { id: Number(id) },
      data: updateData,
      include: { college: true },
    });

    return res.status(200).json({
      success: true,
      message: "Placement updated successfully",
      data: updatedPlacement,
    });
  } catch (error) {
    console.error("Update Placement Error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Unable to update placement",
    });
  }
};

export const deletePlacement = async (req, res) => {
  try {
    const { id } = req.params;

    // Try college placements
    let placement = await prisma.collegePlacement.findUnique({
      where: { id: Number(id) },
    });

    if (!placement) {
      return res.status(404).json({
        success: false,
        message: "Placement not found",
      });
    }

    await prisma.collegePlacement.delete({
      where: { id: Number(id) },
    });

    return res.status(200).json({
      success: true,
      message: "Placement deleted successfully",
    });
  } catch (error) {
    console.error("Delete Placement Error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Unable to delete placement",
    });
  }
};
