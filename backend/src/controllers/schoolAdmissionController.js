import prisma from '../config/prisma.db.js'

export const getSchoolAdmissions = async (req, res) => {
  try {
    const { schoolId, className, isOpen } = req.query

    const filters = {}

    if (schoolId) {
      filters.schoolId = Number(schoolId)
    }

    if (className) {
      filters.className = className
    }

    if (isOpen !== undefined) {
      filters.isOpen = isOpen === 'true'
    }

    const admissions = await prisma.schoolAdmission.findMany({
      where: filters,
      include: {
        school: {
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
      message: 'School admissions fetched successfully',
      data: admissions
    })
  } catch (error) {
    console.log(error)

    return res.status(500).json({
      success: false,
      message: 'Unable to fetch school admissions'
    })
  }
}

export const getSchoolAdmissionById = async (req, res) => {
  try {
    const { id } = req.params

    const admission = await prisma.schoolAdmission.findUnique({
      where: {
        id: Number(id)
      },
      include: {
        school: true
      }
    })

    if (!admission) {
      return res.status(404).json({
        success: false,
        message: 'School admission not found'
      })
    }

    return res.status(200).json({
      success: true,
      message: 'School admission fetched successfully',
      data: admission
    })
  } catch (error) {
    console.log(error)

    return res.status(500).json({
      success: false,
      message: 'Unable to fetch school admission'
    })
  }
}

export const createSchoolAdmission = async (req, res) => {
  try {
    const {
      admissionClass,
      examName,
      eligibility,
      ageLimit,
      formStartDate,
      formEndDate,
      examDate,
      schoolId
    } = req.body

    if (!schoolId || !admissionClass) {
      return res.status(400).json({
        success: false,
        message: 'School id and admission class are required'
      })
    }

    const school = await prisma.school.findUnique({
      where: {
        id: Number(schoolId)
      }
    })

    if (!school) {
      return res.status(404).json({
        success: false,
        message: 'School not found'
      })
    }

    const existingAdmission = await prisma.schoolAdmission.findFirst({
      where: {
        schoolId: Number(schoolId),
        admissionClass: admissionClass.trim()
      }
    })

    if (existingAdmission) {
      return res.status(409).json({
        success: false,
        message: 'Admission already exists for this class in the school'
      })
    }

    const schoolAdmission = await prisma.schoolAdmission.create({
      data: {
        admissionClass: admissionClass.trim(),
        examName: examName ? examName.trim() : null,
        eligibility: eligibility ? eligibility.trim() : null,
        ageLimit: ageLimit ? ageLimit.trim() : null,
        formStartDate: formStartDate ? new Date(formStartDate) : null,
        formEndDate: formEndDate ? new Date(formEndDate) : null,
        examDate: examDate ? new Date(examDate) : null,
        schoolId: Number(schoolId)
      },
      include: {
        school: {
          select: {
            id: true,
            name: true,
            slug: true
          }
        }
      }
    })

    return res.status(201).json({
      success: true,
      message: 'School admission created successfully',
      data: schoolAdmission
    })
  } catch (error) {
    console.log('Create School Admission Error:', error)

    return res.status(500).json({
      success: false,
      message: 'Unable to create school admission'
    })
  }
}

export const updateSchoolAdmission = async (req, res) => {
  try {
    const { id } = req.params

    const existingAdmission = await prisma.schoolAdmission.findUnique({
      where: {
        id: Number(id)
      }
    })

    if (!existingAdmission) {
      return res.status(404).json({
        success: false,
        message: 'School admission not found'
      })
    }

    const updatedAdmission = await prisma.schoolAdmission.update({
      where: {
        id: Number(id)
      },
      data: {
        ...req.body,
        schoolId: req.body.schoolId ? Number(req.body.schoolId) : undefined,
        formFee: req.body.formFee ? Number(req.body.formFee) : undefined,
        seats: req.body.seats ? Number(req.body.seats) : undefined,
        admissionStartDate: req.body.admissionStartDate ? new Date(req.body.admissionStartDate) : undefined,
        admissionEndDate: req.body.admissionEndDate ? new Date(req.body.admissionEndDate) : undefined
      }
    })

    return res.status(200).json({
      success: true,
      message: 'School admission updated successfully',
      data: updatedAdmission
    })
  } catch (error) {
    console.log(error)

    return res.status(500).json({
      success: false,
      message: 'Unable to update school admission'
    })
  }
}

export const deleteSchoolAdmission = async (req, res) => {
  try {
    const { id } = req.params

    const existingAdmission = await prisma.schoolAdmission.findUnique({
      where: {
        id: Number(id)
      }
    })

    if (!existingAdmission) {
      return res.status(404).json({
        success: false,
        message: 'School admission not found'
      })
    }

    await prisma.schoolAdmission.delete({
      where: {
        id: Number(id)
      }
    })

    return res.status(200).json({
      success: true,
      message: 'School admission deleted successfully'
    })
  } catch (error) {
    console.log(error)

    return res.status(500).json({
      success: false,
      message: 'Unable to delete school admission'
    })
  }
}