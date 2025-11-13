# ASYLEN VENTURES Real Estate Platform - API Setup

## Overview

This is the backend API for the ASYLEN VENTURES Real Estate Platform, built with Next.js, Prisma, and PostgreSQL. It provides complete CRUD operations for property management, user authentication, and file uploads.

## Features

- ✅ Complete Property CRUD APIs
- ✅ User authentication and authorization
- ✅ Image management with Cloudinary
- ✅ Amenity management
- ✅ Inquiry and viewing scheduling
- ✅ Pagination and filtering
- ✅ Comprehensive validation with Zod
- ✅ TypeScript support
- ✅ Database seeding with sample data

## Tech Stack

- **Framework**: Next.js 16 with App Router
- **Database**: PostgreSQL with Prisma ORM
- **Validation**: Zod schemas
- **File Storage**: Cloudinary
- **Authentication**: Custom auth middleware (NextAuth.js ready)
- **Language**: TypeScript

## Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Environment Setup

Copy the example environment file and configure your variables:

```bash
cp .env.example .env.local
```

Update `.env.local` with your actual values:

```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/realestate_db"

# Authentication
NEXTAUTH_SECRET="your-secret-key-here"
NEXTAUTH_URL="http://localhost:3000"

# Cloudinary
CLOUDINARY_CLOUD_NAME="your-cloudinary-cloud-name"
CLOUDINARY_API_KEY="your-cloudinary-api-key"
CLOUDINARY_API_SECRET="your-cloudinary-api-secret"
```

### 3. Database Setup

#### Option A: Using Prisma Migrate (Recommended for production)

```bash
# Generate Prisma client
npm run db:generate

# Run database migrations
npm run db:migrate

# Seed the database with sample data
npm run db:seed
```

#### Option B: Using Prisma Push (Good for development)

```bash
# Push schema to database
npm run db:push

# Seed the database
npm run db:seed
```

### 4. Start Development Server

```bash
npm run dev
```

The API will be available at `http://localhost:3000/api`

## Database Schema

The database includes the following models:

- **User**: User accounts with roles (USER, AGENT, ADMIN)
- **Property**: Real estate properties with details and location
- **PropertyImage**: Images associated with properties
- **Amenity**: Available amenities (pool, garden, etc.)
- **PropertyAmenity**: Junction table for property-amenity relationships
- **Inquiry**: Property inquiries from potential buyers
- **ViewingSchedule**: Scheduled property viewings

## API Endpoints

### Properties
- `GET /api/properties` - List all properties with pagination
- `POST /api/properties` - Create new property (AGENT/ADMIN only)
- `GET /api/properties/featured` - Get featured properties
- `GET /api/properties/[id] - Get single property details
- `PUT /api/properties/[id] - Update property (owner/ADMIN only)
- `DELETE /api/properties/[id] - Delete property (owner/ADMIN only)

### Property Images
- `POST /api/properties/[id]/images` - Upload images to property
- `PUT /api/properties/[id]/images` - Add image URL to property
- `DELETE /api/properties/[id]/images/[imageId]` - Delete property image

### Property Amenities
- `GET /api/properties/[id]/amenities` - Get property amenities
- `POST /api/properties/[id]/amenities` - Add amenity to property
- `DELETE /api/properties/[id]/amenities/[amenityId]` - Remove amenity

### Amenities
- `GET /api/amenities` - Get all available amenities

### User Management
- `GET /api/user/profile` - Get current user profile
- `PUT /api/user/profile` - Update user profile

### File Uploads
- `POST /api/uploads` - Upload file to Cloudinary

## Authentication

For development, the API uses a simple Bearer token authentication where you can use the user's email as the token:

```bash
Authorization: Bearer agent1@asylem.com
```

**Sample Users from Seed Data:**
- **Admin**: `admin@asylem.com` / `password123`
- **Agent 1**: `agent1@asylem.com` / `password123`
- **Agent 2**: `agent2@asylem.com` / `password123`
- **User**: `user@asylem.com` / `password123`

## Database Management

### View Database
```bash
npm run db:studio
```

### Reset Database
```bash
npm run db:reset
```

### Generate Client
```bash
npm run db:generate
```

## API Documentation

See [API_DOCUMENTATION.md](./API_DOCUMENTATION.md) for detailed API documentation including request/response formats, error codes, and examples.

## Project Structure

```
├── app/
│   └── api/
│       ├── properties/
│       │   ├── route.ts              # GET all, POST new
│       │   ├── [id]/
│       │   │   ├── route.ts          # GET, PUT, DELETE
│       │   │   ├── images/
│       │   │   │   ├── route.ts      # POST images, PUT image URL
│       │   │   │   └── [imageId]/
│       │   │   │       └── route.ts  # DELETE image
│       │   │   └── amenities/
│       │   │       ├── route.ts      # GET, POST amenities
│       │   │       └── [amenityId]/
│       │   │           └── route.ts  # DELETE amenity
│       │   └── featured/
│       │       └── route.ts          # GET featured properties
│       ├── amenities/
│       │   └── route.ts              # GET all amenities
│       ├── user/
│       │   └── profile/
│       │       └── route.ts          # GET, PUT user profile
│       ├── uploads/
│       │   └── route.ts              # POST file upload
│       └── health/
│           └── route.ts              # Health check endpoint
├── lib/
│   ├── prisma.ts                     # Prisma client instance
│   ├── api-auth.ts                   # Authentication middleware
│   ├── validations.ts                # Zod validation schemas
│   └── cloudinary.ts                 # Cloudinary utilities
├── prisma/
│   ├── schema.prisma                 # Database schema
│   └── seed.ts                       # Database seeding script
└── API_DOCUMENTATION.md              # Comprehensive API docs
```

## Validation

All API endpoints use Zod schemas for request validation:

- **CreatePropertySchema**: Property creation validation
- **UpdatePropertySchema**: Property update validation
- **CreateImageSchema**: Image upload validation
- **CreateAmenitySchema**: Amenity addition validation
- **PaginationSchema**: Pagination parameter validation

## Error Handling

The API provides consistent error responses:

```json
{
  "error": "Error message",
  "code": "ERROR_CODE"
}
```

Common error codes:
- `VALIDATION_ERROR` (400)
- `UNAUTHORIZED` (401)
- `FORBIDDEN` (403)
- `NOT_FOUND` (404)
- `INTERNAL_ERROR` (500)

## Development Notes

- The API uses `requireAuth()` and `requireRole()` middleware for authentication
- All database operations use Prisma with proper error handling
- File uploads are handled through Cloudinary with size and type validation
- The database includes cascade deletes for related records
- Response times and errors are logged for monitoring

## Production Deployment

1. Set up a PostgreSQL database
2. Configure environment variables
3. Run database migrations: `npm run db:migrate`
4. Seed production data if needed: `npm run db:seed`
5. Deploy to your hosting platform

## Testing

You can test the API using tools like:
- Postman
- curl
- Insomnia
- Browser's network tab

Example curl command to get properties:

```bash
curl -H "Authorization: Bearer user@asylem.com" \
     http://localhost:3000/api/properties
```

## Future Enhancements

- Implement JWT-based authentication with NextAuth.js
- Add rate limiting middleware
- Implement file compression and optimization
- Add real-time notifications
- Implement advanced search and filtering
- Add property analytics and reporting
- Implement property comparison features
- Add multilingual support
- Implement caching strategies