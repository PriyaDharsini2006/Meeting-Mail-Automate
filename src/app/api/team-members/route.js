// app/api/team-members/route.ts
import { NextResponse } from 'next/server'
import { prisma } from '../../../lib/prisma'

export async function GET() {
  try {
    // Fetch all team members with their current team
    const teamMembers = await prisma.teamMember.findMany({
      include: {
        team: true
      }
    })

    // Fetch all teams
    const teams = await prisma.team.findMany()

    return NextResponse.json({ 
      teamMembers, 
      teams 
    })
  } catch (error) {
    return NextResponse.json(
      { message: 'Error fetching team members and teams', error }, 
      { status: 500 }
    )
  }
}