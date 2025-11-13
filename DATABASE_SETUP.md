# Database Setup & Prisma Configuration

This document provides a comprehensive guide for setting up and managing the PostgreSQL database using Prisma ORM for the ASYLEN VENTURES Real Estate Platform.

## Overview

The database schema is designed using Prisma ORM with PostgreSQL as the primary database provider. The schema includes comprehensive models for:
- Users (with role-based access)
- Properties (listings with detailed information)
- Property Images (gallery management)
- Amenities (common features)
- Favorites (user preferences)
- Inquiries (lead management)
- Viewing Schedules (appointment booking)
- Property Alerts (saved searches)
- NextAuth integration (Account, Session, VerificationToken)

## Initial Setup

### 1. Environment Configuration

Create a `.env.local` file in the project root (or update `.env`):

```bash
# Database connection URL
# Format: postgresql://user:password@host:port/dbname
DATABASE_URL="postgresql://postgres:password@localhost:5432/asylen_db"
```

For local development using Prisma Postgres:
```bash
DATABASE_URL="prisma+postgres://localhost:51213/?api_key=..."
```

For production PostgreSQL:
```bash
DATABASE_URL="postgresql://user:securepassword@prod-db.example.com:5432/asylen_prod"
```

### 2. Database Connection

Ensure your PostgreSQL instance is running and the connection string is valid. For local development:

```bash
# Start Prisma's local PostgreSQL server
npm run db:dev
```

Or connect to an existing PostgreSQL database by updating `DATABASE_URL` in `.env.local`.

## Database Operations

### Generate Prisma Client

After schema changes, regenerate the Prisma client:

```bash
npm run db:generate
```

### Create Migrations

Generate a new migration after schema changes:

```bash
# Interactive migration (recommended)
npm run db:migrate

# Non-interactive migration
npm run db:migrate -- --name add_new_field
```

### Apply Schema to Database

Push the schema to the database without creating a migration (development only):

```bash
npm run db:push
```

**Warning:** `db:push` should only be used during development. For production, use migrations.

### Seed Database

Initialize the database with seed data (implemented in Phase 16):

```bash
npm run db:seed
```

### Prisma Studio

Open an interactive database browser and editor:

```bash
npm run db:studio
```

This opens a web interface at `http://localhost:5555` for viewing and editing records.

## Schema Overview

### Core Models

#### User
- Unique email-based authentication
- Role-based access control (VISITOR, USER, AGENT, ADMIN)
- Support for multiple auth providers (credentials, Google, GitHub)
- Relations to Properties (as agent), Favorites, Inquiries, ViewingSchedules, PropertyAlerts
- NextAuth account and session relationships

#### Property
- Complete property details (price, dimensions, location)
- Multiple property types (Apartment, Villa, Office, etc.)
- Multiple categories (Residential, Commercial, Land, Luxury, Rental)
- Status tracking (Active, Sold, Rented, Inactive)
- Agent assignment with cascade delete
- Relations to Images, Amenities, Favorites, Inquiries, ViewingSchedules

#### PropertyImage
- Multiple images per property
- Cloudinary integration (URL + public ID for deletion)
- Display order for gallery sorting
- Cascade delete when property is deleted

#### Amenity
- Reusable amenity definitions
- Icon references (Lucide icons)
- Categories (safety, comfort, utility, etc.)
- Many-to-many relationship via PropertyAmenity

#### PropertyAmenity
- Junction table for property-amenity relationships
- Optimized composite primary key
- Indexes on both foreign keys

#### Favorite
- User's saved properties
- Composite primary key (userId, propertyId)
- Cascade delete on user or property deletion

#### Inquiry
- Lead/inquiry tracking
- Optional user link (null for guest inquiries)
- Status tracking (New, Contacted, Converted, Lost)
- Visitor contact information

#### ViewingSchedule
- Property viewing appointments
- Date and time scheduling
- Status tracking (Scheduled, Confirmed, Completed, Cancelled)
- Optional notes field

#### PropertyAlert
- Saved search criteria
- User-defined filters (price range, property types, location)
- Activation toggle
- Index optimization on userId

