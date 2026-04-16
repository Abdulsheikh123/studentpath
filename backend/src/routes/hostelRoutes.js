import express from 'express'
import {
  getHostels,
  getHostelById,
  createHostel,
  updateHostel,
  deleteHostel
} from '../controllers/hostelController.js'

const router = express.Router()

router.get('/', getHostels)
router.get('/:id', getHostelById)
router.post('/', createHostel)
router.put('/:id', updateHostel)
router.delete('/:id', deleteHostel)

export default router