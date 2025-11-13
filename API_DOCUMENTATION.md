# ASYLEN VENTURES Real Estate Platform - API Documentation

## Overview

This document describes all the API endpoints for the ASYLEN VENTURES Real Estate Platform. All endpoints follow REST conventions and return JSON responses.

## Authentication

Most endpoints require authentication using Bearer tokens in the Authorization header:

```
Authorization: Bearer <token>
```

For development, you can use the user's email as a temporary token.

## Response Format

### Success Response
```json
{
  "data": { ... },
  "pagination": {
    "page": 1,
    "limit": 12,
    "total": 100,
    "totalPages": 9,
    "hasMore": true
  }
}
```

### Error Response
```json
{
  "error": "Error message",
  "code": "ERROR_CODE"
}
```

## Endpoints

### Properties

#### GET /api/properties
Fetch all properties with pagination and filtering.

**Query Parameters:**
- `page` (number, default: 1) - Page number
- `limit` (number, default: 12, max: 100) - Items per page
- `status` (string, default: "ACTIVE") - Property status filter

**Response:**
```json
{
  "properties": [
    {
      "id": "property_id",
      "title": "Beautiful House",
      "description": "A lovely home...",
      "price": 500000,
      "bedrooms": 3,
      "bathrooms": 2,
      "area": 1500.5,
      "propertyType": "HOUSE",
      "category": "RESIDENTIAL",
      "location": "123 Main St",
      "latitude": 40.7128,
      "longitude": -74.0060,
      "videoUrl": "https://example.com/video.mp4",
      "floorPlanUrl": "https://example.com/floor.png",
      "status": "ACTIVE",
      "featured": false,
      "viewCount": 42,
      "agentId": "agent_id",
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z",
      "agent": {
        "id": "agent_id",
        "name": "John Doe",
        "email": "john@example.com",
        "avatar": "https://example.com/avatar.jpg",
        "phone": "+1234567890"
      },
      "images": [
        {
          "id": "image_id",
          "url": "https://example.com/image.jpg",
          "displayOrder": 0
        }
      ],
      "amenities": [
        {
          "amenity": {
            "id": "amenity_id",
            "name": "Pool",
            "icon": "pool",
            "category": "Outdoor"
          }
        }
      ],
      "_count": {
        "inquiries": 5,
        "viewingSchedules": 2
      }
    }
  ],
  "pagination": { ... }
}
```

#### GET /api/properties/featured
Return featured properties.

**Query Parameters:**
- `limit` (number, default: 10, max: 20) - Maximum number of properties

**Response:**
```json
{
  "properties": [ ... ],
  "count": 5
}
```

#### POST /api/properties
Create a new property. Requires AGENT or ADMIN role.

**Authorization:** AGENT or ADMIN

**Request Body:**
```json
{
  "title": "Beautiful House",
  "description": "A lovely home with great features...",
  "price": 500000,
  "bedrooms": 3,
  "bathrooms": 2,
  "area": 1500.5,
  "propertyType": "HOUSE",
  "category": "RESIDENTIAL",
  "location": "123 Main St",
  "latitude": 40.7128,
  "longitude": -74.0060,
  "videoUrl": "https://example.com/video.mp4",
  "floorPlanUrl": "https://example.com/floor.png"
}
```

**Response:** 201 Created with the full property object

#### GET /api/properties/[id]
Get detailed information about a specific property.

**Response:**
```json
{
  "id": "property_id",
  // ... all property fields
  "agent": { ... },
  "images": [ ... ],
  "amenities": [ ... ],
  "similarProperties": [
    {
      "id": "similar_property_id",
      "title": "Similar House",
      "agent": { ... },
      "images": [ ... ]
    }
  ],
  "_count": { ... }
}
```

#### PUT /api/properties/[id]
Update a property. Agents can update their own properties, Admins can update any.

**Authorization:** AGENT (own property) or ADMIN (any property)

**Request Body:** Same as POST, but all fields are optional

**Response:** Updated property object

#### DELETE /api/properties/[id]
Delete a property and all related data. Agents can delete their own properties, Admins can delete any.

**Authorization:** AGENT (own property) or ADMIN (any property)

**Response:** 204 No Content

### Property Images

#### POST /api/properties/[id]/images
Upload multiple images to a property.

**Authorization:** AGENT (own property) or ADMIN (any property)

**Request:** multipart/form-data with `files` field (array of images)

**Response:** 201 Created with array of image objects

#### PUT /api/properties/[id]/images
Add image URL directly to property (alternative to upload).

**Authorization:** AGENT (own property) or ADMIN (any property)

**Request Body:**
```json
{
  "url": "https://example.com/image.jpg",
  "publicId": "cloudinary_public_id",
  "displayOrder": 0
}
```

