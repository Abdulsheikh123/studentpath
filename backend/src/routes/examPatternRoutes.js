import express from 'express'
import {
  getExamPatterns,
  getExamPatternById,
  createExamPattern,
  updateExamPattern,
  deleteExamPattern
} from '../controllers/examPatternController.js'

const router = express.Router()

router.get('/', getExamPatterns)
router.get('/:id', getExamPatternById)
router.post('/', createExamPattern)
router.put('/:id', updateExamPattern)
router.delete('/:id', deleteExamPattern)

export default router