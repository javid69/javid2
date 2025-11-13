import jwt from 'jsonwebtoken'
import { NextRequest } from 'next/server'

const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret-key'

export interface AuthUser {
  id: string
  email: string
  role: string
}

export function getTokenFromRequest(request: NextRequest): string | null {
  const authHeader = request.headers.get('authorization')
  if (authHeader && authHeader.startsWith('Bearer ')) {
    return authHeader.substring(7)
  }
  
  // Also check for cookie-based auth
  const cookie = request.cookies.get('auth-token')
  if (cookie) {
    return cookie.value
  }
  
  return null
}

export function verifyToken(token: string): AuthUser | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as any
    return {
      id: decoded.id,
      email: decoded.email,
      role: decoded.role
    }
  } catch (error) {
    return null
  }
}

export function getAuthenticatedUser(request: NextRequest): AuthUser | null {
  const token = getTokenFromRequest(request)
  if (!token) {
    return null
  }
  
  return verifyToken(token)
}