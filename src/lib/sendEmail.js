
import nodemailer from 'nodemailer'

export async function sendMeetingInvite(
  recipients, 
  meetingDetails
) {
  // Validate input
  if (recipients.length === 0) {
    throw new Error('No recipients provided')
  }

  // Create transporter
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    secure: process.env.SMTP_SECURE === 'true',
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS
    }
  })

  // Track email sending progress
  const emailResults = []
  let sentCount = 0
  let failedCount = 0

  // Send emails to each recipient individually
  for (const recipient of recipients) {
    const mailOptions = {
      from: `"NeonTech Meetings" <${process.env.SMTP_FROM}>`,
      to: recipient,
      subject: `Meeting Invite: ${meetingDetails.name}`,
      html: `
        <h1>Meeting Invitation</h1>
        <p><strong>Name:</strong> ${meetingDetails.name}</p>
        <p><strong>Time:</strong> ${meetingDetails.time}</p>
        <p><strong>Description:</strong> ${meetingDetails.description}</p>
        <p><strong>Meeting Link:</strong> <a href="${meetingDetails.meetingLink}">${meetingDetails.meetingLink}</a>
      `
    }

    try {
      const info = await transporter.sendMail(mailOptions)
      sentCount++
      console.log(`Email sent to ${recipient}:`, info.messageId)
      console.log(`Current sent count: ${sentCount}`)
      emailResults.push({ recipient, status: 'sent', messageId: info.messageId })
    } catch (error) {
      failedCount++
      console.error(`Email sending error for ${recipient}:`, error)
      console.log(`Current failed count: ${failedCount}`)
      emailResults.push({ recipient, status: 'failed', error: error.message })
    }
  }

  // Final summary
  console.log('Email Sending Summary:')
  console.log(`Total Recipients: ${recipients.length}`)
  console.log(`Successfully Sent: ${sentCount}`)
  console.log(`Failed Emails: ${failedCount}`)

  return {
    results: emailResults,
    sentCount,
    failedCount
  }
} 