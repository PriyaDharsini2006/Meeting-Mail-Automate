
// lib/sendEmail.ts
import nodemailer from 'nodemailer'

export async function sendMeetingInvite(
  recipients, 
  meetingDetails
) {
  // Ensure you have proper SMTP configuration
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    secure: process.env.SMTP_SECURE === 'true', // Convert to boolean
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS
    }
  })

  // Validate input
  if (recipients.length === 0) {
    throw new Error('No recipients provided')
  }

  const mailOptions = {
    from: `"NeonTech Meetings" <${process.env.SMTP_FROM}>`,
    to: recipients,
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
    console.log('Email sent:', info.messageId)
    return info
  } catch (error) {
    console.error('Email sending error:', error)
    throw error
  }
}