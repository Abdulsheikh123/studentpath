import prisma from '../config/prisma.db.js'

export const getExamFees = async (req, res) => {
  try {
    const { examId, category, year } = req.query

    const where = {}

    if (examId) {
      where.examId = Number(examId)
    }

    if (category) {
      where.category = category.trim()
    }

    if (year) {
      where.year = Number(year)
    }

    const examFees = await prisma.examFee.findMany({
      where,
      include: {
        exam: {
          select: {
            id: true,
            name: true,
            slug: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    return res.status(200).json({
      success: true,
      message: 'Exam fees fetched successfully',
      data: examFees
    })
  } catch (error) {
    console.error('Get Exam Fees Error:', error)

    return res.status(500).json({
      success: false,
      message: 'Unable to fetch exam fees'
    })
  }
}

export const getExamFeeById = async (req, res) => {
  try {
    const { id } = req.params

    if (isNaN(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid exam fee id'
      })
    }

    const examFee = await prisma.examFee.findUnique({
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

    if (!examFee) {
      return res.status(404).json({
        success: false,
        message: 'Exam fee not found'
      })
    }

    return res.status(200).json({
      success: true,
      message: 'Exam fee fetched successfully',
      data: examFee
    })
  } catch (error) {
    console.error('Get Exam Fee By Id Error:', error)

    return res.status(500).json({
      success: false,
      message: 'Unable to fetch exam fee'
    })
  }
}

export const createExamFee = async (req, res) => {
  try {
    const {
      examId,
      categoryName,
      year,
      applicationFee,
      lateFee,
      correctionFee,
      notes
    } = req.body

    if (!examId || !categoryName || !year || applicationFee === undefined) {
      return res.status(400).json({
        success: false,
        message: 'Exam id, categoryName, year and application fee are required'
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

    const existingExamFee = await prisma.examFee.findFirst({
      where: {
        examId: Number(examId),
        categoryName: categoryName.trim(),
        year: Number(year)
      }
    })

    if (existingExamFee) {
      return res.status(409).json({
        success: false,
        message: 'Exam fee already exists for this category and year'
      })
    } const examFee = await prisma.examFee.create({
      data: {
        examId: Number(examId),
        categoryName: categoryName.trim(),
        year: Number(year),
        applicationFee: Number(applicationFee),
        lateFee: Number(lateFee || 0),
        correctionFee: Number(correctionFee || 0),
        totalFee:
          Number(applicationFee) +
          Number(lateFee || 0) +
          Number(correctionFee || 0),
        notes: notes?.trim() || null
      }
    })

    return res.status(201).json({
      success: true,
      message: 'Exam fee created successfully',
      data: examFee
    })
  } catch (error) {
    console.error('Create Exam Fee Error:', error)

    return res.status(500).json({
      success: false,
      message: 'Unable to create exam fee'
    })
  }
}

export const updateExamFee = async (req, res) => {
  try {
    const { id } = req.params
    const { 
      applicationFee, 
      lateFee, 
      correctionFee, 
      notes 
    } = req.body

    if (isNaN(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid exam fee id'
      })
    }

    const existingExamFee = await prisma.examFee.findUnique({
      where: {
        id: Number(id)
      }
    })

    if (!existingExamFee) {
      return res.status(404).json({
        success: false,
        message: 'Exam fee not found'
      })
    }

    const totalFee =
      Number(applicationFee || existingExamFee.applicationFee) +
      Number(lateFee || existingExamFee.lateFee) +
      Number(correctionFee || existingExamFee.correctionFee)

    const updatedExamFee = await prisma.examFee.update({
      where: {
        id: Number(id)
      },
      data: {
        applicationFee: applicationFee !== undefined ? Number(applicationFee) : undefined,
        lateFee: lateFee !== undefined ? Number(lateFee) : undefined,
        correctionFee: correctionFee !== undefined ? Number(correctionFee) : undefined,
        totalFee,
        notes: notes !== undefined ? (notes?.trim() || null) : undefined
      }
    })

    return res.status(200).json({
      success: true,
      message: 'Exam fee updated successfully',
      data: updatedExamFee
    })
  } catch (error) {
    console.error('Update Exam Fee Error:', error)

    return res.status(500).json({
      success: false,
      message: 'Unable to update exam fee'
    })
  }
}

export const deleteExamFee = async (req, res) => {
  try {
    const { id } = req.params

    if (isNaN(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid exam fee id'
      })
    }

    const existingExamFee = await prisma.examFee.findUnique({
      where: {
        id: Number(id)
      }
    })

    if (!existingExamFee) {
      return res.status(404).json({
        success: false,
        message: 'Exam fee not found'
      })
    }

    await prisma.examFee.delete({
      where: {
        id: Number(id)
      }
    })

    return res.status(200).json({
      success: true,
      message: 'Exam fee deleted successfully'
    })
  } catch (error) {
    console.error('Delete Exam Fee Error:', error)

    return res.status(500).json({
      success: false,
      message: 'Unable to delete exam fee'
    })
  }
}
