import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import prisma from '../config/prisma.db.js'
import { sendEmail } from '../utils/mailer.js'
import { sendSms } from '../utils/sms.js'
import { generateOtp, hashOtp, isExpired, otpExpiryDate } from '../utils/otp.js'

function normalizeEmail(value) {
  return String(value || '').trim().toLowerCase()
}

function normalizeMobile(value) {
  return String(value || '').trim()
}

function shouldReturnDebugOtp() {
  return process.env.OTP_DEBUG_RETURN === 'true' || process.env.NODE_ENV !== 'production'
}

function ensureOtpModel(res) {
  if (!prisma.institutionAdminOtp) {
    res.status(500).json({
      success: false,
      message: 'OTP system not initialized. Run Prisma migrate + generate.'
    })
    return false
  }
  return true
}

export const requestInstitutionAdminOtp = async (req, res) => {
  try {
    if (!ensureOtpModel(res)) return
    const email = normalizeEmail(req.body?.email)
    const mobile = normalizeMobile(req.body?.mobile)

    if (!email || !mobile) {
      return res.status(400).json({ success: false, message: 'Email and mobile are required' })
    }

    const existingAdmin = await prisma.institutionAdmin.findFirst({
      where: {
        OR: [{ email }, { mobile }]
      },
      select: { id: true }
    })

    if (existingAdmin) {
      return res.status(409).json({ success: false, message: 'Email or mobile already exists' })
    }

    const emailOtp = generateOtp(6)
    const mobileOtp = generateOtp(6)

    const expiresAt = otpExpiryDate(10)

    await prisma.institutionAdminOtp.upsert({
      where: { email_mobile: { email, mobile } },
      create: {
        email,
        mobile,
        emailOtpHash: hashOtp(emailOtp),
        mobileOtpHash: hashOtp(mobileOtp),
        expiresAt
      },
      update: {
        emailOtpHash: hashOtp(emailOtp),
        mobileOtpHash: hashOtp(mobileOtp),
        expiresAt,
        verifiedAt: null,
        attempts: 0
      }
    })

    const emailResult = await sendEmail({
      to: email,
      subject: 'StudentPath Partner Verification Code',
      text: `Your verification code is ${emailOtp}. It expires in 10 minutes.`,
      html: `<p>Your verification code is <b>${emailOtp}</b>.</p><p>It expires in 10 minutes.</p>`
    })

    const smsResult = await sendSms({
      to: mobile,
      message: `StudentPath OTP: ${mobileOtp} (expires in 10 minutes)`
    })

    const debugEnabled = shouldReturnDebugOtp()

    if (!debugEnabled && (!emailResult.sent || !smsResult.sent)) {
      return res.status(500).json({
        success: false,
        message: 'OTP delivery failed. Please try again later.'
      })
    }

    const debug = debugEnabled
      ? { emailOtp, mobileOtp, emailSent: emailResult.sent, smsSent: smsResult.sent, smsReason: smsResult.reason }
      : undefined

    return res.status(200).json({
      success: true,
      message: 'OTP sent',
      ...(debug ? { debug } : {})
    })
  } catch (error) {
    console.log(error)
    return res.status(500).json({ success: false, message: 'Unable to send OTP' })
  }
}

