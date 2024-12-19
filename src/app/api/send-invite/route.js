
// src/app/api/send-invite/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '../../../lib/prisma'
import { sendMeetingInvite } from '../../../lib/sendEmail'

export async function POST(request) {
  try {
    // Parse the request body
    const body = await request.json()
    console.log('Received body:', body)

    const { 
      name, 
      time, 
      description, 
      meetingLink, 
      teamId 
    } = body

    // Validate input
    if (!name || !time || !description || !meetingLink || !teamId) {
      console.error('Missing required fields', {
        name: !!name,
        time: !!time,
        description: !!description,
        meetingLink: !!meetingLink,
        teamId: !!teamId
      })

      return NextResponse.json(
        { message: 'Missing required fields' }, 
        { status: 400 }
      )
    }

    // Log team ID for debugging
    console.log('Searching for team members with teamId:', teamId)

    // Fetch team members' emails
    const teamMembers = await prisma.teamMember.findMany({
      where: { teamId },
      select: { email: true }
    })

    console.log('Found team members:', teamMembers)

    // Check if team members exist
    if (teamMembers.length === 0) {
      return NextResponse.json(
        { message: 'No team members found for the given team' }, 
        { status: 404 }
      )
    }

    const recipientEmails = teamMembers.map(member => member.email)

    console.log('Recipient emails:', recipientEmails)

    // Send email and get the email sending results
    const emailSendingResults = await sendMeetingInvite(recipientEmails, {
      name,
      time,
      description,
      meetingLink
    })

    // Destructure the results from the email sending function
    const { results, sentCount, failedCount } = emailSendingResults

    return NextResponse.json({ 
      message: 'Invite sent successfully',
      recipients: recipientEmails.length,
      results,
      sentCount,
      failedCount
    })
  } catch (error) {
    // Detailed error logging
    console.error('Full error details:', error)

    // If it's a Prisma error, log additional details
    if (error instanceof Error) {
      console.error('Error name:', error.name)
      console.error('Error message:', error.message)
      console.error('Error stack:', error.stack)
    }

    return NextResponse.json(
      { 
        message: 'Failed to send invite', 
        errorDetails: error instanceof Error ? error.message : 'Unknown error'
      }, 
      { status: 500 }
    )
  }
}