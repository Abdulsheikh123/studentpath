import express from 'express'
import {
  getStandaloneInstitutes,
  getStandaloneInstituteBySlug
} from '../controllers/standaloneInstituteController.js'

const router = express.Router()

router.get('/', getStandaloneInstitutes)
router.get('/:slug', getStandaloneInstituteBySlug)

export default router