export const verifyInstitutionAdminOtp = async (req, res) => {
  try {
    if (!ensureOtpModel(res)) return
    const email = normalizeEmail(req.body?.email)
    const mobile = normalizeMobile(req.body?.mobile)
    const emailOtp = String(req.body?.emailOtp || '').trim()
    const mobileOtp = String(req.body?.mobileOtp || '').trim()

    if (!email || !mobile || !emailOtp || !mobileOtp) {
      return res.status(400).json({ success: false, message: 'Email, mobile, and both OTPs are required' })
    }

    const record = await prisma.institutionAdminOtp.findUnique({
      where: { email_mobile: { email, mobile } }
    })

    if (!record || isExpired(record.expiresAt)) {
      return res.status(400).json({ success: false, message: 'OTP expired or not found' })
    }

    if (record.attempts >= 5) {
      return res.status(429).json({ success: false, message: 'Too many attempts. Request a new OTP.' })
    }

    const emailOk = hashOtp(emailOtp) === record.emailOtpHash
    const mobileOk = hashOtp(mobileOtp) === record.mobileOtpHash

    if (!emailOk || !mobileOk) {
      await prisma.institutionAdminOtp.update({
        where: { email_mobile: { email, mobile } },
        data: { attempts: { increment: 1 } }
      })
      return res.status(400).json({ success: false, message: 'Invalid OTP' })
    }

    await prisma.institutionAdminOtp.update({
      where: { email_mobile: { email, mobile } },
      data: { verifiedAt: new Date() }
    })

    const otpToken = jwt.sign(
      { type: 'institutionAdminOtp', email, mobile },
      process.env.JWT_SECRET,
      { expiresIn: '10m' }
    )

    return res.status(200).json({
      success: true,
      message: 'OTP verified',
      data: { otpToken }
    })
  } catch (error) {
    console.log(error)
    return res.status(500).json({ success: false, message: 'Unable to verify OTP' })
  }
}

// Get Dashboard Stats
export const getInstitutionDashboardStats = async (req, res) => {
  try {
    const admin = await prisma.institutionAdmin.findUnique({
      where: { id: req.institutionAdmin.id }
    })

    if (!admin) {
      return res.status(404).json({ success: false, message: 'Admin not found' })
    }

    const stats = {
      courses: 0,
      admissions: 0,
      faqs: 0,
      placements: 0
    }

    // Fetch counts based on institution type
    if (admin.universityId) {
      stats.courses = await prisma.universityCourse.count({ where: { universityId: admin.universityId } })
      stats.admissions = await prisma.universityAdmission.count({ where: { universityId: admin.universityId } })
      stats.faqs = await prisma.universityFAQ.count({ where: { universityId: admin.universityId } })
      stats.placements = await prisma.universityPlacement.count({ where: { universityId: admin.universityId } })
    } else if (admin.collegeId) {
      stats.courses = await prisma.collegeCourse.count({ where: { collegeId: admin.collegeId } })
      stats.admissions = await prisma.collegeAdmission.count({ where: { collegeId: admin.collegeId } })
      stats.faqs = await prisma.collegeFAQ.count({ where: { collegeId: admin.collegeId } })
      stats.placements = await prisma.collegePlacement.count({ where: { collegeId: admin.collegeId } })
    } else if (admin.schoolId) {
      stats.admissions = await prisma.schoolAdmission.count({ where: { schoolId: admin.schoolId } })
      stats.faqs = await prisma.schoolFAQ.count({ where: { schoolId: admin.schoolId } })
    }

    return res.status(200).json({
      success: true,
      data: stats
    })
  } catch (error) {
    console.log(error)
    return res.status(500).json({ success: false, message: 'Unable to fetch stats' })
  }
}

