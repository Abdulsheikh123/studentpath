import express from 'express'
import {
  getAdmissionGuides,
  getAdmissionGuideById,
  createAdmissionGuide,
  updateAdmissionGuide,
  deleteAdmissionGuide
} from '../controllers/admissionGuideController.js'

const router = express.Router()

router.get('/', getAdmissionGuides)
router.get('/:id', getAdmissionGuideById)
router.post('/', createAdmissionGuide)
router.put('/:id', updateAdmissionGuide)
router.delete('/:id', deleteAdmissionGuide)

export default router