#### DELETE /api/properties/[id]/images/[imageId]
Delete a specific image from a property.

**Authorization:** AGENT (own property) or ADMIN (any property)

**Response:** 204 No Content

### Property Amenities

#### GET /api/properties/[id]/amenities
Get all amenities for a specific property.

**Response:**
```json
{
  "amenities": [
    {
      "id": "amenity_id",
      "name": "Pool",
      "icon": "pool",
      "category": "Outdoor",
      "description": "Swimming pool"
    }
  ]
}
```

#### POST /api/properties/[id]/amenities
Add an amenity to a property.

**Authorization:** AGENT (own property) or ADMIN (any property)

**Request Body:**
```json
{
  "amenityId": "amenity_id"
}
```

#### DELETE /api/properties/[id]/amenities/[amenityId]
Remove an amenity from a property.

**Authorization:** AGENT (own property) or ADMIN (any property)

**Response:** 204 No Content

### Amenities

#### GET /api/amenities
Get all available amenities in the system.

**Query Parameters:**
- `category` (string, optional) - Filter by category

**Response:**
```json
{
  "amenities": [
    {
      "id": "amenity_id",
      "name": "Pool",
      "icon": "pool",
      "category": "Outdoor",
      "description": "Swimming pool"
    }
  ],
  "grouped": {
    "Outdoor": [
      {
        "id": "amenity_id",
        "name": "Pool",
        "icon": "pool",
        "category": "Outdoor",
        "description": "Swimming pool"
      }
    ]
  },
  "categories": ["Outdoor", "Indoor", "Safety"],
  "count": 25
}
```

### User Profile

#### GET /api/user/profile
Get current user's profile information.

**Authorization:** Required

**Response:**
```json
{
  "id": "user_id",
  "email": "user@example.com",
  "name": "John Doe",
  "role": "AGENT",
  "avatar": "https://example.com/avatar.jpg",
  "phone": "+1234567890",
  "bio": "Real estate agent with 10 years experience",
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z",
  "_count": {
    "properties": 15,
    "inquiries": 42,
    "viewingSchedules": 8
  }
}
```

#### PUT /api/user/profile
Update current user's profile.

**Authorization:** Required

**Request Body:**
```json
{
  "name": "John Smith",
  "avatar": "https://example.com/new-avatar.jpg",
  "phone": "+1234567890",
  "bio": "Updated bio text"
}
```

### File Uploads

#### POST /api/uploads
Upload a file to Cloudinary.

**Authorization:** Required

**Request:** multipart/form-data with `file` field and optional `folder` field

**Response:** 201 Created
```json
{
  "url": "https://example.com/uploaded-image.jpg",
  "publicId": "cloudinary_public_id",
  "width": 1920,
  "height": 1080,
  "format": "jpg",
  "folder": "properties/property_id",
  "uploadedBy": "user_id"
}
```

## Error Codes

- `VALIDATION_ERROR` - Request validation failed (400)
- `UNAUTHORIZED` - Authentication required (401)
- `FORBIDDEN` - Insufficient permissions (403)
- `PROPERTY_NOT_FOUND` - Property doesn't exist (404)
- `AMENITY_NOT_FOUND` - Amenity doesn't exist (404)
- `IMAGE_NOT_FOUND` - Image doesn't exist (404)
- `USER_NOT_FOUND` - User doesn't exist (404)
- `INVALID_FILE_TYPE` - File type not allowed (400)
- `FILE_TOO_LARGE` - File exceeds size limit (400)
- `AMENITY_ALREADY_EXISTS` - Amenity already added to property (400)
- `INTERNAL_ERROR` - Server error (500)

## Enums

### PropertyType
- `HOUSE`
- `APARTMENT`
- `CONDO`
- `TOWNHOUSE`
- `VILLA`
- `STUDIO`
- `PENTHOUSE`

### PropertyCategory
- `RESIDENTIAL`
- `COMMERCIAL`
- `LUXURY`
- `INVESTMENT`

### PropertyStatus
- `ACTIVE`
- `INACTIVE`
- `SOLD`
- `PENDING`

### UserRole
- `USER`
- `AGENT`
- `ADMIN`

## Rate Limiting

Rate limiting is prepared for future implementation. Current limits are:
- 100 requests per minute per IP
- 1000 requests per hour per authenticated user

## Pagination

All list endpoints support pagination with:
- `page` (default: 1) - Page number
- `limit` (default: 12, max: 100) - Items per page

Pagination metadata is included in responses:
```json
{
  "pagination": {
    "page": 1,
    "limit": 12,
    "total": 100,
    "totalPages": 9,
    "hasMore": true
  }
}
```