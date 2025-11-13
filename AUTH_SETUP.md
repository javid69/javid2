# Authentication System Setup - ASYLEN VENTURES

This document provides comprehensive instructions for the NextAuth.js authentication system implementation.

## Overview

The authentication system includes:
- Email/Password authentication with bcryptjs hashing
- Google OAuth integration
- Role-based access control (USER, AGENT, ADMIN)
- Protected routes via middleware
- Session management with JWT
- Protected API routes

## Environment Setup

### Required Environment Variables

Create a `.env.local` file in the root directory with the following variables:

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/asylen_ventures?schema=public"

# NextAuth
NEXTAUTH_SECRET=your-secret-key-here
NEXTAUTH_URL=http://localhost:3000

# Google OAuth
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
```

### Generate NEXTAUTH_SECRET

Run the following command to generate a secure secret:

```bash
openssl rand -base64 32
```

## Google OAuth Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the Google+ API
4. Go to **Credentials** → **Create Credentials** → **OAuth 2.0 Client ID**
5. Configure the OAuth consent screen:
   - Application name: ASYLEN VENTURES
   - User support email: your-email@example.com
   - Authorized domains: your-domain.com
6. Create OAuth 2.0 Client ID:
   - Application type: Web application
   - Name: ASYLEN VENTURES Web Client
   - Authorized JavaScript origins: `http://localhost:3000`
   - Authorized redirect URIs: 
     - `http://localhost:3000/api/auth/callback/google`
     - `https://your-domain.com/api/auth/callback/google` (for production)
7. Copy the Client ID and Client Secret to your `.env.local` file

## Database Setup

### Initialize Prisma

```bash
npx prisma generate
npx prisma db push
```

### Create Database Migration (optional)

```bash
npx prisma migrate dev --name init
```

## User Roles

The system supports three user roles:

- **USER**: Basic access to dashboard and user features
- **AGENT**: Access to agent portal and property management
- **ADMIN**: Full administrative access to all features

### Default Role Assignment

- New signups: `USER` role by default
- Google OAuth: `USER` role by default
- To promote users to AGENT or ADMIN, manually update the database

### Update User Role via Database

```sql
-- Promote user to AGENT
UPDATE "User" SET role = 'AGENT' WHERE email = 'user@example.com';

-- Promote user to ADMIN
UPDATE "User" SET role = 'ADMIN' WHERE email = 'admin@example.com';
```

## Protected Routes

### Middleware Configuration

The middleware protects routes based on authentication and role:

#### Public Routes
- `/` - Homepage
- `/auth/signin` - Sign in page
- `/auth/signup` - Sign up page
- `/auth/error` - Error page
- `/properties` - Property listings
- `/about` - About page
- `/contact` - Contact page

#### Protected Routes
- `/dashboard/*` - Requires authenticated user (USER role+)
- `/agent/*` - Requires AGENT or ADMIN role
- `/admin/*` - Requires ADMIN role only

### Redirect Behavior

- Unauthenticated users accessing protected routes → Redirected to `/auth/signin`
- Authenticated users accessing auth pages → Redirected to `/dashboard`
- Users without required role → Redirected to `/dashboard`

## API Routes

### Public API Routes

```typescript
// POST /api/auth/signup - Create new user
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "phone": "+1234567890" // optional
}
```

### Protected API Routes

```typescript
// GET /api/user/profile - Get current user profile
// Requires: Authenticated user
// Returns: User object

// PUT /api/user/profile - Update user profile
// Requires: Authenticated user
// Body: { "name": "New Name", "phone": "+1234567890" }
```

## Usage Examples

### Server-Side Authentication

```typescript
import { auth } from "@/lib/auth";

export default async function Page() {
  const session = await auth();
  
  if (!session?.user) {
    redirect("/auth/signin");
  }
  
  // Access user data
  const { id, email, name, role } = session.user;
  
  return <div>Welcome, {name}</div>;
}
```

### Client-Side Authentication

