import prisma from '../config/prisma.db.js'

export const getCourses = async (req, res) => {
  try {
    const { categoryId, level, search } = req.query

    const filters = {}

    if (categoryId) {
      filters.categoryId = Number(categoryId)
    }

    if (level) {
      filters.level = level
    }

    if (search) {
      filters.OR = [
        {
          name: {
            contains: search,
            mode: 'insensitive'
          }
        },
        {
          shortName: {
            contains: search,
            mode: 'insensitive'
          }
        },
        {
          slug: {
            contains: search,
            mode: 'insensitive'
          }
        }
      ]
    }

    const courses = await prisma.course.findMany({
      where: filters,
      include: {
        category: {
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
      message: 'Courses fetched successfully',
      data: courses
    })
  } catch (error) {
    console.log(error)

    return res.status(500).json({
      success: false,
      message: 'Unable to fetch courses'
    })
  }
}
export const getCourseById = async (req, res) => {
  try {
    const { id } = req.params

    const course = await prisma.course.findUnique({
      where: {
        id: Number(id)
      },
      include: {
        category: {
          select: {
            id: true,
            name: true,
            slug: true
          }
        }
      }
    })

    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found'
      })
    }

    return res.status(200).json({
      success: true,
      message: 'Course fetched successfully',
      data: course
    })
  } catch (error) {
    console.log(error)

    return res.status(500).json({
      success: false,
      message: 'Unable to fetch course'
    })
  }
}

export const createCourse = async (req, res) => {
  try {
    const {
      name,
      slug,
      shortName,
      duration,
      level,
      description,
      categoryId
    } = req.body

    if (!name || !slug || !categoryId) {
      return res.status(400).json({
        success: false,
        message: 'Name, slug and category id are required'
      })
    }

    const existingCourse = await prisma.course.findFirst({
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

    if (existingCourse) {
      return res.status(409).json({
        success: false,
        message: 'Course with this name or slug already exists'
      })
    }

    const category = await prisma.category.findUnique({
      where: {
        id: Number(categoryId)
      }
    })

    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Category not found'
      })
    }

    const course = await prisma.course.create({
      data: {
        name: name.trim(),
        slug: slug.trim().toLowerCase(),
        shortName: shortName ? shortName.trim() : null,
        duration: duration ? duration.trim() : null,
        level: level ? level.trim() : null,
        description: description ? description.trim() : null,
        categoryId: Number(categoryId)
      },
      include: {
        category: {
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
      message: 'Course created successfully',
      data: course
    })
  } catch (error) {
    console.log('Create Course Error:', error)

    return res.status(500).json({
      success: false,
      message: 'Unable to create course'
    })
  }
}
export const updateCourse = async (req, res) => {
  try {
    const { id } = req.params
    const {
      name,
      slug,
      shortName,
      duration,
      level,
      description,
      categoryId
    } = req.body

    const existingCourse = await prisma.course.findUnique({
      where: {
        id: Number(id)
      }
    })

    if (!existingCourse) {
      return res.status(404).json({
        success: false,
        message: 'Course not found'
      })
    }

    if (slug && slug !== existingCourse.slug) {
      const slugExists = await prisma.course.findFirst({
        where: {
          slug: slug.trim(),
          id: { not: Number(id) }
        }
      })

      if (slugExists) {
        return res.status(409).json({
          success: false,
          message: 'Slug already exists'
        })
      }
    }

    if (name && name !== existingCourse.name) {
      const nameExists = await prisma.course.findFirst({
        where: {
          name: name.trim(),
          id: { not: Number(id) }
        }
      })

      if (nameExists) {
        return res.status(409).json({
          success: false,
          message: 'Course name already exists'
        })
      }
    }

    if (categoryId) {
      const category = await prisma.category.findUnique({
        where: {
          id: Number(categoryId)
        }
      })

      if (!category) {
        return res.status(404).json({
          success: false,
          message: 'Category not found'
        })
      }
    }

    const updatedCourse = await prisma.course.update({
      where: {
        id: Number(id)
      },
      data: {
        name: name ? name.trim() : existingCourse.name,
        slug: slug ? slug.trim().toLowerCase() : existingCourse.slug,
        shortName:
          shortName !== undefined
            ? shortName?.trim() || null
            : existingCourse.shortName,
        description:
          description !== undefined
            ? description?.trim() || null
            : existingCourse.description,
        duration:
          duration !== undefined ? duration?.trim() || null : existingCourse.duration,
        level: level !== undefined ? level?.trim() || null : existingCourse.level,
        categoryId: categoryId ? Number(categoryId) : existingCourse.categoryId
      },
      include: {
        category: {
          select: {
            id: true,
            name: true,
            slug: true
          }
        }
      }
    })

    return res.status(200).json({
      success: true,
      message: 'Course updated successfully',
      data: updatedCourse
    })
  } catch (error) {
    console.log(error)

    return res.status(500).json({
      success: false,
      message: 'Unable to update course'
    })
  }
}
export const deleteCourse = async (req, res) => {
  try {
    const { id } = req.params

    const course = await prisma.course.findUnique({
      where: {
        id: Number(id)
      }
    })

    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found'
      })
    }

    await prisma.course.delete({
      where: {
        id: Number(id)
      }
    })

    return res.status(200).json({
      success: true,
      message: 'Course deleted successfully'
    })
  } catch (error) {
    console.log(error)

    return res.status(500).json({
      success: false,
      message: 'Unable to delete course'
    })
  }
}
