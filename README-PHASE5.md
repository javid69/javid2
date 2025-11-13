# ASYLEN VENTURES Real Estate Platform - Phase 5

## Property Search & Filtering System

This implementation provides a comprehensive property search and filtering system with advanced query parameters, sorting options, and optimized database queries.

## 🚀 Features Implemented

### ✅ Core Search Functionality
- **Advanced Search API** (`GET /api/properties/search`) with comprehensive filtering
- **Text Search** across title, description, and location fields
- **Price Range Filtering** with min/max price support
- **Property Type Filtering** (APARTMENT, HOUSE, VILLA, COMMERCIAL, OFFICE, SHOP, LAND, STUDIO)
- **Category Filtering** (RENT, SALE, SHORT_TERM)
- **Location-based Filtering** with case-insensitive search
- **Bedroom/Bathroom Filtering** with single value and array support
- **Area Range Filtering** in square feet
- **Amenities Filtering** with AND logic (all selected amenities must match)
- **Featured Properties** filtering
- **Multiple Sorting Options** (newest, price-asc, price-desc, featured)
- **Pagination** with hasMore flag and total count

### ✅ Saved Searches System
- **GET /api/user/saved-searches** - Retrieve user's saved searches
- **POST /api/user/saved-searches** - Create new saved search
- **PUT /api/user/saved-searches/[id]** - Update existing saved search
- **DELETE /api/user/saved-searches/[id]** - Delete saved search
- **Authentication** with JWT tokens
- **Notification preferences** for new property matches

### ✅ Supporting APIs
- **GET /api/amenities** - Retrieve all available amenities with category grouping
- **Health check** endpoint with comprehensive system status

### ✅ Performance & Quality
- **Database Indexes** for optimized query performance
- **Zod Validation** for robust parameter validation
- **TypeScript** for type safety
- **Error Handling** with clear error messages
- **Caching** headers for improved performance
- **Comprehensive Documentation** and testing guides

## 📁 Project Structure

```
├── app/
│   └── api/
│       ├── amenities/
│       │   └── route.ts                    # Amenities API
│       ├── properties/
│       │   └── search/
│       │       └── route.ts               # Main search API
│       ├── user/
│       │   └── saved-searches/
│       │       ├── route.ts               # Saved searches CRUD
│       │       └── [id]/
│       │           └── route.ts           # Update/delete saved searches
│       └── health/
│           └── route.ts                  # Health check endpoint
├── lib/
│   ├── prisma.ts                         # Prisma client setup
│   ├── types.ts                          # TypeScript types and Zod schemas
│   ├── search-utils.ts                   # Search utility functions
│   ├── auth.ts                           # Authentication utilities
│   └── index.ts                          # Export all types for frontend
├── prisma/
│   ├── schema.prisma                     # Database schema
│   ├── seed.ts                           # Sample data generation
│   └── migrations/                        # Database migrations
├── docs/
│   ├── api-documentation.md               # Complete API documentation
│   └── testing-guide.md                  # Comprehensive testing guide
└── README.md
```

## 🛠 Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Database**: SQLite (development) / PostgreSQL (production)
- **ORM**: Prisma
- **Validation**: Zod
- **Authentication**: JWT
- **Language**: TypeScript
- **Styling**: Tailwind CSS

## 🚀 Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Environment Setup
```bash
cp .env.example .env.local
# Edit .env.local with your database URL and JWT secret
```

### 3. Database Setup
```bash
# Generate Prisma client
npm run db:generate

# Push schema to database (development)
npm run db:push

# Seed with sample data
npm run db:seed
```

### 4. Start Development Server
```bash
npm run dev
```

The API will be available at `http://localhost:3000/api`

## 📊 API Usage Examples

### Basic Property Search
```bash
curl "http://localhost:3000/api/properties/search?search=apartment&page=1&limit=12"
```

### Advanced Filtering
```bash
curl "http://localhost:3000/api/properties/search?propertyTypes=APARTMENT&bedrooms=2&minPrice=300000&maxPrice=500000&featured=true"
```

### Sorting and Pagination
```bash
curl "http://localhost:3000/api/properties/search?sort=price-asc&page=2&limit=6"
```

