import prisma from '../config/prisma.db.js'

export const getSchoolFees = async (req, res) => {
  try {
    const { schoolId, className, academicYear } = req.query

    const filters = {}

    if (schoolId) {
      filters.schoolId = Number(schoolId)
    }

    if (className) {
      filters.className = className.trim()
    }

    if (academicYear) {
      filters.academicYear = academicYear.trim()
    }

    const schoolFees = await prisma.schoolFee.findMany({
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
      message: 'School fees fetched successfully',
      data: schoolFees
    })
  } catch (error) {
    console.error('Get School Fees Error:', error)

    return res.status(500).json({
      success: false,
      message: 'Unable to fetch school fees'
    })
  }
}

export const getSchoolFeeById = async (req, res) => {
  try {
    const { id } = req.params

    if (isNaN(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid school fee id'
      })
    }

    const schoolFee = await prisma.schoolFee.findUnique({
      where: {
        id: Number(id)
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

    if (!schoolFee) {
      return res.status(404).json({
        success: false,
        message: 'School fee not found'
      })
    }

    return res.status(200).json({
      success: true,
      message: 'School fee fetched successfully',
      data: schoolFee
    })
  } catch (error) {
    console.error('Get School Fee By Id Error:', error)

    return res.status(500).json({
      success: false,
      message: 'Unable to fetch school fee'
    })
  }
}

export const createSchoolFee = async (req, res) => {
  try {
    const {
      className,
      admissionFee,
      tuitionFee,
      annualFee,
      hostelFee,
      transportFee,
      feesType,
      schoolId
    } = req.body

    if (!className || !schoolId) {
      return res.status(400).json({
        success: false,
        message: 'Class name and school id are required'
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

    const existingSchoolFee = await prisma.schoolFee.findFirst({
      where: {
        schoolId: Number(schoolId),
        className: className.trim()
      }
    })

    if (existingSchoolFee) {
      return res.status(409).json({
        success: false,
        message: 'Fee already exists for this class in the school'
      })
    }

    const schoolFee = await prisma.schoolFee.create({
      data: {
        className: className.trim(),
        admissionFee: admissionFee ? Number(admissionFee) : null,
        tuitionFee: tuitionFee ? Number(tuitionFee) : null,
        annualFee: annualFee ? Number(annualFee) : null,
        hostelFee: hostelFee ? Number(hostelFee) : null,
        transportFee: transportFee ? Number(transportFee) : null,
        feesType: feesType ? feesType.trim() : null,
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
      message: 'School fee created successfully',
      data: schoolFee
    })
  } catch (error) {
    console.log('Create School Fee Error:', error)

    return res.status(500).json({
      success: false,
      message: 'Unable to create school fee'
    })
  }
}

export const updateSchoolFee = async (req, res) => {
  try {
    const { id } = req.params
    const { 
      tuitionFee, 
      admissionFee, 
      transportFee, 
      hostelFee, 
      examFee, 
      otherFee, 
      notes 
    } = req.body

    if (isNaN(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid school fee id'
      })
    }

    const existingSchoolFee = await prisma.schoolFee.findUnique({
      where: {
        id: Number(id)
      }
    })

    if (!existingSchoolFee) {
      return res.status(404).json({
        success: false,
        message: 'School fee not found'
      })
    }

    const totalFee =
      Number(tuitionFee || existingSchoolFee.tuitionFee) +
      Number(admissionFee || existingSchoolFee.admissionFee) +
      Number(transportFee || existingSchoolFee.transportFee) +
      Number(hostelFee || existingSchoolFee.hostelFee) +
      Number(examFee || existingSchoolFee.examFee) +
      Number(otherFee || existingSchoolFee.otherFee)

    const updatedSchoolFee = await prisma.schoolFee.update({
      where: {
        id: Number(id)
      },
      data: {
        tuitionFee: tuitionFee !== undefined ? Number(tuitionFee) : undefined,
        admissionFee: admissionFee !== undefined ? Number(admissionFee) : undefined,
        transportFee: transportFee !== undefined ? Number(transportFee) : undefined,
        hostelFee: hostelFee !== undefined ? Number(hostelFee) : undefined,
        examFee: examFee !== undefined ? Number(examFee) : undefined,
        otherFee: otherFee !== undefined ? Number(otherFee) : undefined,
        totalFee,
        notes: notes !== undefined ? (notes?.trim() || null) : undefined
      }
    })

    return res.status(200).json({
      success: true,
      message: 'School fee updated successfully',
      data: updatedSchoolFee
    })
  } catch (error) {
    console.error('Update School Fee Error:', error)

    return res.status(500).json({
      success: false,
      message: 'Unable to update school fee'
    })
  }
}

export const deleteSchoolFee = async (req, res) => {
  try {
    const { id } = req.params

    if (isNaN(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid school fee id'
      })
    }

    const existingSchoolFee = await prisma.schoolFee.findUnique({
      where: {
        id: Number(id)
      }
    })

    if (!existingSchoolFee) {
      return res.status(404).json({
        success: false,
        message: 'School fee not found'
      })
    }

    await prisma.schoolFee.delete({
      where: {
        id: Number(id)
      }
    })

    return res.status(200).json({
      success: true,
      message: 'School fee deleted successfully'
    })
  } catch (error) {
    console.error('Delete School Fee Error:', error)

    return res.status(500).json({
      success: false,
      message: 'Unable to delete school fee'
    })
  }
}
