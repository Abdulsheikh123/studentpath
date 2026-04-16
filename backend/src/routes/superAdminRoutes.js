import express from 'express'
import upload from '../middlewares/multer.js'
import {
  loginSuperAdmin,
  getSuperAdminProfile,
  changeSuperAdminPassword,
  logoutSuperAdmin,
  signUp
} from '../controllers/superAdminController.js'
import superAdminAuth from '../middlewares/superAdminAuth.js'
import { 
  getPendingInstitutionAdmins, 
  approveInstitutionAdmin, 
  deleteInstitutionAdmin,
  getAllInstitutionAdmins,
  updatePartnerStatus
} from '../controllers/institutionAdminController.js'

const router = express.Router()




router.post('/signup',signUp)
router.post('/login', loginSuperAdmin)
router.get('/me', superAdminAuth, getSuperAdminProfile)
router.put('/change-password', superAdminAuth, changeSuperAdminPassword)
router.post('/logout', logoutSuperAdmin)

// Partner Management Routes (Super Admin Only)
router.get('/pending-partners', superAdminAuth, getPendingInstitutionAdmins)
router.get('/partners', superAdminAuth, getAllInstitutionAdmins)
router.put('/approve-partner/:id', superAdminAuth, approveInstitutionAdmin)
router.put('/partners/:id/status', superAdminAuth, updatePartnerStatus)
router.delete('/reject-partner/:id', superAdminAuth, deleteInstitutionAdmin)

router.post('/upload', superAdminAuth, upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ success: false, message: 'Image file is required' })
  }
  const imagePath = `/uploads/${req.file.filename}`
  const imageUrl = `${req.protocol}://${req.get('host')}${imagePath}`
  return res.status(201).json({ success: true, imagePath, imageUrl })
})

export default router