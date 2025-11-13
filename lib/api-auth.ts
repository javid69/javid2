import { NextRequest } from 'next/server'
import { prisma } from './prisma'
import { UserRole } from '@prisma/client'

export interface AuthUser {
  id: string
  email: string
  name: string
  role: UserRole
}

export async function getSession(request: NextRequest): Promise<AuthUser | null> {
  // For now, we'll use a simple session approach
  // In a real app, you'd use NextAuth.js or similar
  const authHeader = request.headers.get('authorization')
  
  if (!authHeader?.startsWith('Bearer ')) {
    return null
  }

  const token = authHeader.substring(7)
  
  // For demo purposes, we'll use a simple token-based auth
  // In production, you'd verify JWT tokens here
  try {
    // This is a placeholder - in real implementation, verify JWT
    // For now, we'll return a mock user or look up by token
    const userEmail = token.includes('@') ? token : undefined
    
    if (!userEmail) {
      return null
    }

    const user = await prisma.user.findUnique({
      where: {
        email: userEmail
      }
    })

    if (!user) {
      return null
    }

    return {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role
    }
  } catch (error) {
    console.error('Session verification error:', error)
    return null
  }
}

export async function requireAuth(request: NextRequest): Promise<AuthUser> {
  const session = await getSession(request)
  
  if (!session) {
    throw new Error('Unauthorized: No valid session found')
  }
  
  return session
}

export async function requireRole(request: NextRequest, role: UserRole | UserRole[]): Promise<AuthUser> {
  const session = await requireAuth(request)
  
  const allowedRoles = Array.isArray(role) ? role : [role]
  
  if (!allowedRoles.includes(session.role)) {
    throw new Error(`Forbidden: Requires ${allowedRoles.join(' or ')} role`)
  }
  
  return session
}

export async function getCurrentUser(request: NextRequest): Promise<AuthUser | null> {
  return getSession(request)
}

export function createErrorResponse(message: string, code: string, status: number = 400) {
  return new Response(
    JSON.stringify({ 
      error: message, 
      code 
    }),
    {
      status,
      headers: {
        'Content-Type': 'application/json'
      }
    }
  )
}

export function createSuccessResponse<T>(data: T, status: number = 200) {
  return new Response(
    JSON.stringify(data),
    {
      status,
      headers: {
        'Content-Type': 'application/json'
      }
    }
  )
}