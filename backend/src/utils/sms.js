import axios from 'axios'

export async function sendSms({ to, message }) {
  const webhookUrl = process.env.SMS_WEBHOOK_URL

  if (!webhookUrl) {
    return { sent: false, reason: 'missing_sms_configuration' }
  }

  try {
    const result = await axios.post(
      webhookUrl,
      { to, message },
      {
        headers: {
          'Content-Type': 'application/json',
          ...(process.env.SMS_WEBHOOK_TOKEN
            ? { Authorization: `Bearer ${process.env.SMS_WEBHOOK_TOKEN}` }
            : {})
        },
        timeout: 10000
      }
    )

    return { sent: true, providerResponse: result.data }
  } catch (error) {
    const status = error?.response?.status
    return { sent: false, reason: status ? `SMS_SEND_FAILED_${status}` : 'SMS_SEND_FAILED' }
  }
}

