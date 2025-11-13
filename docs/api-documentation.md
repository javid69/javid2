# Property Search API Documentation

## Overview

The ASYLEN VENTURES Real Estate Platform provides a comprehensive property search and filtering system with advanced query parameters, sorting options, and optimized database queries.

## Base URL

```
https://your-domain.com/api
```

## Authentication

Most endpoints are public, but saved searches require authentication using a Bearer token:

```
Authorization: Bearer <jwt_token>
```

## Endpoints

### 1. Property Search

**GET** `/properties/search`

Search and filter properties with multiple parameters.

#### Query Parameters

| Parameter | Type | Description | Example |
|-----------|------|-------------|---------|
| `search` | string | Search in title, description, location | `downtown apartment` |
| `minPrice` | number | Minimum price | `100000` |
| `maxPrice` | number | Maximum price | `500000` |
| `propertyTypes` | string\[\] | Property types (can be multiple) | `APARTMENT&propertyTypes=HOUSE` |
| `categories` | string\[\] | Property categories (can be multiple) | `RENT&categories=SALE` |
| `location` | string | Area/sector name | `Downtown` |
| `bedrooms` | number\[\] | Number of bedrooms (can be multiple) | `2&bedrooms=3` |
| `bathrooms` | number\[\] | Number of bathrooms (can be multiple) | `2` |
| `minArea` | number | Minimum area in sqft | `800` |
| `maxArea` | number | Maximum area in sqft | `2000` |
| `amenities` | string\[\] | Amenity IDs (all must match) | `amenity1&amenities=amenity2` |
| `featured` | boolean | Featured properties only | `true` |
| `sort` | string | Sort order: `newest`, `price-asc`, `price-desc`, `featured` | `price-asc` |
| `page` | number | Page number (default: 1) | `2` |
| `limit` | number | Results per page (default: 12, max: 50) | `24` |

#### Example Requests

```bash
# Basic search
curl "https://your-domain.com/api/properties/search?search=apartment&page=1&limit=12"

# Advanced filtering
curl "https://your-domain.com/api/properties/search?minPrice=200000&maxPrice=400000&propertyTypes=APARTMENT&bedrooms=2&sort=newest"

# Location-based search
curl "https://your-domain.com/api/properties/search?location=Downtown&featured=true&sort=featured"

# Area and amenities
curl "https://your-domain.com/api/properties/search?minArea=1000&maxArea=2000&amenities=pool&amenities=parking"
```

#### Response Format

```json
{
  "data": [
    {
      "id": "property_id",
      "title": "Modern Downtown Apartment",
      "description": "Beautiful 2-bedroom apartment...",
      "price": 350000,
      "address": "123 Main St",
      "location": "Downtown",
      "coordinates": "40.7128,-74.0060",
      "area": 1200,
      "bedrooms": 2,
      "bathrooms": 2,
      "propertyType": "APARTMENT",
      "category": "SALE",
      "featured": true,
      "status": "ACTIVE",
      "createdAt": "2024-01-15T10:30:00Z",
      "updatedAt": "2024-01-15T10:30:00Z",
      "agent": {
        "id": "agent_id",
        "firstName": "John",
        "lastName": "Doe",
        "email": "john@example.com",
        "phone": "+1234567890",
        "avatar": "https://example.com/avatar.jpg"
      },
      "images": [
        {
          "id": "image_id",
          "url": "https://example.com/property1.jpg",
          "caption": "Living Room",
          "sortOrder": 0
        }
      ],
      "amenities": [
        {
          "id": "amenity_id",
          "name": "Swimming Pool",
          "description": "Olympic-size pool",
          "icon": "pool",
          "category": "recreation"
        }
      ]
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 12,
    "total": 156,
    "totalPages": 13,
    "hasMore": true
  }
}
```

### 2. Get Amenities

**GET** `/amenities`

Get all available amenities for filtering.

#### Query Parameters

