# Property Search API Testing Guide

This document provides comprehensive testing instructions for the Phase 5 Property Search & Filtering System.

## Setup Instructions

### 1. Environment Setup

```bash
# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local

# Add the following to .env.local:
DATABASE_URL="postgresql://username:password@localhost:5432/asylen_ventures?schema=public"
JWT_SECRET="your-super-secret-jwt-key-here"
NEXT_PUBLIC_API_URL="http://localhost:3000/api"
```

### 2. Database Setup

```bash
# Generate Prisma client
npm run db:generate

# Push schema to database (for development)
npm run db:push

# Or run migrations (for production)
npm run db:migrate

# Seed the database with sample data
npm run db:seed
```

### 3. Start Development Server

```bash
npm run dev
```

The API will be available at `http://localhost:3000/api`

## Testing Scenarios

### 1. Basic Search Tests

#### Test 1.1: Empty Search (Get All Properties)
```bash
curl -X GET "http://localhost:3000/api/properties/search"
```
*Expected:* Return first 12 active properties, sorted by newest

#### Test 1.2: Text Search
```bash
curl -X GET "http://localhost:3000/api/properties/search?search=luxury"
```
*Expected:* Properties containing "luxury" in title, description, or location

#### Test 1.3: Location Search
```bash
curl -X GET "http://localhost:3000/api/properties/search?location=downtown"
```
*Expected:* Properties in downtown area

### 2. Price Filtering Tests

#### Test 2.1: Minimum Price
```bash
curl -X GET "http://localhost:3000/api/properties/search?minPrice=300000"
```
*Expected:* Properties priced $300,000 and above

#### Test 2.2: Price Range
```bash
curl -X GET "http://localhost:3000/api/properties/search?minPrice=200000&maxPrice=500000"
```
*Expected:* Properties between $200,000 and $500,000

#### Test 2.3: Maximum Price Only
```bash
curl -X GET "http://localhost:3000/api/properties/search?maxPrice=400000"
```
*Expected:* Properties $400,000 and below

### 3. Property Type Tests

#### Test 3.1: Single Property Type
```bash
curl -X GET "http://localhost:3000/api/properties/search?propertyTypes=APARTMENT"
```
*Expected:* Only apartments

#### Test 3.2: Multiple Property Types
```bash
curl -X GET "http://localhost:3000/api/properties/search?propertyTypes=APARTMENT&propertyTypes=HOUSE"
```
*Expected:* Apartments and houses

### 4. Category Tests

#### Test 4.1: For Sale Properties
```bash
curl -X GET "http://localhost:3000/api/properties/search?categories=SALE"
```
*Expected:* Properties for sale

#### Test 4.2: Rental Properties
```bash
curl -X GET "http://localhost:3000/api/properties/search?categories=RENT"
```
*Expected:* Rental properties

### 5. Bedroom/Bathroom Tests

#### Test 5.1: Specific Bedroom Count
```bash
curl -X GET "http://localhost:3000/api/properties/search?bedrooms=2"
```
*Expected:* 2-bedroom properties

#### Test 5.2: Multiple Bedroom Options
```bash
curl -X GET "http://localhost:3000/api/properties/search?bedrooms=2&bedrooms=3&bedrooms=4"
```
*Expected:* Properties with 2, 3, or 4 bedrooms

#### Test 5.3: Bathroom Filter
```bash
curl -X GET "http://localhost:3000/api/properties/search?bathrooms=2"
```
*Expected:* Properties with 2 bathrooms

### 6. Area Range Tests

#### Test 6.1: Minimum Area
```bash
curl -X GET "http://localhost:3000/api/properties/search?minArea=1000"
```
*Expected:* Properties 1,000 sqft and above

#### Test 6.2: Area Range
```bash
curl -X GET "http://localhost:3000/api/properties/search?minArea=800&maxArea=1500"
```
*Expected:* Properties between 800-1,500 sqft

### 7. Featured Properties Test

```bash
curl -X GET "http://localhost:3000/api/properties/search?featured=true"
```
*Expected:* Only featured properties

### 8. Sorting Tests

#### Test 8.1: Sort by Price (Low to High)
```bash
curl -X GET "http://localhost:3000/api/properties/search?sort=price-asc"
```
*Expected:* Properties sorted by price ascending

#### Test 8.2: Sort by Price (High to Low)
```bash
curl -X GET "http://localhost:3000/api/properties/search?sort=price-desc"
```
*Expected:* Properties sorted by price descending

#### Test 8.3: Sort by Featured
```bash
curl -X GET "http://localhost:3000/api/properties/search?sort=featured"
```
*Expected:* Featured properties first, then by newest

### 9. Pagination Tests

#### Test 9.1: Page 2
```bash
curl -X GET "http://localhost:3000/api/properties/search?page=2"
```
*Expected:* Second page of results

#### Test 9.2: Custom Limit
```bash
curl -X GET "http://localhost:3000/api/properties/search?limit=5"
```
*Expected:* 5 results per page

