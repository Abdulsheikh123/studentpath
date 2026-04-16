import prisma from "../config/prisma.db.js";

export const getColleges = async (req, res) => {
  try {
    const { stateId, districtId, categoryId, collegeType } = req.query;

    const where = {};

    // PARTNER SELF-MANAGEMENT: Filter by collegeId if logged in as Institution Admin
    if (req.institutionAdmin) {
      if (!req.institutionAdmin.collegeId) {
        return res.status(200).json({ success: true, data: [] });
      }
      where.id = req.institutionAdmin.collegeId;
    }

    if (stateId) where.stateId = Number(stateId);
    if (districtId) where.districtId = Number(districtId);
    if (categoryId) where.categoryId = Number(categoryId);
    if (collegeType) where.collegeType = collegeType;

    const colleges = await prisma.college.findMany({
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
        university: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return res.status(200).json({
      success: true,
      message: "Colleges fetched successfully",
      data: colleges,
    });
  } catch (error) {
    console.log("Get Colleges Error:", error);
    return res.status(500).json({
      success: false,
      message: "Unable to fetch colleges",
    });
  }
};

export const getCollegeBySlug = async (req, res) => {
  try {
    const { slug } = req.params;

    const college = await prisma.college.findUnique({
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
        university: true,
      },
    });

    if (!college) {
      return res.status(404).json({
        success: false,
        message: "College not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "College fetched successfully",
      data: college,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Unable to fetch college details",
    });
  }
};

export const createCollege = async (req, res) => {
  try {
    const {
      name,
      slug,
      image,
      description,
      collegeType,
      management,
      affiliatedUniversityName,
      affiliatedUniversityType,
      locationType,
      website,
      yearOfEstablishment,
      stateId,
      districtId,
      categoryId,
    } = req.body;

    if (!name || !slug || !stateId) {
      return res.status(400).json({
        success: false,
        message: "Name, slug and stateId are required",
      });
    }

    const college = await prisma.college.create({
      data: {
        name,
        slug,
        image,
        description,
        collegeType,
        management,
        affiliatedUniversityName,
        affiliatedUniversityType,
        locationType,
        website,
        yearOfEstablishment: yearOfEstablishment
          ? Number(yearOfEstablishment)
          : null,
        stateId: Number(stateId),
        districtId: districtId ? Number(districtId) : null,
        categoryId: categoryId ? Number(categoryId) : null,
      },
    });

    return res.status(201).json({
      success: true,
      message: "College created successfully",
      data: college,
    });
  } catch (error) {
    console.error("Create College Error:", error);
    return res.status(500).json({
      success: false,
      message: "Unable to create college",
    });
  }
};

export const updateCollege = async (req, res) => {
  try {
    const { id } = req.params;

    // PARTNER SECURITY: Ensure they can only update their own college
    if (req.institutionAdmin && Number(id) !== req.institutionAdmin.collegeId) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized: You can only manage your own institution",
      });
    }

    const {
      name,
      slug,
      image,
      description,
      collegeType,
      management,
      affiliatedUniversityName,
      affiliatedUniversityType,
      locationType,
      website,
      yearOfEstablishment,
      stateId,
      districtId,
      categoryId,
    } = req.body;

    const college = await prisma.college.update({
      where: { id: Number(id) },
      data: {
        name,
        slug,
        image,
        description,
        collegeType,
        management,
        affiliatedUniversityName,
        affiliatedUniversityType,
        locationType,
        website,
        yearOfEstablishment:
          yearOfEstablishment !== undefined
            ? yearOfEstablishment
              ? Number(yearOfEstablishment)
              : null
            : undefined,
        stateId: stateId ? Number(stateId) : undefined,
        districtId:
          districtId !== undefined
            ? districtId
              ? Number(districtId)
              : null
            : undefined,
        categoryId:
          categoryId !== undefined
            ? categoryId
              ? Number(categoryId)
              : null
            : undefined,
      },
    });

    return res.status(200).json({
      success: true,
      message: "College updated successfully",
      data: college,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Unable to update college",
    });
  }
};

export const deleteCollege = async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.college.delete({
      where: { id: Number(id) },
    });
    return res.status(200).json({
      success: true,
      message: "College deleted successfully",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Unable to delete college",
    });
  }
};
