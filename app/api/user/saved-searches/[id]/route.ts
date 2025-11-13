import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getAuthenticatedUser } from '@/lib/auth'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

interface RouteParams {
  params: Promise<{ id: string }>
}

export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const user = getAuthenticatedUser(request)
    
    if (!user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    const { id } = await params
    const body = await request.json()

    // Check if the saved search exists and belongs to the user
    const existingSearch = await prisma.savedSearch.findFirst({
      where: {
        id,
        userId: user.id
      }
    })

    if (!existingSearch) {
      return NextResponse.json(
        { error: 'Saved search not found' },
        { status: 404 }
      )
    }

    const updatedSearch = await prisma.savedSearch.update({
      where: { id },
      data: {
        ...(body.name && { name: body.name }),
        ...(body.filters && { filters: body.filters }),
        ...(body.notify !== undefined && { notify: body.notify })
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

    return NextResponse.json({ data: updatedSearch })

  } catch (error) {
    console.error('Update saved search error:', error)
    
    return NextResponse.json(
      { 
        error: 'Internal server error',
        message: 'Failed to update saved search. Please try again later.'
      },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const user = getAuthenticatedUser(request)
    
    if (!user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    const { id } = await params

    // Check if the saved search exists and belongs to the user
    const existingSearch = await prisma.savedSearch.findFirst({
      where: {
        id,
        userId: user.id
      }
    })

    if (!existingSearch) {
      return NextResponse.json(
        { error: 'Saved search not found' },
        { status: 404 }
      )
    }

    await prisma.savedSearch.delete({
      where: { id }
    })

    return NextResponse.json(
      { message: 'Saved search deleted successfully' },
      { status: 200 }
    )

  } catch (error) {
    console.error('Delete saved search error:', error)
    
    return NextResponse.json(
      { 
        error: 'Internal server error',
        message: 'Failed to delete saved search. Please try again later.'
      },
      { status: 500 }
    )
  }
}