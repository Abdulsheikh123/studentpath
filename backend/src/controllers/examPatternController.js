import prisma from '../config/prisma.db.js'

export const getExamPatterns = async (req, res) => {
  try {
    const { examId, year, mode, isActive } = req.query

    const filters = {}

    if (examId) {
      filters.examId = Number(examId)
    }

    if (year) {
      filters.year = Number(year)
    }

    if (mode) {
      filters.mode = mode.trim()
    }

    if (isActive !== undefined) {
      filters.isActive = isActive === 'true'
    }

    const examPatterns = await prisma.examPattern.findMany({
      where: filters,
      include: {
        exam: {
          select: {
            id: true,
            name: true,
            slug: true
          }
        }
      },
      orderBy: [
        {
          year: 'desc'
        },
        {
          createdAt: 'desc'
        }
      ]
    })

    return res.status(200).json({
      success: true,
      message: 'Exam patterns fetched successfully',
      data: examPatterns
    })
  } catch (error) {
    console.error('Get Exam Patterns Error:', error)

    return res.status(500).json({
      success: false,
      message: 'Unable to fetch exam patterns'
    })
  }
}

export const getExamPatternById = async (req, res) => {
  try {
    const { id } = req.params

    if (isNaN(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid exam pattern id'
      })
    }

    const examPattern = await prisma.examPattern.findUnique({
      where: {
        id: Number(id)
      },
      include: {
        exam: {
          select: {
            id: true,
            name: true,
            slug: true
          }
        }
      }
    })

    if (!examPattern) {
      return res.status(404).json({
        success: false,
        message: 'Exam pattern not found'
      })
    }

    return res.status(200).json({
      success: true,
      message: 'Exam pattern fetched successfully',
      data: examPattern
    })
  } catch (error) {
    console.error('Get Exam Pattern By Id Error:', error)

    return res.status(500).json({
      success: false,
      message: 'Unable to fetch exam pattern'
    })
  }
}

export const createExamPattern = async (req, res) => {
  try {
    const {
      examId,
      year,
      mode,
      duration,
      totalQuestions,
      totalMarks,
      negativeMarking,
      sections,
      language,
      isActive
    } = req.body

    if (!examId || !year || !duration || !totalQuestions || !totalMarks) {
      return res.status(400).json({
        success: false,
        message: 'Exam id, year, duration, total questions and total marks are required'
      })
    }

    const exam = await prisma.exam.findUnique({
      where: {
        id: Number(examId)
      }
    })

    if (!exam) {
      return res.status(404).json({
        success: false,
        message: 'Exam not found'
      })
    }
     const existingPattern = await prisma.examPattern.findFirst({
      where: {
        examId: Number(examId),
        year: Number(year)
      }
    })

    if (existingPattern) {
      return res.status(409).json({
        success: false,
        message: 'Exam pattern already exists for this year'
      })
    }

    const examPattern = await prisma.examPattern.create({
      data: {
        examId: Number(examId),
        year: Number(year),
        mode: mode?.trim() || null,
        duration: duration.trim(),
        totalQuestions: Number(totalQuestions),
        totalMarks: Number(totalMarks),
        negativeMarking: Boolean(negativeMarking),
        sections: sections || null,
        language: language?.trim() || null,
        isActive: isActive ?? true
      }
    })

    return res.status(201).json({
      success: true,
      message: 'Exam pattern created successfully',
      data: examPattern
    })
  } catch (error) {
    console.error('Create Exam Pattern Error:', error)

    return res.status(500).json({
      success: false,
      message: 'Unable to create exam pattern'
    })
  }
}

export const updateExamPattern = async (req, res) => {
  try {
    const { id } = req.params

    if (isNaN(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid exam pattern id'
      })
    }

    const existingPattern = await prisma.examPattern.findUnique({
      where: {
        id: Number(id)
      }
    })

    if (!existingPattern) {
      return res.status(404).json({
        success: false,
        message: 'Exam pattern not found'
      })
    }

    const { examId, year, mode, duration, totalQuestions, totalMarks, negativeMarking, sections, language, isActive } = req.body

    const updatedPattern = await prisma.examPattern.update({
      where: {
        id: Number(id)
      },
      data: {
        examId: examId !== undefined ? Number(examId) : undefined,
        year: year !== undefined ? Number(year) : undefined,
        mode: mode !== undefined ? mode.trim() : undefined,
        duration: duration !== undefined ? duration.trim() : undefined,
        totalQuestions: totalQuestions !== undefined ? Number(totalQuestions) : undefined,
        totalMarks: totalMarks !== undefined ? Number(totalMarks) : undefined,
        negativeMarking: negativeMarking !== undefined ? negativeMarking.trim() : undefined,
        sections: sections !== undefined ? sections : undefined,
        language: language !== undefined ? language.trim() : undefined,
        isActive: isActive !== undefined ? Boolean(isActive) : undefined
      }
    })

    return res.status(200).json({
      success: true,
      message: 'Exam pattern updated successfully',
      data: updatedPattern
    })
  } catch (error) {
    console.error('Update Exam Pattern Error:', error)

    return res.status(500).json({
      success: false,
      message: 'Unable to update exam pattern'
    })
  }
}

export const deleteExamPattern = async (req, res) => {
  try {
    const { id } = req.params

    if (isNaN(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid exam pattern id'
      })
    }

    const examPattern = await prisma.examPattern.findUnique({
      where: {
        id: Number(id)
      }
    })

    if (!examPattern) {
      return res.status(404).json({
        success: false,
        message: 'Exam pattern not found'
      })
    }

    await prisma.examPattern.delete({
      where: {
        id: Number(id)
      }
    })

    return res.status(200).json({
      success: true,
      message: 'Exam pattern deleted successfully'
    })
  } catch (error) {
    console.error('Delete Exam Pattern Error:', error)

    return res.status(500).json({
      success: false,
      message: 'Unable to delete exam pattern'
    })
  }
}   