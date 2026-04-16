import nodemailer from 'nodemailer'

let cachedTransporter = null

function createTransporter() {
  const host = process.env.SMTP_HOST
  const port = Number(process.env.SMTP_PORT || 587)
  const user =
    process.env.SMTP_USER || process.env.EMAIL_USER || process.env.ADMIN_EMAIL
  const pass =
    process.env.SMTP_PASS || process.env.EMAIL_PASS || process.env.ADMIN_PASSWORD

  if (host && user && pass) {
    return nodemailer.createTransport({
      host,
      port,
      secure: port === 465,
      auth: {
        user,
        pass
      }
    })
  }

  // Fallback for common Gmail-style setup without explicit host/port.
  if (user && pass) {
    return nodemailer.createTransport({
      service: process.env.SMTP_SERVICE || 'gmail',
      auth: {
        user,
        pass
      }
    })
  }

  if (!user || !pass) {
    return null
  }

  return null
}

function getTransporter() {
  if (!cachedTransporter) {
    cachedTransporter = createTransporter()
  }
  return cachedTransporter
}

export async function sendEmail({ to, subject, html, text }) {
  const transporter = getTransporter()
  const fromAddress =
    process.env.SMTP_FROM ||
    process.env.ADMIN_EMAIL ||
    process.env.SMTP_USER ||
    process.env.EMAIL_USER
  const fromName = process.env.MAIL_FROM_NAME || 'StudentPath Support'
  const replyTo = process.env.ADMIN_EMAIL || fromAddress

  if (!transporter || !fromAddress || !to) {
    return { sent: false, reason: 'missing_email_configuration' }
  }

  try {
    const result = await transporter.sendMail({
      from: `"${fromName}" <${fromAddress}>`,
      to,
      replyTo,
      subject,
      html,
      text
    })

    return { sent: true, messageId: result.messageId }
  } catch (error) {
    const code = error?.code || 'MAIL_SEND_FAILED'
    const responseCode = error?.responseCode ? `_${error.responseCode}` : ''
    return { sent: false, reason: `${code}${responseCode}` }
  }
}
