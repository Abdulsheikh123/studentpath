import crypto from 'crypto'

function otpPepper() {
  return process.env.OTP_SECRET || process.env.JWT_SECRET || 'studentpath_otp'
}

export function generateOtp(length = 6) {
  const max = 10 ** length
  const value = crypto.randomInt(0, max)
  return String(value).padStart(length, '0')
}

export function hashOtp(otp) {
  return crypto
    .createHash('sha256')
    .update(`${otpPepper()}:${String(otp).trim()}`)
    .digest('hex')
}

export function otpExpiryDate(minutes = 10) {
  return new Date(Date.now() + minutes * 60 * 1000)
}

export function isExpired(expiresAt) {
  return !expiresAt || new Date(expiresAt).getTime() <= Date.now()
}

