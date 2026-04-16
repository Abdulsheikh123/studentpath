import express from 'express'
import {
  getComments,
  createComment,
  updateComment,
  approveComment,
  deleteComment
} from '../controllers/commentController.js'

const router = express.Router()

router.get('/', getComments)
router.post('/', createComment)
router.put('/:id', updateComment)
router.put('/:id/approve', approveComment)
router.delete('/:id', deleteComment)

export default router
