import express from 'express'
import {
  getSchoolAdmissions,
  getSchoolAdmissionById,
  createSchoolAdmission,
  updateSchoolAdmission,
  deleteSchoolAdmission
} from '../controllers/schoolAdmissionController.js'

const router = express.Router()

router.get('/', getSchoolAdmissions)
router.get('/:id', getSchoolAdmissionById)
router.post('/', createSchoolAdmission)
router.put('/:id', updateSchoolAdmission)
router.delete('/:id', deleteSchoolAdmission)

export default router