import jwt from 'jsonwebtoken'

const superAdminAuth = async (req, res, next) => {
  try {
    const token = req.cookies?.superAdminToken

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Authentication token is required'
      })
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET)

    if (decoded.type !== 'superAdmin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      })
    }

    req.superAdmin = decoded
    next()
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Invalid or expired token'
    })
  }
}

export default superAdminAuth