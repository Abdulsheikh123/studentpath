import prisma from '../config/prisma.db.js'

export const getSchools = async (req, res) => {
  try {
    const schools = await prisma.school.findMany({
      include: {
        admissions: true,
        fees: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    return res.status(200).json({
      success: true,
      message: 'Schools fetched successfully',
      data: schools
    })
  } catch (error) {
    console.log('Get Schools Error:', error)

    return res.status(500).json({
      success: false,
      message: 'Unable to fetch schools'
    })
  }
}

export const getSchoolById = async (req, res) => {
  try {
    const { id } = req.params

    const school = await prisma.school.findUnique({
      where: {
        id: Number(id)
      },
      include: {
        admissions: true,
        fees: true
      }
    })

    if (!school) {
      return res.status(404).json({
        success: false,
        message: 'School not found'
      })
    }

    return res.status(200).json({
      success: true,
      message: 'School fetched successfully',
      data: school
    })
  } catch (error) {
    console.log(error)

    return res.status(500).json({
      success: false,
      message: 'Unable to fetch school details'
    })
  }
}

export const createSchool = async (req, res) => {
  try {
    const {
      name,
      slug,
      image,
      board,
      type,
      classesFrom,
      classesTo,
      address,
      website,
      description
    } = req.body

    if (!name || !slug) {
      return res.status(400).json({
        success: false,
        message: 'Name and slug are required'
      })
    }

    const existingSchool = await prisma.school.findFirst({
      where: {
        OR: [
          {
            name: name.trim()
          },
          {
            slug: slug.trim().toLowerCase()
          }
        ]
      }
    })

    if (existingSchool) {
      return res.status(409).json({
        success: false,
        message: 'School with this name or slug already exists'
      })
    }

    const school = await prisma.school.create({
      data: {
        name: name.trim(),
        slug: slug.trim().toLowerCase(),
        image: image ? image.trim() : null,
        board: board ? board.trim() : null,
        type: type ? type.trim() : null,
        classesFrom: classesFrom ? Number(classesFrom) : null,
        classesTo: classesTo ? Number(classesTo) : null,
        address: address ? address.trim() : null,
        website: website ? website.trim() : null,
        description: description ? description.trim() : null
      }
    })

    return res.status(201).json({
      success: true,
      message: 'School created successfully',
      data: school
    })
  } catch (error) {
    console.error('Create School Error:', error)

    return res.status(500).json({
      success: false,
      message: 'Unable to create school'
    })
  }
}

export const updateSchool = async (req, res) => {
  try {
    const { id } = req.params

    const school = await prisma.school.findUnique({
      where: {
        id: Number(id)
      }
    })

    if (!school) {
      return res.status(404).json({
        success: false,
        message: 'School not found'
      })
    }

    const {
      name,
      slug,
      image,
      board,
      type,
      classesFrom,
      classesTo,
      address,
      website,
      description
    } = req.body

    const updatedSchool = await prisma.school.update({
      where: {
        id: Number(id)
      },
      data: {
        name: name !== undefined ? String(name).trim() : undefined,
        slug: slug !== undefined ? String(slug).trim().toLowerCase() : undefined,
        image: image !== undefined ? (String(image).trim() || null) : undefined,
        board: board !== undefined ? (String(board).trim() || null) : undefined,
        type: type !== undefined ? (String(type).trim() || null) : undefined,
        classesFrom:
          classesFrom !== undefined
            ? (classesFrom === '' || classesFrom === null ? null : Number(classesFrom))
            : undefined,
        classesTo:
          classesTo !== undefined
            ? (classesTo === '' || classesTo === null ? null : Number(classesTo))
            : undefined,
        address: address !== undefined ? (String(address).trim() || null) : undefined,
        website: website !== undefined ? (String(website).trim() || null) : undefined,
        description: description !== undefined ? (String(description).trim() || null) : undefined
      }
    })

    return res.status(200).json({
      success: true,
      message: 'School updated successfully',
      data: updatedSchool
    })
  } catch (error) {
    console.log(error)

    return res.status(500).json({
      success: false,
      message: 'Unable to update school'
    })
  }
}

export const deleteSchool = async (req, res) => {
  try {
    const { id } = req.params

    const school = await prisma.school.findUnique({
      where: {
        id: Number(id)
      }
    })

    if (!school) {
      return res.status(404).json({
        success: false,
        message: 'School not found'
      })
    }

    await prisma.school.delete({
      where: {
        id: Number(id)
      }
    })

    return res.status(200).json({
      success: true,
      message: 'School deleted successfully'
    })
  } catch (error) {
    console.log(error)

    return res.status(500).json({
      success: false,
      message: 'Unable to delete school'
    })
  }
}
