import express from 'express'
import {
  getSchoolFees,
  getSchoolFeeById,
  createSchoolFee,
  updateSchoolFee,
  deleteSchoolFee
} from '../controllers/schoolFeeController.js'

const router = express.Router()

router.get('/', getSchoolFees)
router.get('/:id', getSchoolFeeById)
router.post('/', createSchoolFee)
router.put('/:id', updateSchoolFee)
router.delete('/:id', deleteSchoolFee)

export default router