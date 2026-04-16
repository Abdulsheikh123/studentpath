import prisma from "../config/prisma.db.js";

export const getUniversities = async (req, res) => {
  try {
    const { stateId, districtId, subDistrictId, universityType } = req.query;

    const where = {};

    // PARTNER SELF-MANAGEMENT: Filter by universityId if logged in as University Admin
    if (req.institutionAdmin) {
      if (!req.institutionAdmin.universityId) {
        return res.status(200).json({ success: true, data: [] });
      }
      where.id = req.institutionAdmin.universityId;
    }

    if (stateId) where.stateId = Number(stateId);
    if (districtId) where.districtId = Number(districtId);
    if (subDistrictId) where.subDistrictId = Number(subDistrictId);
    if (universityType) where.universityType = universityType;

    const universities = await prisma.university.findMany({
      where,
      include: {
        state: true,
        district: true,
        subDistrict: true,
        admin: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return res.status(200).json({
      success: true,
      message: "Universities fetched successfully",
      data: universities,
    });
  } catch (error) {
    console.log("Get Universities Error:", error);
    return res.status(500).json({
      success: false,
      message: "Unable to fetch universities",
    });
  }
};

export const getUniversityBySlug = async (req, res) => {
  try {
    const { slug } = req.params;

    const university = await prisma.university.findUnique({
      where: {
        slug,
      },
      include: {
        state: true,
        district: true,
        subDistrict: true,
        admin: true,
      },
    });

    if (!university) {
      return res.status(404).json({
        success: false,
        message: "University not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "University fetched successfully",
      data: university,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Unable to fetch university details",
    });
  }
};

export const createUniversity = async (req, res) => {
  try {
    const {
      name,
      slug,
      image,
      description,
      universityType,
      yearOfEstablishment,
      website,
      locationType,
      stateId,
      districtId,
      subDistrictId,
    } = req.body;

    if (!name || !slug || !stateId) {
      return res.status(400).json({
        success: false,
        message: "Name, slug and stateId are required",
      });
    }

    const university = await prisma.university.create({
      data: {
        name,
        slug,
        image,
        description,
        universityType,
        yearOfEstablishment: yearOfEstablishment
          ? Number(yearOfEstablishment)
          : null,
        website,
        locationType,
        stateId: Number(stateId),
        districtId: districtId ? Number(districtId) : null,
        subDistrictId: subDistrictId ? Number(subDistrictId) : null,
      },
    });

    return res.status(201).json({
      success: true,
      message: "University created successfully",
      data: university,
    });
  } catch (error) {
    console.error("Create University Error:", error);
    return res.status(500).json({
      success: false,
      message: "Unable to create university",
    });
  }
};

export const updateUniversity = async (req, res) => {
  try {
    const { id } = req.params;

    // PARTNER SECURITY: Ensure they can only update their own university
    if (
      req.institutionAdmin &&
      Number(id) !== req.institutionAdmin.universityId
    ) {
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
      universityType,
      yearOfEstablishment,
      website,
      locationType,
      stateId,
      districtId,
      subDistrictId,
    } = req.body;

    const university = await prisma.university.update({
      where: { id: Number(id) },
      data: {
        name,
        slug,
        image,
        description,
        universityType,
        yearOfEstablishment:
          yearOfEstablishment !== undefined
            ? yearOfEstablishment
              ? Number(yearOfEstablishment)
              : null
            : undefined,
        website,
        locationType,
        stateId: stateId ? Number(stateId) : undefined,
        districtId:
          districtId !== undefined
            ? districtId
              ? Number(districtId)
              : null
            : undefined,
        subDistrictId:
          subDistrictId !== undefined
            ? subDistrictId
              ? Number(subDistrictId)
              : null
            : undefined,
      },
    });

    return res.status(200).json({
      success: true,
      message: "University updated successfully",
      data: university,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Unable to update university",
    });
  }
};

export const deleteUniversity = async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.university.delete({
      where: { id: Number(id) },
    });
    return res.status(200).json({
      success: true,
      message: "University deleted successfully",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Unable to delete university",
    });
  }
};
