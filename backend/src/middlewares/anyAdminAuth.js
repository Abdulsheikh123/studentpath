import jwt from 'jsonwebtoken'
import prisma from '../config/prisma.db.js'

const SAFE_METHODS = new Set(['GET', 'HEAD', 'OPTIONS'])

const anyAdminAuth = async (req, res, next) => {
  try {
    const superAdminToken = req.cookies.superAdminToken
    const institutionAdminToken = req.cookies.institutionAdminToken

    if (!superAdminToken && !institutionAdminToken) {
      return res.status(401).json({ success: false, message: 'Authentication required' })
    }

    // 1. Try Super Admin
    if (superAdminToken) {
      try {
        const decoded = jwt.verify(superAdminToken, process.env.JWT_SECRET)
        const superAdmin = await prisma.superAdmin.findUnique({ where: { id: decoded.id } })
        if (superAdmin) {
          req.adminRole = 'superAdmin'
          req.superAdmin = superAdmin
          return next()
        }
      } catch (err) { }
    }

    // 2. Try Institution Admin (Partner)
    if (institutionAdminToken) {
      try {
        const decoded = jwt.verify(institutionAdminToken, process.env.JWT_SECRET)

        if (decoded.type !== 'institutionAdmin') {
          res.clearCookie('institutionAdminToken', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict'
          })
          return res.status(403).json({ success: false, message: 'Access denied' })
        }

        const instAdmin = await prisma.institutionAdmin.findUnique({
          where: { id: decoded.id },
          select: {
            id: true,
            username: true,
            email: true,
            mobile: true,
            institutionTitle: true,
            institutionType: true,
            isApproved: true,
            isActive: true,
            universityId: true,
            collegeId: true,
            schoolId: true,
            instituteId: true,
            researchId: true
          }
        })
        
        if (!instAdmin) {
          res.clearCookie('institutionAdminToken', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict'
          })
          return res.status(401).json({ success: false, message: 'Invalid partner token' })
        }

        if (!instAdmin.isApproved) {
          res.clearCookie('institutionAdminToken', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict'
          })
          return res.status(403).json({ success: false, code: 'REVOKED', message: 'Your account is not approved' })
        }

        if (!instAdmin.isActive && !SAFE_METHODS.has(req.method)) {
          return res.status(403).json({ success: false, code: 'READ_ONLY', message: 'Account deactivated: read-only access' })
        }

        req.adminRole = 'institutionAdmin'
        req.institutionAdmin = instAdmin
        req.partnerReadOnly = !instAdmin.isActive
        
        // Helper: Automatically resolve the specific institution ID linked
        req.partnerInfo = {
          id: instAdmin.universityId || instAdmin.collegeId || instAdmin.schoolId || instAdmin.instituteId || instAdmin.researchId,
          type: instAdmin.institutionType,
          universityId: instAdmin.universityId,
          collegeId: instAdmin.collegeId,
          schoolId: instAdmin.schoolId,
          instituteId: instAdmin.instituteId,
          researchId: instAdmin.researchId
        }
        
        return next()
      } catch (err) {
        res.clearCookie('institutionAdminToken', {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'strict'
        })
        return res.status(401).json({ success: false, message: 'Invalid partner token' })
      }
    }

    return res.status(401).json({ success: false, message: 'Unauthorized access' })
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Auth server error' })
  }
}

export default anyAdminAuth
