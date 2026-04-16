import prisma from '../config/prisma.db.js'

export const getAdmissionGuides = async (req, res) => {
  try {
    const guides = await prisma.admissionGuide.findMany({
      orderBy: {
        createdAt: 'desc'
      }
    })

    return res.status(200).json({
      success: true,
      message: 'Admission guides fetched successfully',
      data: guides
    })
  } catch (error) {
    console.log(error)

    return res.status(500).json({
      success: false,
      message: 'Unable to fetch admission guides'
    })
  }
}

export const getAdmissionGuideById = async (req, res) => {
  try {
    const { id } = req.params

    const guide = await prisma.admissionGuide.findUnique({
      where: {
        id: Number(id)
      }
    })

    if (!guide) {
      return res.status(404).json({
        success: false,
        message: 'Admission guide not found'
      })
    }

    return res.status(200).json({
      success: true,
      message: 'Admission guide fetched successfully',
      data: guide
    })
  } catch (error) {
    console.log(error)

    return res.status(500).json({
      success: false,
      message: 'Unable to fetch admission guide'
    })
  }
}

export const createAdmissionGuide = async (req, res) => {
  try {
    const {
      title,
      slug,
      content,
      metaTitle,
      metaDescription
    } = req.body

    if (!title || !slug || !content) {
      return res.status(400).json({
        success: false,
        message: 'Title, slug and content are required'
      })
    }

    const existingGuide = await prisma.admissionGuide.findFirst({
      where: {
        OR: [
          { title: title.trim() },
          { slug: slug.trim() }
        ]
      }
    })

    if (existingGuide) {
      return res.status(409).json({
        success: false,
        message: 'Admission guide with same title or slug already exists'
      })
    }
     const guide = await prisma.admissionGuide.create({
      data: {
        title: title.trim(),
        slug: slug.trim(),
        content,
        metaTitle,
        metaDescription
      }
    })

    return res.status(201).json({
      success: true,
      message: 'Admission guide created successfully',
      data: guide
    })
  } catch (error) {
    console.log(error)

    return res.status(500).json({
      success: false,
      message: 'Unable to create admission guide'
    })
  }
}


export const updateAdmissionGuide = async (req, res) => {
  try {
    const { id } = req.params

    const guide = await prisma.admissionGuide.findUnique({
      where: {
        id: Number(id)
      }
    })

    if (!guide) {
      return res.status(404).json({
        success: false,
        message: 'Admission guide not found'
      })
    }

    const updatedGuide = await prisma.admissionGuide.update({
      where: {
        id: Number(id)
      },
      data: req.body
    })

    return res.status(200).json({
      success: true,
      message: 'Admission guide updated successfully',
      data: updatedGuide
    })
  } catch (error) {
    console.log(error)

    return res.status(500).json({
      success: false,
      message: 'Unable to update admission guide'
    })
  }
}

export const deleteAdmissionGuide = async (req, res) => {
  try {
    const { id } = req.params

    const guide = await prisma.admissionGuide.findUnique({
      where: {
        id: Number(id)
      }
    })

    if (!guide) {
      return res.status(404).json({
        success: false,
        message: 'Admission guide not found'
      })
    }

    await prisma.admissionGuide.delete({
      where: {
        id: Number(id)
      }
    })

    return res.status(200).json({
      success: true,
      message: 'Admission guide deleted successfully'
    })
  } catch (error) {
    console.log(error)

    return res.status(500).json({
      success: false,
      message: 'Unable to delete admission guide'
    })
  }
}
