import jwt from 'jsonwebtoken'
import prisma from '../config/prisma.db.js'

const SAFE_METHODS = new Set(['GET', 'HEAD', 'OPTIONS'])

const institutionsuperAdminAuth = async (req, res, next) => {
  try {
    const token = req.cookies?.institutionAdminToken

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Authentication token is required'
      })
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET)

    if (decoded.type !== 'institutionAdmin') {
      res.clearCookie('institutionAdminToken', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict'
      })
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      })
    }

    const admin = await prisma.institutionAdmin.findUnique({
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

    if (!admin) {
      res.clearCookie('institutionAdminToken', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict'
      })
      return res.status(401).json({
        success: false,
        message: 'Invalid or expired token'
      })
    }

    if (!admin.isApproved) {
      res.clearCookie('institutionAdminToken', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict'
      })
      return res.status(403).json({
        success: false,
        code: 'REVOKED',
        message: 'Your account is not approved'
      })
    }

    if (!admin.isActive) {
      if (!SAFE_METHODS.has(req.method)) {
        return res.status(403).json({
          success: false,
          code: 'READ_ONLY',
          message: 'Account deactivated: read-only access'
        })
      }
    }

    req.institutionAdmin = admin
    next()
  } catch (error) {
    res.clearCookie('institutionAdminToken', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict'
    })
    return res.status(401).json({
      success: false,
      message: 'Invalid or expired token'
    })
  }
}

export default institutionsuperAdminAuth