// Register
export const registerInstitutionAdmin = async (req, res) => {
  try {
    if (!ensureOtpModel(res)) return
    const { username, email, password, mobile, institutionTitle, institutionType, otpToken } = req.body

    if (!username || !email || !password || !mobile || !institutionTitle || !institutionType || !otpToken) {
      return res.status(400).json({
        success: false,
        message: 'All fields are required'
      })
    }

    let otpDecoded
    try {
      otpDecoded = jwt.verify(String(otpToken), process.env.JWT_SECRET)
    } catch {
      return res.status(401).json({ success: false, message: 'OTP verification required' })
    }

    const normalizedEmail = normalizeEmail(email)
    const normalizedMobile = normalizeMobile(mobile)

    if (otpDecoded?.type !== 'institutionAdminOtp' || otpDecoded?.email !== normalizedEmail || otpDecoded?.mobile !== normalizedMobile) {
      return res.status(401).json({ success: false, message: 'OTP verification required' })
    }

    const otpRecord = await prisma.institutionAdminOtp.findUnique({
      where: { email_mobile: { email: normalizedEmail, mobile: normalizedMobile } }
    })

    if (!otpRecord || !otpRecord.verifiedAt || isExpired(otpRecord.expiresAt)) {
      return res.status(401).json({ success: false, message: 'OTP verification required' })
    }

    const existingAdmin = await prisma.institutionAdmin.findFirst({
      where: {
        OR: [
          { email: normalizedEmail },
          { username: username.trim() },
          { mobile: normalizedMobile }
        ]
      }
    })

    if (existingAdmin) {
      return res.status(409).json({
        success: false,
        message: 'Email, username, or mobile already exists'
      })
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    const newAdmin = await prisma.institutionAdmin.create({
      data: {
        username: username.trim(),
        email: normalizedEmail,
        password: hashedPassword,
        mobile: normalizedMobile,
        emailVerified: true,
        mobileVerified: true,
        institutionTitle: institutionTitle.trim(),
        institutionType: institutionType.trim(),
        isApproved: false,
        isActive: true
      }
    })

    await prisma.institutionAdminOtp.delete({
      where: { email_mobile: { email: normalizedEmail, mobile: normalizedMobile } }
    }).catch(() => {})

    return res.status(201).json({
      success: true,
      message: 'Registration successful. Wait for Super Admin approval.',
      data: {
        id: newAdmin.id,
        username: newAdmin.username,
        email: newAdmin.email,
        mobile: newAdmin.mobile,
        institutionTitle: newAdmin.institutionTitle,
        isApproved: newAdmin.isApproved
      }
    })
  } catch (error) {
    console.log(error)
    return res.status(500).json({
      success: false,
      message: 'Unable to register'
    })
  }
}

// Login
export const loginInstitutionAdmin = async (req, res) => {
  try {
    const { email, password } = req.body

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required'
      })
    }

    const admin = await prisma.institutionAdmin.findUnique({
      where: { email: email.trim().toLowerCase() }
    })

    if (!admin) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      })
    }

    if (!admin.isApproved) {
      return res.status(403).json({
        success: false,
        message: 'Your account is pending approval from Super Admin'
      })
    }

    if (!admin.isActive) {
      return res.status(403).json({
        success: false,
        message: 'Your account has been deactivated'
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
        type: 'institutionAdmin',
        institutionType: admin.institutionType,
        universityId: admin.universityId,
        collegeId: admin.collegeId,
        schoolId: admin.schoolId,
        instituteId: admin.instituteId,
        researchId: admin.researchId
      },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    )

    // Proactively clear any existing superAdminToken to avoid conflicts
    res.clearCookie('superAdminToken', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict'
    })

    res.cookie('institutionAdminToken', token, {
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
        username: admin.username,
        email: admin.email,
        institutionTitle: admin.institutionTitle,
        institutionType: admin.institutionType
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

// Get Profile
export const getInstitutionAdminProfile = async (req, res) => {
  try {
    const admin = await prisma.institutionAdmin.findUnique({
      where: { id: req.institutionAdmin.id },
      select: {
        id: true,
        username: true,
        email: true,
        mobile: true,
        institutionTitle: true,
        institutionType: true,
        isApproved: true,
        isActive: true,
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

// Update Profile
export const updateInstitutionAdminProfile = async (req, res) => {
  try {
    const { username, mobile } = req.body

    const admin = await prisma.institutionAdmin.findUnique({
      where: { id: req.institutionAdmin.id }
    })

    if (!admin) {
      return res.status(404).json({
        success: false,
        message: 'Admin not found'
      })
    }

    const updatedAdmin = await prisma.institutionAdmin.update({
      where: { id: req.institutionAdmin.id },
      data: {
        username: username || admin.username,
        mobile: mobile || admin.mobile
      },
      select: {
        id: true,
        username: true,
        email: true,
        mobile: true,
        institutionTitle: true,
        institutionType: true
      }
    })

    return res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      data: updatedAdmin
    })
  } catch (error) {
    console.log(error)
    return res.status(500).json({
      success: false,
      message: 'Unable to update profile'
    })
  }
}

// Change Password
export const changeInstitutionAdminPassword = async (req, res) => {
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

    const admin = await prisma.institutionAdmin.findUnique({
      where: { id: req.institutionAdmin.id }
    })

    const isPasswordMatched = await bcrypt.compare(currentPassword, admin.password)

    if (!isPasswordMatched) {
      return res.status(401).json({
        success: false,
        message: 'Current password is incorrect'
      })
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10)

    await prisma.institutionAdmin.update({
      where: { id: req.institutionAdmin.id },
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

// Logout
export const logoutInstitutionAdmin = async (req, res) => {
  try {
    res.clearCookie('institutionAdminToken', {
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

// Get Pending Approvals (For Super Admin)
export const getPendingInstitutionAdmins = async (req, res) => {
  try {
    const pending = await prisma.institutionAdmin.findMany({
      where: { isApproved: false },
      select: {
        id: true,
        username: true,
        email: true,
        institutionTitle: true,
        institutionType: true,
        createdAt: true
      }
    })

    return res.status(200).json({ success: true, data: pending })
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Unable to fetch pending list' })
  }
}

// Approve Partner
export const approveInstitutionAdmin = async (req, res) => {
  try {
    const { id } = req.params
    
    // 1. Get the admin info
    const admin = await prisma.institutionAdmin.findUnique({
      where: { id: Number(id) }
    })

    if (!admin) return res.status(404).json({ success: false, message: 'Partner not found' })
    if (admin.isApproved) return res.status(200).json({ success: true, message: 'Partner already approved' })

    const slug = `${admin.institutionTitle.toLowerCase().replace(/ /g, '-')}-${Date.now()}`
    
    let linkedData = {}

    // Find a default sub-district (id: 1) for initialization
    const defaultLocation = await prisma.subDistrict.findFirst()
    const subDistrictId = defaultLocation?.id || 1

    // 2. Create the actual institution record based on type
    if (admin.institutionType === 'University') {
      const university = await prisma.university.create({
        data: {
          name: admin.institutionTitle,
          slug,
          subDistrictId: subDistrictId
        }
      })
      linkedData = { universityId: university.id }
    } else if (admin.institutionType === 'College') {
      const college = await prisma.college.create({
        data: {
          name: admin.institutionTitle,
          slug,
          subDistrictId: subDistrictId
        }
      })
      linkedData = { collegeId: college.id }
    } else if (admin.institutionType === 'School') {
      const school = await prisma.school.create({
        data: {
          name: admin.institutionTitle,
          slug,
          subDistrictId: subDistrictId
        }
      })
      linkedData = { schoolId: school.id }
    }

    // 3. Update admin with approval and link
    await prisma.institutionAdmin.update({
      where: { id: Number(id) },
      data: { 
        isApproved: true,
        ...linkedData
      }
    })

    return res.status(200).json({ success: true, message: `Approved and ${admin.institutionType} record created.` })
  } catch (error) {
    console.error(error)
    return res.status(500).json({ success: false, message: 'Approval process failed' })
  }
}

// Get All Partners (For Super Admin)
export const getAllInstitutionAdmins = async (req, res) => {
  try {
    const partners = await prisma.institutionAdmin.findMany({
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        username: true,
        email: true,
        institutionTitle: true,
        institutionType: true,
        isApproved: true,
        isActive: true,
        createdAt: true
      }
    })

    return res.status(200).json({ success: true, data: partners })
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Unable to fetch partner list' })
  }
}

// Toggle status (Approve/Deactivate)
export const updatePartnerStatus = async (req, res) => {
  try {
    const { id } = req.params
    const { isApproved, isActive } = req.body

    const partner = await prisma.institutionAdmin.update({
      where: { id: Number(id) },
      data: { 
        isApproved: isApproved !== undefined ? isApproved : undefined,
        isActive: isActive !== undefined ? isActive : undefined
      }
    })

    return res.status(200).json({ 
      success: true, 
      message: 'Status updated successfully',
      data: partner
    })
  } catch (error) {
    return res.status(404).json({ success: false, message: 'Partner not found' })
  }
}

// Reject/Delete Partner
export const deleteInstitutionAdmin = async (req, res) => {
  try {
    const { id } = req.params
    await prisma.institutionAdmin.delete({
      where: { id: Number(id) }
    })
    return res.status(200).json({ success: true, message: 'Partner rejected/removed' })
  } catch (error) {
    return res.status(404).json({ success: false, message: 'Partner not found' })
  }
}
