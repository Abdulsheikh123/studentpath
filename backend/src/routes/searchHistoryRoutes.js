import express from 'express'
import superAdminAuth from '../middlewares/superAdminAuth.js'
import {
  getSearchHistory,
  deleteSearchHistory
} from '../controllers/searchHistoryController.js'

const router = express.Router()

router.get('/', superAdminAuth, getSearchHistory)
router.delete('/:id', superAdminAuth, deleteSearchHistory)

export default router
