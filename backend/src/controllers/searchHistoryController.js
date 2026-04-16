import prisma from '../config/prisma.db.js'

export const getSearchHistory = async (req, res) => {
  try {
    const { userId, itemType, search } = req.query

    const filters = {}

    if (userId) {
      filters.userId = Number(userId)
    }

    if (itemType) {
      filters.itemType = String(itemType).trim().toLowerCase()
    }

    if (search) {
      filters.keyword = {
        contains: String(search).trim(),
        mode: 'insensitive'
      }
    }

    const history = await prisma.searchHistory.findMany({
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
      message: 'Search history fetched successfully',
      data: history
    })
  } catch (error) {
    console.error('Get Search History Error:', error)

    return res.status(500).json({
      success: false,
      message: 'Unable to fetch search history'
    })
  }
}

export const deleteSearchHistory = async (req, res) => {
  try {
    const { id } = req.params

    const history = await prisma.searchHistory.findUnique({
      where: {
        id: Number(id)
      }
    })

    if (!history) {
      return res.status(404).json({
        success: false,
        message: 'Search history entry not found'
      })
    }

    await prisma.searchHistory.delete({
      where: {
        id: Number(id)
      }
    })

    return res.status(200).json({
      success: true,
      message: 'Search history entry deleted successfully'
    })
  } catch (error) {
    console.error('Delete Search History Error:', error)

    return res.status(500).json({
      success: false,
      message: 'Unable to delete search history entry'
    })
  }
}
