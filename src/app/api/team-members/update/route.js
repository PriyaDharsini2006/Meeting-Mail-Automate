// app/api/team-members/update/route.ts
import { NextResponse } from 'next/server'
import { prisma } from '../../../../lib/prisma'

export async function PUT(request) {
  try {
    const { memberIds, teamId } = await request.json()

    // Validate input
    if (!memberIds || !Array.isArray(memberIds) || !teamId) {
      return NextResponse.json(
        { message: 'Invalid input: memberIds and teamId are required' }, 
        { status: 400 }
      )
    }

    // Update team for selected members
    const updatedMembers = await prisma.teamMember.updateMany({
      where: {
        id: {
          in: memberIds
        }
      },
      data: {
        teamId: teamId
      }
    })

    return NextResponse.json({ 
      message: 'Team members updated successfully', 
      updatedCount: updatedMembers.count 
    })
  } catch (error) {
    return NextResponse.json(
      { message: 'Error updating team members', error }, 
      { status: 500 }
    )
  }
}