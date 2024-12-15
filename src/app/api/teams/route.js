import { NextResponse } from 'next/server'
import { prisma } from '../../../lib/prisma'

export async function GET() {
  try {
    const teams = await prisma.team.findMany()
    return NextResponse.json(teams)
  } catch (error) {
    return NextResponse.json(
      { message: 'Error fetching teams', error }, 
      { status: 500 }
    )
  }
}