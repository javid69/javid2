import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAuth, createErrorResponse, createSuccessResponse } from '@/lib/api-auth'
import { z } from 'zod'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

const UpdateProfileSchema = z.object({
  name: z.string().min(1, 'Name is required').optional(),
  avatar: z.string().url('Avatar must be a valid URL').optional().or(z.literal('')),
  phone: z.string().optional(),
  bio: z.string().max(500, 'Bio must be at most 500 characters').optional(),
})

// GET /api/user/profile - Get current user profile
export async function GET(request: NextRequest) {
  try {
    const user = await requireAuth(request)

    const userProfile = await prisma.user.findUnique({
      where: { id: user.id },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        avatar: true,
        phone: true,
        bio: true,
        createdAt: true,
        updatedAt: true,
        _count: {
          select: {
            properties: true,
            inquiries: true,
            viewingSchedules: true,
          },
        },
      },
    })

    if (!userProfile) {
      return createErrorResponse('User not found', 'USER_NOT_FOUND', 404)
    }

    return createSuccessResponse(userProfile)
  } catch (error: any) {
    console.error('GET /api/user/profile error:', error)

    if (error.message.includes('Unauthorized')) {
      return createErrorResponse(
        error.message,
        'UNAUTHORIZED',
        401
      )
    }

    return createErrorResponse('Internal server error', 'INTERNAL_ERROR', 500)
  }
}

// PUT /api/user/profile - Update current user profile
export async function PUT(request: NextRequest) {
  try {
    const user = await requireAuth(request)

    const body = await request.json()
    const validatedData = UpdateProfileSchema.parse(body)

    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: validatedData,
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        avatar: true,
        phone: true,
        bio: true,
        createdAt: true,
        updatedAt: true,
      },
    })

    return createSuccessResponse(updatedUser)
  } catch (error: any) {
    console.error('PUT /api/user/profile error:', error)

    if (error.name === 'ZodError') {
      return createErrorResponse('Validation failed', 'VALIDATION_ERROR', 400)
    }

    if (error.message.includes('Unauthorized')) {
      return createErrorResponse(
        error.message,
        'UNAUTHORIZED',
        401
      )
    }

    return createErrorResponse('Internal server error', 'INTERNAL_ERROR', 500)
  }
}