import prisma from '../config/prisma.db.js'
import { sendEmail } from '../utils/mailer.js'

function toReadableStatus(status) {
  if (!status) return 'Pending'
  return status
    .split('_')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ')
}

function buildStatusEmailTemplate({
  name,
  previousStatus,
  currentStatus
}) {
  const websiteUrl =
    process.env.FRONTEND_URL || process.env.CLIENT_URL || 'http://localhost:3000'

  return `
    <div style="margin:0;padding:0;background:#f4f7fb;font-family:Arial,sans-serif;color:#0f172a;">
      <div style="max-width:640px;margin:0 auto;padding:24px;">
        <div style="background:#08111f;border-radius:16px;padding:20px 24px;text-align:center;">
          <div style="font-size:24px;font-weight:700;color:#67e8f9;">StudentPath</div>
          <div style="font-size:12px;color:#94a3b8;letter-spacing:0.12em;margin-top:6px;">LEARN. CHOOSE. GROW.</div>
        </div>
        <div style="background:#ffffff;border-radius:16px;padding:24px;margin-top:14px;border:1px solid #e2e8f0;">
          <p style="margin:0 0 12px;">Hi ${name},</p>
          <p style="margin:0 0 12px;">Your contact request status has been updated by our admin team.</p>
          <p style="margin:0 0 8px;"><strong>Previous Status:</strong> ${previousStatus}</p>
          <p style="margin:0 0 16px;"><strong>Current Status:</strong> ${currentStatus}</p>
          <p style="margin:0 0 16px;">If you need any help, just reply to this email.</p>
          <a href="${websiteUrl}" style="display:inline-block;background:#06b6d4;color:#001018;text-decoration:none;padding:10px 16px;border-radius:10px;font-weight:700;">
            Visit Website
          </a>
        </div>
        <div style="text-align:center;font-size:12px;color:#64748b;margin-top:12px;">
          Website: <a href="${websiteUrl}" style="color:#0ea5e9;">${websiteUrl}</a>
        </div>
      </div>
    </div>
  `
}

export const getContactRequests = async (req, res) => {
  try {
    const { status, search } = req.query

    const filters = {}

    if (status) {
      filters.status = status.trim()
    }

    if (search) {
      filters.OR = [
        {
          name: {
            contains: search,
            mode: 'insensitive'
          }
        },
        {
          email: {
            contains: search,
            mode: 'insensitive'
          }
        },
        {
          phone: {
            contains: search,
            mode: 'insensitive'
          }
        }
      ]
    }

    const contactRequests = await prisma.contactRequest.findMany({
      where: filters,
      orderBy: {
        createdAt: 'desc'
      }
    })

    return res.status(200).json({
      success: true,
      message: 'Contact requests fetched successfully',
      data: contactRequests
    })
  } catch (error) {
    console.error('Get Contact Requests Error:', error)

    return res.status(500).json({
      success: false,
      message: 'Unable to fetch contact requests'
    })
  }
}

export const getContactRequestById = async (req, res) => {
  try {
    const { id } = req.params

    const contactRequest = await prisma.contactRequest.findUnique({
      where: {
        id: Number(id)
      }
    })

    if (!contactRequest) {
      return res.status(404).json({
        success: false,
        message: 'Contact request not found'
      })
    }

    return res.status(200).json({
      success: true,
      message: 'Contact request fetched successfully',
      data: contactRequest
    })
  } catch (error) {
    console.error('Get Contact Request Error:', error)

    return res.status(500).json({
      success: false,
      message: 'Unable to fetch contact request'
    })
  }
}

export const createContactRequest = async (req, res) => {
  try {
    const {
      name,
      email,
      phone,
      subject,
      message
    } = req.body

    if (!name || !email || !message) {
      return res.status(400).json({
        success: false,
        message: 'Name, email and message are required'
      })
    }

    const userId = req.user?.id ? Number(req.user.id) : null

    const contactRequest = await prisma.contactRequest.create({
      data: {
        name: name.trim(),
        email: email.trim().toLowerCase(),
        phone: phone ? phone.trim() : null,
        subject: subject ? subject.trim() : null,
        message: message.trim(),
        status: 'pending',
        userId
      }
    })

    return res.status(201).json({
      success: true,
      message: 'Contact request created successfully',
      data: contactRequest
    })
  } catch (error) {
    console.error('Create Contact Request Error:', error)

    return res.status(500).json({
      success: false,
      message: 'Unable to create contact request'
    })
  }
}

export const updateContactRequestStatus = async (req, res) => {
  try {
    const { id } = req.params
    const { status } = req.body

    if (isNaN(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid contact request id'
      })
    }

    if (!status) {
      return res.status(400).json({
        success: false,
        message: 'Status is required'
      })
    }

    const validStatuses = ['pending', 'in_progress', 'resolved', 'rejected']

    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status value'
      })
    }

    const contactRequest = await prisma.contactRequest.findUnique({
      where: {
        id: Number(id)
      }
    })

    if (!contactRequest) {
      return res.status(404).json({
        success: false,
        message: 'Contact request not found'
      })
    }

    const nextStatus = status.trim()
    const currentStatus = contactRequest.status

    const updatedContactRequest = await prisma.contactRequest.update({
      where: {
        id: Number(id)
      },
      data: {
        status: nextStatus
      }
    })

    let emailDelivery = { sent: false, reason: 'status_unchanged' }

    if (currentStatus !== updatedContactRequest.status) {
      const previousStatusLabel = toReadableStatus(currentStatus)
      const currentStatusLabel = toReadableStatus(updatedContactRequest.status)
      emailDelivery = await sendEmail({
        to: updatedContactRequest.email,
        subject: `StudentPath Status Update: ${currentStatusLabel}`,
        text: `Hi ${updatedContactRequest.name}, your contact request status has been updated from ${previousStatusLabel} to ${currentStatusLabel}. Website: ${process.env.FRONTEND_URL || process.env.CLIENT_URL || 'http://localhost:3000'}`,
        html: buildStatusEmailTemplate({
          name: updatedContactRequest.name,
          previousStatus: previousStatusLabel,
          currentStatus: currentStatusLabel
        })
      })
    }

    return res.status(200).json({
      success: true,
      message: 'Contact request status updated successfully',
      data: updatedContactRequest,
      emailDelivery
    })
  } catch (error) {
    console.error('Update Contact Request Status Error:', error)

    return res.status(500).json({
      success: false,
      message: 'Unable to update contact request status'
    })
  }
}

export const deleteContactRequest = async (req, res) => {
  try {
    const { id } = req.params

    const contactRequest = await prisma.contactRequest.findUnique({
      where: {
        id: Number(id)
      }
    })

    if (!contactRequest) {
      return res.status(404).json({
        success: false,
        message: 'Contact request not found'
      })
    }

    await prisma.contactRequest.delete({
      where: {
        id: Number(id)
      }
    })

    return res.status(200).json({
      success: true,
      message: 'Contact request deleted successfully'
    })
  } catch (error) {
    console.error('Delete Contact Request Error:', error)

    return res.status(500).json({
      success: false,
      message: 'Unable to delete contact request'
    })
  }
}
