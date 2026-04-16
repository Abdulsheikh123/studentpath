import prisma from '../config/prisma.db.js'

export const getExamEligibilities = async (req, res) => {
  try {
    const { examId, category, minPercentage, nationality } = req.query

    const filters = {}

    if (examId) {
      filters.examId = Number(examId)
    }

    if (category) {
      filters.category = category.trim()
    }

    if (nationality) {
      filters.nationality = nationality.trim()
    }

    if (minPercentage) {
      filters.minimumPercentage = {
        gte: Number(minPercentage)
      }
    }

    const eligibilities = await prisma.examEligibility.findMany({
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
      orderBy: {
        createdAt: 'desc'
      }
    })

    return res.status(200).json({
      success: true,
      message: 'Exam eligibility rules fetched successfully',
      data: eligibilities
    })
  } catch (error) {
    console.error('Get Exam Eligibility Error:', error)

    return res.status(500).json({
      success: false,
      message: 'Unable to fetch exam eligibility rules'
    })
  }
}

export const getExamEligibilityById = async (req, res) => {
  try {
    const { id } = req.params

    if (isNaN(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid exam eligibility id'
      })
    }

    const eligibility = await prisma.examEligibility.findUnique({
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

    if (!eligibility) {
      return res.status(404).json({
        success: false,
        message: 'Exam eligibility rule not found'
      })
    }

    return res.status(200).json({
      success: true,
      message: 'Exam eligibility fetched successfully',
      data: eligibility
    })
  } catch (error) {
    console.error('Get Exam Eligibility By Id Error:', error)

    return res.status(500).json({
      success: false,
      message: 'Unable to fetch exam eligibility rule'
    })
  }
}

export const createExamEligibility = async (req, res) => {
  try {
       const {
      examId,
      qualification,
      minimumMarks,
      ageLimit,
      stream
    } = req.body

    if (!examId || !qualification) {
      return res.status(400).json({
        success: false,
        message: 'Exam id and qualification are required'
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

    const existingEligibility = await prisma.examEligibility.findFirst({
      where: {
        examId: Number(examId),
        qualification: qualification.trim()
      }
    })
      if (existingEligibility) {
      return res.status(409).json({
        success: false,
        message: 'Eligibility rule already exists for this exam and qualification'
      })
    }

         const eligibility = await prisma.examEligibility.create({
      data: {
        qualification,
        minimumMarks,
        ageLimit,
        stream,
        exam: {
          connect: {
            id: Number(examId)
          }
        }
      }
    })

    return res.status(201).json({
      success: true,
      message: 'Exam eligibility created successfully',
      data: eligibility
    })
  } catch (error) {
    console.error('Create Exam Eligibility Error:', error)

    return res.status(500).json({
      success: false,
      message: 'Unable to create exam eligibility'
    })
  }
}

export const updateExamEligibility = async (req, res) => {
  try {
    const { id } = req.params

    if (isNaN(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid exam eligibility id'
      })
    }

    const existingEligibility = await prisma.examEligibility.findUnique({
      where: {
        id: Number(id)
      }
    })

    if (!existingEligibility) {
      return res.status(404).json({
        success: false,
        message: 'Exam eligibility not found'
      })
    }

    const updatedEligibility = await prisma.examEligibility.update({
      where: {
        id: Number(id)
      },
      data: {
        category:
          req.body.category !== undefined
            ? req.body.category?.trim() || null
            : undefined,
        qualification: req.body.qualification
          ? req.body.qualification.trim()
          : undefined,
        minimumPercentage:
          req.body.minimumPercentage !== undefined
            ? Number(req.body.minimumPercentage)
            : undefined,
        nationality:
          req.body.nationality !== undefined
            ? req.body.nationality?.trim() || null
            : undefined,
        ageLimit:
          req.body.ageLimit !== undefined
            ? req.body.ageLimit?.trim() || null
            : undefined,
        attemptsAllowed:
          req.body.attemptsAllowed !== undefined
            ? Number(req.body.attemptsAllowed)
            : undefined,
        notes:
          req.body.notes !== undefined
            ? req.body.notes?.trim() || null
            : undefined
      }
    })

    return res.status(200).json({
      success: true,
      message: 'Exam eligibility updated successfully',
      data: updatedEligibility
    })
  } catch (error) {
    console.error('Update Exam Eligibility Error:', error)

    return res.status(500).json({
      success: false,
      message: 'Unable to update exam eligibility'
    })
  }
}

export const deleteExamEligibility = async (req, res) => {
  try {
    const { id } = req.params

    if (isNaN(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid exam eligibility id'
      })
    }

    const eligibility = await prisma.examEligibility.findUnique({
      where: {
        id: Number(id)
      }
    })

    if (!eligibility) {
      return res.status(404).json({
        success: false,
        message: 'Exam eligibility not found'
      })
    }

    await prisma.examEligibility.delete({
      where: {
        id: Number(id)
      }
    })

    return res.status(200).json({
      success: true,
      message: 'Exam eligibility deleted successfully'
    })
  } catch (error) {
    console.error('Delete Exam Eligibility Error:', error)

    return res.status(500).json({
      success: false,
      message: 'Unable to delete exam eligibility'
    })
  }
}
