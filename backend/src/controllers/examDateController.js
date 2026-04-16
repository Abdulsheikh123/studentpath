import prisma from '../config/prisma.db.js'

function parseDateOrUndefined(value) {
  if (value === undefined) return undefined
  if (value === null || value === '') return null
  return new Date(value)
}

export const getExamDates = async (req, res) => {
  try {
    const { examId, session } = req.query

    const filters = {}

    if (examId) {
      filters.examId = Number(examId)
    }

    if (session) {
      filters.session = String(session).trim()
    }

    const examDates = await prisma.examDate.findMany({
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
        formStartDate: 'desc'
      }
    })

    return res.status(200).json({
      success: true,
      message: 'Exam dates fetched successfully',
      data: examDates
    })
  } catch (error) {
    console.error('Get Exam Dates Error:', error)

    return res.status(500).json({
      success: false,
      message: 'Unable to fetch exam dates'
    })
  }
}

export const getExamDateById = async (req, res) => {
  try {
    const { id } = req.params

    if (isNaN(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid exam date id'
      })
    }

    const examDate = await prisma.examDate.findUnique({
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

    if (!examDate) {
      return res.status(404).json({
        success: false,
        message: 'Exam date not found'
      })
    }

    return res.status(200).json({
      success: true,
      message: 'Exam date fetched successfully',
      data: examDate
    })
  } catch (error) {
    console.error('Get Exam Date By Id Error:', error)

    return res.status(500).json({
      success: false,
      message: 'Unable to fetch exam date'
    })
  }
}

export const createExamDate = async (req, res) => {
  try { 
    const {
      examId,
      session,
      formStartDate,
      formEndDate,
      correctionDate,
      admitCardDate,
      examDate,
      resultDate
    } = req.body

    if (!examId || !session || !formStartDate || !formEndDate || !examDate) {
      return res.status(400).json({
        success: false,
        message: 'Exam id, year, application dates and exam date are required'
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
    const existingExamDate = await prisma.examDate.findFirst({
      where: {
        examId: Number(examId),
        session: session?.trim() || null,
      }
    })

    if (existingExamDate) {
      return res.status(409).json({
        success: false,
        message: 'Exam dates already exist for this year'
      })
    }

    const createdExamDate = await prisma.examDate.create({
      data: {
        examId: Number(examId),
        session: session?.trim() || null,
        formStartDate: formStartDate ? new Date(formStartDate) : null,
        formEndDate: formEndDate ? new Date(formEndDate) : null,
        correctionDate: correctionDate ? new Date(correctionDate) : null,
        admitCardDate: admitCardDate ? new Date(admitCardDate) : null,
        examDate: examDate ? new Date(examDate) : null,
        resultDate: resultDate ? new Date(resultDate) : null
      }
    })

    return res.status(201).json({
      success: true,
      message: 'Exam date created successfully',
      data: createdExamDate
    })
  } catch (error) {
    console.error('Create Exam Date Error:', error)

    return res.status(500).json({
      success: false,
      message: 'Unable to create exam date'
    })
  }
}

export const updateExamDate = async (req, res) => {
  try {
    const { id } = req.params
    const {
      session,
      formStartDate,
      formEndDate,
      correctionDate,
      admitCardDate,
      examDate,
      resultDate
    } = req.body

    if (isNaN(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid exam date id'
      })
    }

    const existingExamDate = await prisma.examDate.findUnique({
      where: {
        id: Number(id)
      }
    })

    if (!existingExamDate) {
      return res.status(404).json({
        success: false,
        message: 'Exam date not found'
      })
    }

    const updatedExamDate = await prisma.examDate.update({
      where: {
        id: Number(id)
      },
      data: {
        session: session !== undefined ? String(session).trim() || null : undefined,
        formStartDate: parseDateOrUndefined(formStartDate),
        formEndDate: parseDateOrUndefined(formEndDate),
        correctionDate: parseDateOrUndefined(correctionDate),
        admitCardDate: parseDateOrUndefined(admitCardDate),
        examDate: parseDateOrUndefined(examDate),
        resultDate: parseDateOrUndefined(resultDate)
      }
    })

    return res.status(200).json({
      success: true,
      message: 'Exam date updated successfully',
      data: updatedExamDate
    })
  } catch (error) {
    console.error('Update Exam Date Error:', error)

    return res.status(500).json({
      success: false,
      message: 'Unable to update exam date'
    })
  }
}

export const deleteExamDate = async (req, res) => {
  try {
    const { id } = req.params

    if (isNaN(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid exam date id'
      })
    }

    const existingExamDate = await prisma.examDate.findUnique({
      where: {
        id: Number(id)
      }
    })

    if (!existingExamDate) {
      return res.status(404).json({
        success: false,
        message: 'Exam date not found'
      })
    }

    await prisma.examDate.delete({
      where: {
        id: Number(id)
      }
    })

    return res.status(200).json({
      success: true,
      message: 'Exam date deleted successfully'
    })
  } catch (error) {
    console.error('Delete Exam Date Error:', error)

    return res.status(500).json({
      success: false,
      message: 'Unable to delete exam date'
    })
  }
}
