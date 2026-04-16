import express from 'express'
import {
  getContentPages,
  getContentPageBySlug,
  createContentPage,
  updateContentPage,
  deleteContentPage
} from '../controllers/contentPageController.js'

const router = express.Router()

router.get('/', getContentPages)
router.get('/:slug', getContentPageBySlug)
router.post('/', createContentPage)
router.put('/:id', updateContentPage)
router.delete('/:id', deleteContentPage)

export default router