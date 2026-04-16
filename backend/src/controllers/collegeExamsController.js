import prisma from "../config/prisma.db.js";

export const getCollegeExams = async (req, res) => {
  try {
    const { collegeId, courseId, examId } = req.query;

    const where = {};

    if (collegeId) where.collegeId = Number(collegeId);
    if (courseId) where.courseId = Number(courseId);
    if (examId) where.examId = Number(examId);

    const collegeExams = await prisma.collegeExam.findMany({
      where,
      include: {
        college: true,
        course: true,
        exam: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return res.status(200).json({
      success: true,
      message: "College exams fetched successfully",
      data: collegeExams,
    });
  } catch (error) {
    console.error("Get College Exams Error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Unable to fetch college exams",
    });
  }
};

export const getCollegeExamById = async (req, res) => {
  try {
    const { id } = req.params;

    const collegeExam = await prisma.collegeExam.findUnique({
      where: { id: Number(id) },
      include: {
        college: true,
        course: true,
        exam: true,
      },
    });

    if (!collegeExam) {
      return res.status(404).json({
        success: false,
        message: "College exam not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "College exam fetched successfully",
      data: collegeExam,
    });
  } catch (error) {
    console.error("Get College Exam Error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Unable to fetch college exam",
    });
  }
};

export const createCollegeExam = async (req, res) => {
  try {
    const { collegeId, courseId, examId } = req.body;

    if (!collegeId || !courseId || !examId) {
      return res.status(400).json({
        success: false,
        message: "collegeId, courseId, and examId are required",
      });
    }

    const collegeExam = await prisma.collegeExam.create({
      data: {
        collegeId: Number(collegeId),
        courseId: Number(courseId),
        examId: Number(examId),
      },
      include: {
        college: true,
        course: true,
        exam: true,
      },
    });

    return res.status(201).json({
      success: true,
      message: "College exam mapping created successfully",
      data: collegeExam,
    });
  } catch (error) {
    console.error("Create College Exam Error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Unable to create college exam mapping",
    });
  }
};

export const updateCollegeExam = async (req, res) => {
  try {
    const { id } = req.params;
    const { collegeId, courseId, examId } = req.body;

    const collegeExam = await prisma.collegeExam.findUnique({
      where: { id: Number(id) },
    });

    if (!collegeExam) {
      return res.status(404).json({
        success: false,
        message: "College exam not found",
      });
    }

    const updateData = {};

    if (collegeId !== undefined) updateData.collegeId = Number(collegeId);
    if (courseId !== undefined) updateData.courseId = Number(courseId);
    if (examId !== undefined) updateData.examId = Number(examId);

    const updatedCollegeExam = await prisma.collegeExam.update({
      where: { id: Number(id) },
      data: updateData,
      include: {
        college: true,
        course: true,
        exam: true,
      },
    });

    return res.status(200).json({
      success: true,
      message: "College exam mapping updated successfully",
      data: updatedCollegeExam,
    });
  } catch (error) {
    console.error("Update College Exam Error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Unable to update college exam mapping",
    });
  }
};

export const deleteCollegeExam = async (req, res) => {
  try {
    const { id } = req.params;

    const collegeExam = await prisma.collegeExam.findUnique({
      where: { id: Number(id) },
    });

    if (!collegeExam) {
      return res.status(404).json({
        success: false,
        message: "College exam not found",
      });
    }

    await prisma.collegeExam.delete({
      where: { id: Number(id) },
    });

    return res.status(200).json({
      success: true,
      message: "College exam mapping deleted successfully",
    });
  } catch (error) {
    console.error("Delete College Exam Error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Unable to delete college exam mapping",
    });
  }
};
