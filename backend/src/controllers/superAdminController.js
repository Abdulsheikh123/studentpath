import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import prisma from '../config/prisma.db.js'

export const signUp = async (req, res) => {
  try {
    const { email, password } = req.body
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Username, email and password are required'
      })
    }
    const admin = await prisma.superAdmin.findUnique({
      where: {
        email: email.trim().toLowerCase()
      }
    })
    if (admin) {
      return res.status(400).json({
        success: false,
        message: 'Admin already exists'
      })
    }
    const hashedPassword = await bcrypt.hash(password, 10)
    const newAdmin = await prisma.superAdmin.create({
      data: {
        email: email.trim().toLowerCase(),
        password: hashedPassword
      }
    })
    return res.status(201).json({
      success: true,
      message: 'Admin created successfully',
      data: {
        id: newAdmin.id,
        email: newAdmin.email
      }
    })
  } catch (error) {
    console.log(error)
    return res.status(500).json({
      success: false,
      message: 'Unable to create admin'
    })
  }
}

export const loginSuperAdmin = async (req, res) => {
  try {
    const { email, password } = req.body

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required'
      })
    }

    const admin = await prisma.superAdmin.findUnique({
      where: {
        email: email.trim().toLowerCase()
      }
    })

    if (!admin) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      })
    }

    const isPasswordMatched = await bcrypt.compare(password, admin.password)

    if (!isPasswordMatched) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      })
    }

    const token = jwt.sign(
      {
        id: admin.id,
        email: admin.email,
        type: 'superAdmin'
      },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    )

    // Proactively clear any existing institutionAdminToken to avoid conflicts
    res.clearCookie('institutionAdminToken', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict'
    })

    res.cookie('superAdminToken', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000
    })

    return res.status(200).json({
      success: true,
      message: 'Login successful',
      data: {
        id: admin.id,
        email: admin.email
      }
    })
  } catch (error) {
    console.log(error)
    return res.status(500).json({
      success: false,
      message: 'Unable to login'
    })
  }
}

export const getSuperAdminProfile = async (req, res) => {
  try {
    const admin = await prisma.superAdmin.findUnique({
      where: { id: req.superAdmin.id },
      select: {
        id: true,
        email: true,
        createdAt: true
      }
    })

    if (!admin) {
      return res.status(404).json({
        success: false,
        message: 'Admin not found'
      })
    }

    return res.status(200).json({
      success: true,
      data: admin
    })
  } catch (error) {
    console.log(error)
    return res.status(500).json({
      success: false,
      message: 'Unable to fetch profile'
    })
  }
}

export const changeSuperAdminPassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: 'Both passwords are required'
      })
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'New password must be at least 6 characters'
      })
    }

    const admin = await prisma.superAdmin.findUnique({
      where: { id: req.superAdmin.id }
    })

    const isPasswordMatched = await bcrypt.compare(currentPassword, admin.password)

    if (!isPasswordMatched) {
      return res.status(401).json({
        success: false,
        message: 'Current password is incorrect'
      })
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10)

    await prisma.superAdmin.update({
      where: { id: req.superAdmin.id },
      data: { password: hashedPassword }
    })

    return res.status(200).json({
      success: true,
      message: 'Password changed successfully'
    })
  } catch (error) {
    console.log(error)
    return res.status(500).json({
      success: false,
      message: 'Unable to change password'
    })
  }
}

export const logoutSuperAdmin = async (req, res) => {
  try {
    res.clearCookie('superAdminToken', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict'
    })

    return res.status(200).json({
      success: true,
      message: 'Logout successful'
    })
  } catch (error) {
    console.log(error)
    return res.status(500).json({
      success: false,
      message: 'Unable to logout'
    })
  }
}