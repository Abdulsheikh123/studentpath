import prisma from "../config/prisma.db.js";

export const getCities = async (req, res) => {
  try {
    const { stateId, isPopular } = req.query;

    const where = {};

    if (stateId) where.stateId = Number(stateId);
    if (isPopular !== undefined) {
      where.isPopular = isPopular === "true" || isPopular === true;
    }

    const cities = await prisma.district.findMany({
      where,
      include: {
        state: true,
      },
      orderBy: {
        name: "asc",
      },
    });

    return res.status(200).json({
      success: true,
      message: "Cities fetched successfully",
      data: cities,
    });
  } catch (error) {
    console.error("Get Cities Error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Unable to fetch cities",
    });
  }
};

export const getCityById = async (req, res) => {
  try {
    const { id } = req.params;

    const city = await prisma.district.findUnique({
      where: { id: Number(id) },
      include: {
        state: true,
      },
    });

    if (!city) {
      return res.status(404).json({
        success: false,
        message: "City not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "City fetched successfully",
      data: city,
    });
  } catch (error) {
    console.error("Get City Error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Unable to fetch city",
    });
  }
};

export const createCity = async (req, res) => {
  try {
    const { name, stateId, slug, isPopular, metaTitle, metaDescription } =
      req.body;

    if (!name || !stateId) {
      return res.status(400).json({
        success: false,
        message: "Name and stateId are required",
      });
    }

    // Verify state exists
    const state = await prisma.state.findUnique({
      where: { id: Number(stateId) },
    });

    if (!state) {
      return res.status(400).json({
        success: false,
        message: "State not found",
      });
    }

    const city = await prisma.district.create({
      data: {
        name: name.trim(),
        stateId: Number(stateId),
        slug: (slug || name.toLowerCase().replace(/\s+/g, "-")).trim(),
        isPopular: Boolean(isPopular),
        metaTitle: metaTitle ? metaTitle.trim() : null,
        metaDescription: metaDescription ? metaDescription.trim() : null,
      },
      include: {
        state: true,
      },
    });

    return res.status(201).json({
      success: true,
      message: "City created successfully",
      data: city,
    });
  } catch (error) {
    console.error("Create City Error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Unable to create city",
    });
  }
};

export const updateCity = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, stateId, slug, isPopular, metaTitle, metaDescription } =
      req.body;

    const city = await prisma.district.findUnique({
      where: { id: Number(id) },
    });

    if (!city) {
      return res.status(404).json({
        success: false,
        message: "City not found",
      });
    }

    // If changing state, verify new state exists
    if (stateId && stateId !== city.stateId) {
      const state = await prisma.state.findUnique({
        where: { id: Number(stateId) },
      });

      if (!state) {
        return res.status(400).json({
          success: false,
          message: "State not found",
        });
      }
    }

    const updateData = {};

    if (name !== undefined) updateData.name = name.trim();
    if (stateId !== undefined) updateData.stateId = Number(stateId);
    if (slug !== undefined) updateData.slug = slug.trim();
    if (isPopular !== undefined) updateData.isPopular = Boolean(isPopular);
    if (metaTitle !== undefined)
      updateData.metaTitle = metaTitle ? metaTitle.trim() : null;
    if (metaDescription !== undefined) {
      updateData.metaDescription = metaDescription
        ? metaDescription.trim()
        : null;
    }

    const updatedCity = await prisma.district.update({
      where: { id: Number(id) },
      data: updateData,
      include: {
        state: true,
      },
    });

    return res.status(200).json({
      success: true,
      message: "City updated successfully",
      data: updatedCity,
    });
  } catch (error) {
    console.error("Update City Error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Unable to update city",
    });
  }
};

export const deleteCity = async (req, res) => {
  try {
    const { id } = req.params;

    const city = await prisma.district.findUnique({
      where: { id: Number(id) },
    });

    if (!city) {
      return res.status(404).json({
        success: false,
        message: "City not found",
      });
    }

    await prisma.district.delete({
      where: { id: Number(id) },
    });

    return res.status(200).json({
      success: true,
      message: "City deleted successfully",
    });
  } catch (error) {
    console.error("Delete City Error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Unable to delete city",
    });
  }
};
