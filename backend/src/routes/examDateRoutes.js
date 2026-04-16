import express from 'express'
import {
  getExamDates,
  getExamDateById,
  createExamDate,
  updateExamDate,
  deleteExamDate
} from '../controllers/examDateController.js'

const router = express.Router()

router.get('/', getExamDates)
router.get('/:id', getExamDateById)
router.post('/', createExamDate)
router.put('/:id', updateExamDate)
router.delete('/:id', deleteExamDate)

export default router