#### Test 9.3: Pagination with Filters
```bash
curl -X GET "http://localhost:3000/api/properties/search?propertyTypes=APARTMENT&page=1&limit=3"
```
*Expected:* First 3 apartments with pagination info

### 10. Complex Combined Filters

#### Test 10.1: Dream Apartment Search
```bash
curl -X GET "http://localhost:3000/api/properties/search?search=apartment&propertyTypes=APARTMENT&bedrooms=2&minPrice=300000&maxPrice=500000&featured=true&sort=newest"
```
*Expected:* Featured 2-bedroom apartments, $300k-$500k, sorted by newest

#### Test 10.2: Family Home Search
```bash
curl -X GET "http://localhost:3000/api/properties/search?propertyTypes=HOUSE&bedrooms=3&bathrooms=2&minArea=1500&categories=SALE&sort=price-asc"
```
*Expected:* 3-bed/2-bath houses, 1,500+ sqft, for sale, sorted by price

### 11. Error Handling Tests

#### Test 11.1: Invalid Sort Parameter
```bash
curl -X GET "http://localhost:3000/api/properties/search?sort=invalid"
```
*Expected:* 400 error with validation details

#### Test 11.2: Invalid Price
```bash
curl -X GET "http://localhost:3000/api/properties/search?minPrice=-100"
```
*Expected:* 400 error with validation details

#### Test 11.3: Page Out of Range
```bash
curl -X GET "http://localhost:3000/api/properties/search?page=999"
```
*Expected:* Empty results array with proper pagination

### 12. Amenities API Test

#### Test 12.1: Get All Amenities
```bash
curl -X GET "http://localhost:3000/api/amenities"
```
*Expected:* All available amenities, grouped by category

#### Test 12.2: Get Amenities by Category
```bash
curl -X GET "http://localhost:3000/api/amenities?category=recreation"
```
*Expected:* Only recreation amenities

### 13. Saved Searches Tests (Requires Authentication)

#### Test 13.1: Get Authentication Token
```bash
# First, login to get a token (you'll need to implement this endpoint)
curl -X POST "http://localhost:3000/api/auth/login" \
  -H "Content-Type: application/json" \
  -d '{"email": "john.doe@example.com", "password": "password123"}'
```

#### Test 13.2: Get Saved Searches
```bash
curl -X GET "http://localhost:3000/api/user/saved-searches" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

#### Test 13.3: Create Saved Search
```bash
curl -X POST "http://localhost:3000/api/user/saved-searches" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "name": "My Dream Home",
    "filters": {
      "propertyTypes": ["HOUSE"],
      "bedrooms": 3,
      "minPrice": 400000,
      "maxPrice": 600000,
      "sort": "newest"
    },
    "notify": true
  }'
```

## Performance Testing

### Load Testing with Apache Bench

```bash
# Test basic search performance
ab -n 100 -c 10 "http://localhost:3000/api/properties/search"

# Test complex filter performance
ab -n 50 -c 5 "http://localhost:3000/api/properties/search?propertyTypes=APARTMENT&bedrooms=2&minPrice=300000&maxPrice=500000&featured=true"
```

### Expected Performance Metrics

- **Simple searches**: < 100ms response time
- **Complex filters**: < 200ms response time
- **Pagination**: Consistent performance regardless of page
- **Database queries**: Optimized with indexes

## Database Query Analysis

### Enable Query Logging

Add to your `.env.local`:
```
DATABASE_URL="postgresql://username:password@localhost:5432/asylen_ventures?schema=public&log=queries"
```

### Check Query Performance

```sql
-- Check if indexes are being used
EXPLAIN ANALYZE SELECT * FROM "properties" 
WHERE "price" >= 300000 AND "price" <= 500000 
AND "propertyType" = 'APARTMENT' 
AND "status" = 'ACTIVE' 
ORDER BY "createdAt" DESC 
LIMIT 12;
```

## Validation Checklist

- [ ] All API endpoints return 200 status for valid requests
- [ ] Invalid parameters return 400 with clear error messages
- [ ] Authentication returns 401 for missing/invalid tokens
- [ ] Pagination works correctly with hasMore flag
- [ ] Sorting works for all sort options
- [ ] Filters work individually and in combination
- [ ] Text search searches all specified fields
- [ ] Empty results return empty array with proper pagination
- [ ] Database indexes improve query performance
- [ ] Response times meet performance targets
- [ ] Error handling is consistent and informative

## Common Issues & Solutions

### Issue: Slow query performance
**Solution:** Check database indexes and query execution plan

### Issue: Array parameters not working
**Solution:** Ensure URL encoding for multiple values: `propertyTypes=APARTMENT&propertyTypes=HOUSE`

### Issue: Authentication failures
**Solution:** Verify JWT_SECRET is set and tokens are properly formatted

### Issue: Empty results for valid filters
**Solution:** Check database has matching data and filters aren't too restrictive

## Next Steps

1. Implement frontend components to consume these APIs
2. Add real-time notifications for saved searches
3. Implement full-text search with Elasticsearch
4. Add analytics for search behavior
5. Implement caching strategies for frequently accessed data