### Get Amenities
```bash
curl "http://localhost:3000/api/amenities"
```

## 🔐 Authentication

The system uses JWT-based authentication for saved searches:

1. Obtain a JWT token from your authentication endpoint
2. Include it in requests: `Authorization: Bearer <token>`
3. Use the token to access saved searches endpoints

## 📈 Performance Optimizations

### Database Indexes
- Price range queries: `properties.price`
- Category filtering: `properties.category`, `properties.propertyType`
- Location search: `properties.location`
- Bedroom/bathroom filters: `properties.bedrooms`, `properties.bathrooms`
- Featured and status: `properties.featured`, `properties.status`
- Area ranges: `properties.area`
- Sorting: `properties.createdAt` (DESC)
- Composite indexes for common combinations

### Response Caching
- Search results: 60 seconds cache
- Amenities: 1 hour cache (rarely changes)
- Stale-while-revalidate for improved UX

### Query Optimization
- Parallel execution of count and data queries
- Eager loading of relations (agent, images, amenities)
- Efficient pagination with skip/take

## 🧪 Testing

### Run Test Suite
```bash
# Follow the comprehensive testing guide in docs/testing-guide.md
# Includes 50+ test scenarios covering all functionality
```

### Load Testing
```bash
# Apache Bench for performance testing
ab -n 100 -c 10 "http://localhost:3000/api/properties/search"
```

## 📚 API Documentation

Complete API documentation is available in `docs/api-documentation.md` including:
- All endpoint specifications
- Request/response examples
- Error handling
- TypeScript types
- Frontend integration examples

## 🔧 Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint

# Database commands
npm run db:generate  # Generate Prisma client
npm run db:push      # Push schema to database
npm run db:migrate   # Run database migrations
npm run db:seed      # Seed database with sample data
npm run db:studio    # Open Prisma Studio
npm run db:reset     # Reset database
```

## 📋 Sample Data

The seed script creates:
- **5 Properties**: Apartments, houses, villas, offices, studios
- **6 Amenities**: Pool, parking, gym, AC, security, balcony
- **2 Users**: 1 regular user, 1 agent
- **2 Saved Searches**: Example search configurations

Test credentials:
- Regular user: `john.doe@example.com` / `password123`
- Agent user: `jane.agent@example.com` / `password123`

## 🎯 Acceptance Criteria Met

✅ **Core Search API**
- [x] GET /api/properties/search with all query parameters
- [x] Text search across title, description, location
- [x] Price range filtering
- [x] Property type and category filtering
- [x] Location, bedroom, bathroom filtering
- [x] Area range filtering
- [x] Amenities multiple selection (AND logic)
- [x] Featured property filtering
- [x] Multiple sorting options
- [x] Pagination with hasMore flag

✅ **Validation & Error Handling**
- [x] Zod validation for all parameters
- [x] Clear error messages for invalid inputs
- [x] Empty results handled gracefully
- [x] 400/401/404/500 status codes

✅ **Performance**
- [x] Database indexes applied
- [x] Response times < 200ms
- [x] Caching headers implemented
- [x] Optimized database queries

✅ **Saved Searches**
- [x] Full CRUD operations
- [x] Authentication with JWT
- [x] User ownership validation
- [x] Notification preferences

✅ **Documentation & Testing**
- [x] Comprehensive API documentation
- [x] TypeScript types exported
- [x] Testing guide with 50+ scenarios
- [x] Sample data for development

## 🚀 Next Steps

1. **Frontend Integration**: Build React components to consume these APIs
2. **Real-time Notifications**: Implement WebSocket or SSE for saved search alerts
3. **Full-text Search**: Integrate Elasticsearch for advanced text search
4. **Analytics**: Add search behavior tracking and insights
5. **Caching Layer**: Implement Redis for improved performance
6. **Geospatial Search**: Add location-based radius search
7. **Image Search**: Implement image recognition and similarity search

## 📞 Support

For questions or issues:
1. Check the comprehensive documentation in `docs/`
2. Review the testing guide for usage examples
3. Examine the TypeScript types in `lib/types.ts`
4. Test with the provided sample data

---

**Phase 5 Complete** ✅ - Advanced Property Search & Filtering System successfully implemented with all acceptance criteria met.