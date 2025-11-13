import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getAuthenticatedUser } from '@/lib/auth'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const user = getAuthenticatedUser(request)
    
    if (!user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    const savedSearches = await prisma.savedSearch.findMany({
      where: {
        userId: user.id
      },
      orderBy: {
        createdAt: 'desc'
      },
      select: {
        id: true,
        name: true,
        filters: true,
        notify: true,
        createdAt: true,
        updatedAt: true
      }
    })

    return NextResponse.json({ data: savedSearches })

  } catch (error) {
    console.error('Get saved searches error:', error)
    
    return NextResponse.json(
      { 
        error: 'Internal server error',
        message: 'Failed to fetch saved searches. Please try again later.'
      },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = getAuthenticatedUser(request)
    
    if (!user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    const body = await request.json()
    
    if (!body.name || !body.filters) {
      return NextResponse.json(
        { 
          error: 'Missing required fields',
          details: 'Both name and filters are required'
        },
        { status: 400 }
      )
    }

    const savedSearch = await prisma.savedSearch.create({
      data: {
        name: body.name,
        filters: body.filters,
        notify: body.notify || false,
        userId: user.id
      },
      select: {
        id: true,
        name: true,
        filters: true,
        notify: true,
        createdAt: true,
        updatedAt: true
      }
    })

    return NextResponse.json({ data: savedSearch }, { status: 201 })

  } catch (error) {
    console.error('Create saved search error:', error)
    
    return NextResponse.json(
      { 
        error: 'Internal server error',
        message: 'Failed to create saved search. Please try again later.'
      },
      { status: 500 }
    )
  }
}