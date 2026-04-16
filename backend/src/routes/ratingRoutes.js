import express from 'express'
import superAdminAuth from '../middlewares/superAdminAuth.js'
import { getRatings, deleteRating } from '../controllers/ratingController.js'

const router = express.Router()

router.get('/', superAdminAuth, getRatings)
router.delete('/:id', superAdminAuth, deleteRating)

export default router
