import express from 'express'
import {
    registerInstitutionAdmin,
    requestInstitutionAdminOtp,
    verifyInstitutionAdminOtp,
    loginInstitutionAdmin,
    getInstitutionAdminProfile,
    updateInstitutionAdminProfile,
    changeInstitutionAdminPassword,
    logoutInstitutionAdmin,
    getInstitutionDashboardStats
} from '../controllers/institutionAdminController.js'
import institutionsuperAdminAuth from '../middlewares/institutionAdminAuth.js'

const router = express.Router()

router.post('/request-otp', requestInstitutionAdminOtp)
router.post('/verify-otp', verifyInstitutionAdminOtp)
router.post('/register', registerInstitutionAdmin)
router.post('/login', loginInstitutionAdmin)
router.get('/me', institutionsuperAdminAuth, getInstitutionAdminProfile)
router.get('/stats', institutionsuperAdminAuth, getInstitutionDashboardStats)
router.put('/profile', institutionsuperAdminAuth, updateInstitutionAdminProfile)
router.put('/change-password', institutionsuperAdminAuth, changeInstitutionAdminPassword)
router.post('/logout', logoutInstitutionAdmin)

export default router
