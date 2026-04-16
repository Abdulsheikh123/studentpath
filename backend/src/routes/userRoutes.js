import express from 'express'
import {
  googleLogin,
  getAllUsers,
  getSingleUser,
  updateUser,
  deleteUser,
  logoutUser,
  getCurrentUser
} from '../controllers/userController.js'

import userAuth from '../middlewares/userAuth.js'
import superAdminAuth from '../middlewares/superAdminAuth.js'

const router = express.Router()

router.post('/login', googleLogin)
router.post('/logout', userAuth, logoutUser)
router.get('/me', userAuth, getCurrentUser)

router.get('/', superAdminAuth, getAllUsers)
router.get('/:id', superAdminAuth, getSingleUser)
router.put('/:id', superAdminAuth, updateUser)
router.delete('/:id', superAdminAuth, deleteUser)

export default router