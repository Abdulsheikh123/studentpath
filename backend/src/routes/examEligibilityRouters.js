import express from 'express'
import {
  getExamEligibilities,
  getExamEligibilityById,
  createExamEligibility,
  updateExamEligibility,
  deleteExamEligibility
} from '../controllers/examEligibilityController.js'

const router = express.Router()

router.get('/', getExamEligibilities)
router.get('/:id', getExamEligibilityById)
router.post('/', createExamEligibility)
router.put('/:id', updateExamEligibility)
router.delete('/:id', deleteExamEligibility)

export default router