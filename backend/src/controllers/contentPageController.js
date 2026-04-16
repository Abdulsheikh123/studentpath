import prisma from '../config/prisma.db.js'

export const getContentPages = async (req, res) => {
  try {
    const pages = await prisma.contentPage.findMany({
      orderBy: {
        createdAt: 'desc'
      }
    })

    return res.status(200).json({
      success: true,
      message: 'Content pages fetched successfully',
      data: pages
    })
  } catch (error) {
    console.log(error)

    return res.status(500).json({
      success: false,
      message: 'Unable to fetch content pages'
    })
  }
}

export const getContentPageById = async (req, res) => {
  try {
    const { id } = req.params

    const page = await prisma.contentPage.findUnique({
      where: {
        id: Number(id)
      }
    })

    if (!page) {
      return res.status(404).json({
        success: false,
        message: 'Content page not found'
      })
    }

    return res.status(200).json({
      success: true,
      message: 'Content page fetched successfully',
      data: page
    })
  } catch (error) {
    console.log(error)

    return res.status(500).json({
      success: false,
      message: 'Unable to fetch content page'
    })
  }
}

export const getContentPageBySlug = async (req, res) => {
  try {
    const { slug } = req.params

    const page = await prisma.contentPage.findUnique({
      where: {
        slug
      }
    })

    if (!page) {
      return res.status(404).json({
        success: false,
        message: 'Content page not found'
      })
    }

    return res.status(200).json({
      success: true,
      message: 'Content page fetched successfully',
      data: page
    })
  } catch (error) {
    console.log(error)

    return res.status(500).json({
      success: false,
      message: 'Unable to fetch content page'
    })
  }
}

export const createContentPage = async (req, res) => {
  try {
    const {
      title,
      slug,
      content,
      metaTitle,
      metaDescription,
      isPublished
    } = req.body

    if (!title || !slug || !content) {
      return res.status(400).json({
        success: false,
        message: 'Title, slug and content are required'
      })
    }

    const existingPage = await prisma.contentPage.findFirst({
      where: {
        OR: [
          { title: title.trim() },
          { slug: slug.trim() }
        ]
      }
    })

    if (existingPage) {
      return res.status(409).json({
        success: false,
        message: 'Content page with same title or slug already exists'
      })
    }

    const page = await prisma.contentPage.create({
      data: {
        title: title.trim(),
        slug: slug.trim(),
        content,
        metaTitle,
        metaDescription,
        isPublished: isPublished ?? false
      }
    })

    return res.status(201).json({
      success: true,
      message: 'Content page created successfully',
      data: page
    })
  } catch (error) {
    console.log(error)

    return res.status(500).json({
      success: false,
      message: 'Unable to create content page'
    })
  }
}

export const updateContentPage = async (req, res) => {
  try {
    const { id } = req.params

    const page = await prisma.contentPage.findUnique({
      where: {
        id: Number(id)
      }
    })

    if (!page) {
      return res.status(404).json({
        success: false,
        message: 'Content page not found'
      })
    }

    const updatedPage = await prisma.contentPage.update({
      where: {
        id: Number(id)
      },
      data: req.body
    })

    return res.status(200).json({
      success: true,
      message: 'Content page updated successfully',
      data: updatedPage
    })
  } catch (error) {
    console.log(error)

    return res.status(500).json({
      success: false,
      message: 'Unable to update content page'
    })
  }
}

export const deleteContentPage = async (req, res) => {
  try {
    const { id } = req.params

    const page = await prisma.contentPage.findUnique({
      where: {
        id: Number(id)
      }
    })

    if (!page) {
      return res.status(404).json({
        success: false,
        message: 'Content page not found'
      })
    }

    await prisma.contentPage.delete({
      where: {
        id: Number(id)
      }
    })

    return res.status(200).json({
      success: true,
      message: 'Content page deleted successfully'
    })
  } catch (error) {
    console.log(error)

    return res.status(500).json({
      success: false,
      message: 'Unable to delete content page'
    })
  }
}
