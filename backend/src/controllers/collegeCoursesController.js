import prisma from "../config/prisma.db.js";

export const getCollegeCourses = async (req, res) => {
  try {
    const { collegeId, courseId } = req.query;

    const where = {};

    if (collegeId) where.collegeId = Number(collegeId);
    if (courseId) where.courseId = Number(courseId);

    const collegeCourses = await prisma.collegeCourse.findMany({
      where,
      include: {
        college: true,
        course: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return res.status(200).json({
      success: true,
      message: "College courses fetched successfully",
      data: collegeCourses,
    });
  } catch (error) {
    console.error("Get College Courses Error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Unable to fetch college courses",
    });
  }
};

export const getCollegeCourseById = async (req, res) => {
  try {
    const { id } = req.params;

    const collegeCourse = await prisma.collegeCourse.findUnique({
      where: { id: Number(id) },
      include: {
        college: true,
        course: true,
      },
    });

    if (!collegeCourse) {
      return res.status(404).json({
        success: false,
        message: "College course not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "College course fetched successfully",
      data: collegeCourse,
    });
  } catch (error) {
    console.error("Get College Course Error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Unable to fetch college course",
    });
  }
};

export const createCollegeCourse = async (req, res) => {
  try {
    const { collegeId, courseId, fees, feesType, seats, admissionMode } =
      req.body;

    if (!collegeId || !courseId) {
      return res.status(400).json({
        success: false,
        message: "collegeId and courseId are required",
      });
    }

    const collegeCourse = await prisma.collegeCourse.create({
      data: {
        collegeId: Number(collegeId),
        courseId: Number(courseId),
        fees: fees ? Number(fees) : null,
        feesType: feesType ? feesType.trim() : null,
        seats: seats ? Number(seats) : null,
        admissionMode: admissionMode ? admissionMode.trim() : null,
      },
      include: {
        college: true,
        course: true,
      },
    });

    return res.status(201).json({
      success: true,
      message: "College course created successfully",
      data: collegeCourse,
    });
  } catch (error) {
    console.error("Create College Course Error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Unable to create college course",
    });
  }
};

export const updateCollegeCourse = async (req, res) => {
  try {
    const { id } = req.params;
    const { collegeId, courseId, fees, feesType, seats, admissionMode } =
      req.body;

    const collegeCourse = await prisma.collegeCourse.findUnique({
      where: { id: Number(id) },
    });

    if (!collegeCourse) {
      return res.status(404).json({
        success: false,
        message: "College course not found",
      });
    }

    const updateData = {};

    if (collegeId !== undefined) updateData.collegeId = Number(collegeId);
    if (courseId !== undefined) updateData.courseId = Number(courseId);
    if (fees !== undefined) updateData.fees = fees ? Number(fees) : null;
    if (feesType !== undefined)
      updateData.feesType = feesType ? feesType.trim() : null;
    if (seats !== undefined) updateData.seats = seats ? Number(seats) : null;
    if (admissionMode !== undefined)
      updateData.admissionMode = admissionMode ? admissionMode.trim() : null;

    const updatedCollegeCourse = await prisma.collegeCourse.update({
      where: { id: Number(id) },
      data: updateData,
      include: {
        college: true,
        course: true,
      },
    });

    return res.status(200).json({
      success: true,
      message: "College course updated successfully",
      data: updatedCollegeCourse,
    });
  } catch (error) {
    console.error("Update College Course Error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Unable to update college course",
    });
  }
};

export const deleteCollegeCourse = async (req, res) => {
  try {
    const { id } = req.params;

    const collegeCourse = await prisma.collegeCourse.findUnique({
      where: { id: Number(id) },
    });

    if (!collegeCourse) {
      return res.status(404).json({
        success: false,
        message: "College course not found",
      });
    }

    await prisma.collegeCourse.delete({
      where: { id: Number(id) },
    });

    return res.status(200).json({
      success: true,
      message: "College course deleted successfully",
    });
  } catch (error) {
    console.error("Delete College Course Error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Unable to delete college course",
    });
  }
};