```typescript
"use client";

import { useSession } from "next-auth/react";

export default function Component() {
  const { data: session, status } = useSession();
  
  if (status === "loading") {
    return <div>Loading...</div>;
  }
  
  if (!session) {
    return <div>Not authenticated</div>;
  }
  
  return <div>Welcome, {session.user.name}</div>;
}
```

### Sign Out

```typescript
"use client";

import { signOut } from "next-auth/react";

export default function SignOutButton() {
  return (
    <button onClick={() => signOut({ callbackUrl: "/" })}>
      Sign Out
    </button>
  );
}
```

### Protected API Route

```typescript
import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function GET() {
  const session = await auth();
  
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  
  // Check role
  if (session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  
  return NextResponse.json({ data: "Protected data" });
}
```

### Auth Utility Functions

```typescript
import { 
  getCurrentUser, 
  requireAuth, 
  requireRole, 
  isAdmin, 
  isAgent 
} from "@/lib/auth-utils";
import { UserRole } from "@prisma/client";

// Get current user (returns null if not authenticated)
const user = await getCurrentUser();

// Require authentication (throws error if not authenticated)
const user = await requireAuth();

// Require specific role (throws error if not authenticated or wrong role)
const user = await requireRole(UserRole.AGENT);

// Check if user is admin
const isUserAdmin = await isAdmin();

// Check if user is agent or admin
const isUserAgent = await isAgent();
```

## Security Features

### Password Hashing
- Passwords are hashed using bcryptjs with 10 salt rounds
- Passwords are never stored in plain text

### CSRF Protection
- NextAuth.js includes built-in CSRF protection
- `sameSite: "lax"` cookie setting for additional security

### Session Security
- JWT tokens with secure secret
- Tokens include user ID and role claims
- Sessions expire and require re-authentication

### Error Handling
- Generic error messages to prevent user enumeration
- Detailed errors logged server-side only
- Custom error page for authentication errors

## Troubleshooting

### Database Connection Issues

Ensure PostgreSQL is running and the DATABASE_URL is correct:

```bash
# Test database connection
npx prisma db pull
```

### Google OAuth Not Working

1. Check that redirect URIs match exactly in Google Console
2. Verify GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET are correct
3. Ensure Google+ API is enabled in your project

### Session Not Persisting

1. Verify NEXTAUTH_SECRET is set
2. Check NEXTAUTH_URL matches your application URL
3. Clear browser cookies and try again

### User Role Not Working

1. Check that the user role is set in the database
2. Verify the middleware configuration in `middleware.ts`
3. Ensure JWT callback includes the role

## Testing

### Test User Creation

```bash
# Create test user via API
curl -X POST http://localhost:3000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "password": "password123"
  }'
```

### Test Authentication Flow

1. Navigate to `/auth/signup`
2. Create a new account
3. Sign in at `/auth/signin`
4. Verify redirect to `/dashboard`
5. Test sign out functionality

### Test Role-Based Access

1. Create users with different roles
2. Test access to `/dashboard` (USER+)
3. Test access to `/agent` (AGENT+)
4. Test access to `/admin` (ADMIN only)

## Production Deployment

### Environment Variables

Set the following in your production environment (Vercel, etc.):

```env
DATABASE_URL="your-production-database-url"
NEXTAUTH_SECRET="your-production-secret"
NEXTAUTH_URL="https://your-domain.com"
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"
```

### Database Migration

```bash
npx prisma migrate deploy
```

### Security Checklist

- [ ] NEXTAUTH_SECRET is a strong, unique value
- [ ] DATABASE_URL uses SSL connection
- [ ] NEXTAUTH_URL uses HTTPS in production
- [ ] Google OAuth redirect URIs include production URL
- [ ] Environment variables are not committed to version control
- [ ] CORS is properly configured
- [ ] Rate limiting is implemented (recommended)

## Support

For issues or questions, please refer to:
- [NextAuth.js Documentation](https://next-auth.js.org/)
- [Prisma Documentation](https://www.prisma.io/docs/)
- [Next.js Documentation](https://nextjs.org/docs/)
