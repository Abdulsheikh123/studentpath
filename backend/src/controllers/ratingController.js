import prisma from '../config/prisma.db.js'

export const getRatings = async (req, res) => {
  try {
    const { userId, itemType, itemId } = req.query

    const filters = {}

    if (userId) {
      filters.userId = Number(userId)
    }

    if (itemType) {
      filters.itemType = String(itemType).trim().toLowerCase()
    }

    if (itemId) {
      filters.itemId = Number(itemId)
    }

    const ratings = await prisma.rating.findMany({
      where: filters,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    return res.status(200).json({
      success: true,
      message: 'Ratings fetched successfully',
      data: ratings
    })
  } catch (error) {
    console.error('Get Ratings Error:', error)

    return res.status(500).json({
      success: false,
      message: 'Unable to fetch ratings'
    })
  }
}

export const deleteRating = async (req, res) => {
  try {
    const { id } = req.params

    const rating = await prisma.rating.findUnique({
      where: {
        id: Number(id)
      }
    })

    if (!rating) {
      return res.status(404).json({
        success: false,
        message: 'Rating not found'
      })
    }

    await prisma.rating.delete({
      where: {
        id: Number(id)
      }
    })

    return res.status(200).json({
      success: true,
      message: 'Rating deleted successfully'
    })
  } catch (error) {
    console.error('Delete Rating Error:', error)

    return res.status(500).json({
      success: false,
      message: 'Unable to delete rating'
    })
  }
}