| Parameter | Type | Description | Example |
|-----------|------|-------------|---------|
| `category` | string | Filter by amenity category | `recreation` |

#### Response Format

```json
{
  "data": [
    {
      "id": "amenity_id",
      "name": "Swimming Pool",
      "description": "Olympic-size pool",
      "icon": "pool",
      "category": "recreation"
    }
  ],
  "grouped": {
    "recreation": [
      {
        "id": "amenity_id",
        "name": "Swimming Pool",
        "description": "Olympic-size pool",
        "icon": "pool",
        "category": "recreation"
      }
    ],
    "interior": [...]
  }
}
```

### 3. Saved Searches

#### Get Saved Searches

**GET** `/user/saved-searches`

Get user's saved searches (requires authentication).

#### Create Saved Search

**POST** `/user/saved-searches`

Create a new saved search (requires authentication).

**Request Body:**
```json
{
  "name": "Downtown Apartments",
  "filters": {
    "location": "Downtown",
    "propertyTypes": ["APARTMENT"],
    "minPrice": 200000,
    "maxPrice": 400000,
    "bedrooms": [2, 3]
  },
  "notify": true
}
```

#### Update Saved Search

**PUT** `/user/saved-searches/[id]`

Update an existing saved search (requires authentication).

**Request Body:**
```json
{
  "name": "Updated Search Name",
  "notify": false
}
```

#### Delete Saved Search

**DELETE** `/user/saved-searches/[id]`

Delete a saved search (requires authentication).

## Error Handling

All endpoints return consistent error responses:

```json
{
  "error": "Error type",
  "message": "Human-readable error message",
  "details": [
    {
      "field": "parameter_name",
      "message": "Specific error message"
    }
  ]
}
```

### Common HTTP Status Codes

- `200` - Success
- `201` - Created (for POST requests)
- `400` - Bad Request (invalid parameters)
- `401` - Unauthorized (authentication required)
- `404` - Not Found
- `500` - Internal Server Error

## Performance

- Search responses are cached for 60 seconds
- Amenities are cached for 1 hour
- Database indexes optimize common queries
- Response time target: < 200ms

## Rate Limiting

- Search endpoints: 100 requests per minute per IP
- Saved searches: 60 requests per minute per user

## TypeScript Types

```typescript
interface SearchFilters {
  search?: string
  minPrice?: number
  maxPrice?: number
  propertyTypes?: PropertyType[]
  categories?: PropertyCategory[]
  location?: string
  bedrooms?: number[]
  bathrooms?: number[]
  minArea?: number
  maxArea?: number
  amenities?: string[]
  featured?: boolean
  sort?: 'newest' | 'price-asc' | 'price-desc' | 'featured'
  page?: number
  limit?: number
}

type PropertyType = 'APARTMENT' | 'HOUSE' | 'VILLA' | 'COMMERCIAL' | 'OFFICE' | 'SHOP' | 'LAND' | 'STUDIO'
type PropertyCategory = 'RENT' | 'SALE' | 'SHORT_TERM'
```

## Examples

### Frontend Integration

```javascript
// Search properties
const searchProperties = async (filters) => {
  const params = new URLSearchParams()
  
  Object.entries(filters).forEach(([key, value]) => {
    if (Array.isArray(value)) {
      value.forEach(v => params.append(key, v))
    } else if (value !== undefined && value !== null) {
      params.append(key, value)
    }
  })
  
  const response = await fetch(`/api/properties/search?${params}`)
  return response.json()
}

// Usage
const results = await searchProperties({
  location: 'Downtown',
  propertyTypes: ['APARTMENT'],
  minPrice: 200000,
  maxPrice: 400000,
  sort: 'price-asc',
  page: 1,
  limit: 12
})
```

### Saved Search Management

```javascript
// Create saved search
const createSavedSearch = async (name, filters) => {
  const response = await fetch('/api/user/saved-searches', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({ name, filters, notify: true })
  })
  return response.json()
}
```