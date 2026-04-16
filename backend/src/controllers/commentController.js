import prisma from '../config/prisma.db.js'

export const getComments = async (req, res) => {
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

    const comments = await prisma.comment.findMany({
      where: filters,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            profileImage: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    return res.status(200).json({
      success: true,
      message: 'Comments fetched successfully',
      data: comments
    })
  } catch (error) {
    console.error('Get Comments Error:', error)

    return res.status(500).json({
      success: false,
      message: 'Unable to fetch comments'
    })
  }
}

export const createComment = async (req, res) => {
  try {
    const {
      userId,
      itemType,
      itemId,
      message
    } = req.body

    if (!userId || !message) {
      return res.status(400).json({
        success: false,
        message: 'User id and comment message are required'
      })
    }

    if (!itemType || !itemId) {
      return res.status(400).json({
        success: false,
        message: 'Item type and item id are required'
      })
    }

    const user = await prisma.user.findUnique({
      where: {
        id: Number(userId)
      }
    })

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      })
    }

    const comment = await prisma.comment.create({
      data: {
        userId: Number(userId),
        itemType: String(itemType).trim().toLowerCase(),
        itemId: Number(itemId),
        message: String(message).trim()
      }
    })

    return res.status(201).json({
      success: true,
      message: 'Comment created successfully',
      data: comment
    })
  } catch (error) {
    console.error('Create Comment Error:', error)

    return res.status(500).json({
      success: false,
      message: 'Unable to create comment'
    })
  }
}

export const updateComment = async (req, res) => {
  try {
    const { id } = req.params
    const { message, itemType, itemId } = req.body

    const comment = await prisma.comment.findUnique({
      where: {
        id: Number(id)
      }
    })

    if (!comment) {
      return res.status(404).json({
        success: false,
        message: 'Comment not found'
      })
    }

    const updatedComment = await prisma.comment.update({
      where: {
        id: Number(id)
      },
      data: {
        message: message !== undefined ? String(message).trim() : undefined,
        itemType:
          itemType !== undefined
            ? String(itemType).trim().toLowerCase()
            : undefined,
        itemId: itemId !== undefined ? Number(itemId) : undefined
      }
    })

    return res.status(200).json({
      success: true,
      message: 'Comment updated successfully',
      data: updatedComment
    })
  } catch (error) {
    console.error('Update Comment Error:', error)

    return res.status(500).json({
      success: false,
      message: 'Unable to update comment'
    })
  }
}

export const approveComment = async (req, res) => {
  try {
    const { id } = req.params

    const comment = await prisma.comment.findUnique({
      where: {
        id: Number(id)
      }
    })

    if (!comment) {
      return res.status(404).json({
        success: false,
        message: 'Comment not found'
      })
    }

    return res.status(200).json({
      success: true,
      message: 'Comment approval is not enabled in the current schema',
      data: comment
    })
  } catch (error) {
    console.error('Approve Comment Error:', error)

    return res.status(500).json({
      success: false,
      message: 'Unable to approve comment'
    })
  }
}

export const deleteComment = async (req, res) => {
  try {
    const { id } = req.params

    const comment = await prisma.comment.findUnique({
      where: {
        id: Number(id)
      }
    })

    if (!comment) {
      return res.status(404).json({
        success: false,
        message: 'Comment not found'
      })
    }

    await prisma.comment.delete({
      where: {
        id: Number(id)
      }
    })

    return res.status(200).json({
      success: true,
      message: 'Comment deleted successfully'
    })
  } catch (error) {
    console.error('Delete Comment Error:', error)

    return res.status(500).json({
      success: false,
      message: 'Unable to delete comment'
    })
  }
}