### NextAuth Integration Models

#### Account
- OAuth provider credentials
- Supports Google, GitHub, and other providers
- Linked to User via userId

#### Session
- User session tokens
- Expiration timestamp
- Linked to User via userId

#### VerificationToken
- Email verification tokens
- Account recovery tokens
- Expiration tracking

## Performance Considerations

### Indexes
The schema includes strategic indexes for common query patterns:
- User: email, role
- Property: agentId, status, category, city, propertyType
- PropertyImage: propertyId
- PropertyAmenity: propertyId, amenityId
- Favorite: userId, propertyId
- Inquiry: propertyId, userId, status
- ViewingSchedule: propertyId, userId, status
- PropertyAlert: userId
- Account: userId
- Session: userId

### Cascade Deletes
- Property images are deleted when a property is deleted
- All user relations (Properties, Favorites, Inquiries, etc.) are deleted when a user is deleted
- Property-related records cascade appropriately

## Prisma Client Usage

### Initialize in Your Application

```typescript
// lib/prisma.ts
import { PrismaClient } from '@prisma/client'

const globalForPrisma = global as unknown as { prisma: PrismaClient }

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: process.env.NODE_ENV === 'development'
      ? ['query', 'error', 'warn']
      : ['error'],
  })

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
```

### Use in API Routes or Server Components

```typescript
import { prisma } from '@/lib/prisma'

// Create
const user = await prisma.user.create({
  data: {
    email: 'user@example.com',
    name: 'John Doe',
    role: 'USER',
  },
})

// Read
const property = await prisma.property.findUnique({
  where: { id: propertyId },
  include: {
    images: true,
    amenities: { include: { amenity: true } },
    agent: true,
  },
})

// Update
await prisma.property.update({
  where: { id: propertyId },
  data: { featured: true },
})

// Delete
await prisma.inquiry.delete({
  where: { id: inquiryId },
})
```

## Development Workflow

1. **Modify schema** in `prisma/schema.prisma`
2. **Create migration** with `npm run db:migrate -- --name descriptive_name`
3. **Review migration** in `prisma/migrations/[timestamp]_descriptive_name/migration.sql`
4. **Test locally** with Prisma Studio: `npm run db:studio`
5. **Regenerate client** if needed: `npm run db:generate`
6. **Commit** both schema and migrations to version control

## Production Deployment

1. Set `DATABASE_URL` in production environment variables
2. Run migrations: `prisma migrate deploy`
3. Verify schema: `prisma db execute --stdin < verify.sql` or use database tools
4. Monitor connection pool and query performance
5. Regular backups of PostgreSQL database

## Troubleshooting

### Connection Issues
- Verify `DATABASE_URL` format and credentials
- Check PostgreSQL service is running
- Test connection: `psql $DATABASE_URL`

### Migration Conflicts
- Check for uncommitted migrations
- Review `prisma/migrations` directory
- Run `prisma migrate resolve` if needed

### Type Errors
- Regenerate Prisma client: `npm run db:generate`
- Clear `.next` cache: `rm -rf .next`
- Restart TypeScript server in your IDE

### Slow Queries
- Check indexes on frequently queried fields
- Use `npm run db:studio` to profile queries
- Enable query logging in development

## Related Documentation

- [Prisma Documentation](https://www.prisma.io/docs)
- [PostgreSQL Documentation](https://www.postgresql.org/docs)
- [NextAuth Configuration](../app/api/auth/[...nextauth].ts)
- [Seed Data (Phase 16)](./prisma/seed.ts)

## Useful Commands Reference

| Command | Purpose |
|---------|---------|
| `npm run db:generate` | Generate/regenerate Prisma Client |
| `npm run db:migrate` | Create and run migrations interactively |
| `npm run db:push` | Push schema to database (dev only) |
| `npm run db:seed` | Run seed script (Phase 16) |
| `npm run db:studio` | Open Prisma Studio browser UI |
| `prisma format` | Auto-format schema.prisma |
| `prisma validate` | Validate schema syntax |
| `prisma db execute` | Execute raw SQL queries |

