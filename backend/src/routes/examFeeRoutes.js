import express from 'express'
import {
  getExamFees,
  getExamFeeById,
  createExamFee,
  updateExamFee,
  deleteExamFee
} from '../controllers/examFeeController.js'

const router = express.Router()

router.get('/', getExamFees)
router.get('/:id', getExamFeeById)
router.post('/', createExamFee)
router.put('/:id', updateExamFee)
router.delete('/:id', deleteExamFee)

export default router