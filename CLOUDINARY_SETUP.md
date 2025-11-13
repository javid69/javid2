# Cloudinary Image Upload & Management Setup Guide

## Overview

This document provides instructions for setting up and using the Cloudinary image upload and management system for the ASYLEN VENTURES Real Estate Platform.

## Phase 11 Completion Status

✅ **COMPLETED**

All Phase 11 deliverables have been implemented:

- Cloudinary SDK integration
- Environment variables configuration
- Image upload API endpoints
- Image delete API endpoint
- Image reorder API endpoint
- Cloudinary utility functions
- ImageUpload component with drag & drop
- ImageGallery component with lightbox
- File validation and error handling
- Progress tracking
- Responsive image transformations
- Security validation

## Prerequisites

1. **Cloudinary Account**
   - Sign up at [cloudinary.com](https://cloudinary.com/)
   - Navigate to Dashboard to get credentials

## Environment Variables Setup

1. **Copy the environment template:**
   ```bash
   cp .env.example .env
   ```

2. **Get your Cloudinary credentials:**
   - Log in to your Cloudinary account
   - Go to Dashboard
   - Copy the following values:
     - Cloud name
     - API Key
     - API Secret

3. **Create an upload preset:**
   - Go to Settings → Upload
   - Scroll to "Upload presets"
   - Click "Add upload preset"
   - Set:
     - Preset name: `asylen_ventures_preset` (or your choice)
     - Signing mode: Unsigned (for client-side uploads)
     - Folder: Leave empty (handled dynamically)
     - Save the preset

4. **Update your .env file:**
   ```env
   NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME="your-cloud-name-here"
   CLOUDINARY_API_KEY="your-api-key-here"
   CLOUDINARY_API_SECRET="your-api-secret-here"
   NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET="asylen_ventures_preset"
   ```

## Folder Structure

Images are organized in Cloudinary as follows:

```
asylen-ventures/
├── properties/
│   ├── {propertyId}/
│   │   ├── image1.jpg
│   │   ├── image2.jpg
│   │   └── ...
├── avatars/
│   ├── user-avatar1.jpg
│   └── ...
├── floor-plans/
│   └── ...
└── documents/
    └── ...
```

## API Endpoints

### 1. Upload Image
**POST** `/api/upload`

Upload a single image to Cloudinary.

**Request:**
- Method: POST
- Content-Type: multipart/form-data
- Body:
  - `file`: Image file (required)
  - `folder`: Folder type - "properties", "avatars", "floor-plans", or "documents" (optional)
  - `propertyId`: Property ID for organizing property images (optional)

**Response:**
```json
{
  "url": "https://res.cloudinary.com/...",
  "publicId": "asylen-ventures/properties/123/abc123",
  "width": 1920,
  "height": 1080,
  "bytes": 245678,
  "format": "jpg",
  "order": 0
}
```

**Validation:**
- Max file size: 5MB
- Allowed formats: JPG, JPEG, PNG, WEBP
- Requires authentication

### 2. Delete Image
**DELETE** `/api/upload/[publicId]`

Delete an image from Cloudinary.

**Request:**
- Method: DELETE
- URL: `/api/upload/{encodedPublicId}`

**Response:**
```json
{
  "success": true
}
```

**Notes:**
- Public ID must be URL encoded
- Requires authentication
- Permanently deletes the image

### 3. Reorder Images
**POST** `/api/upload/reorder`

Update the order of images for a property.

**Request:**
- Method: POST
- Content-Type: application/json
- Body:
```json
{
  "propertyId": "property-123",
  "imageIds": ["id1", "id2", "id3"]
}
```

**Response:**
```json
{
  "success": true,
  "order": ["id1", "id2", "id3"]
}
```

## Components

### ImageUpload Component

A comprehensive image upload component with drag & drop support.

**Props:**
- `maxFiles`: Maximum number of files (default: 15)
- `maxSize`: Maximum file size in bytes (default: 5MB)
- `folder`: Upload folder type (default: "properties")
- `propertyId`: Property ID for organization (optional)
- `onUploadSuccess`: Callback when upload succeeds
- `onUploadError`: Callback when upload fails
- `initialImages`: Pre-existing images to display
- `multiple`: Allow multiple file selection (default: true)
- `className`: Additional CSS classes

**Example:**
```tsx
import { ImageUpload } from "@/components/ImageUpload";
import { ImageData } from "@/lib/types";

function PropertyForm() {
  const [images, setImages] = useState<ImageData[]>([]);

  return (
    <ImageUpload
      maxFiles={15}
      folder="properties"
      propertyId="property-123"
      onUploadSuccess={setImages}
      initialImages={images}
      multiple={true}
    />
  );
}
```

**Features:**
- Drag and drop support
- Click to browse files
- Multiple file selection
- File preview thumbnails
- Progress bar for each upload
- File size validation
- File type validation
- Remove uploaded images
- Error handling with retry

### ImageGallery Component

Display and manage uploaded images with lightbox functionality.

**Props:**
- `images`: Array of ImageData objects
- `onDelete`: Callback when image is deleted
- `onReorder`: Callback when images are reordered
- `className`: Additional CSS classes
- `showControls`: Show edit/delete controls (default: true)

**Example:**
```tsx
import { ImageGallery } from "@/components/ImageGallery";
import { ImageData } from "@/lib/types";

function PropertyImages({ images }: { images: ImageData[] }) {
  const handleDelete = (publicId: string) => {
    // Handle deletion
  };

  return (
    <ImageGallery
      images={images}
      onDelete={handleDelete}
      showControls={true}
    />
  );
}
```

**Features:**
- Grid layout display
- Lightbox viewer
- Image navigation (prev/next)
- Copy URL to clipboard
- Delete with confirmation
- Image information overlay
- Responsive design
- Lazy loading

## Utility Functions

### Upload Functions

```typescript
import {
  uploadImage,
  uploadMultipleImages,
  deleteImage,
  reorderImages,
} from "@/lib/cloudinary-utils";

// Upload single image
const image = await uploadImage(file, {
  folder: "properties",
  propertyId: "123",
});

// Upload multiple images with progress
const images = await uploadMultipleImages(
  files,
  { folder: "properties" },
  (progress, fileIndex) => {
    console.log(`File ${fileIndex}: ${progress}%`);
  }
);

// Delete image
await deleteImage("asylen-ventures/properties/123/abc");

// Reorder images
await reorderImages("property-123", ["id1", "id2", "id3"]);
```

### Transformation Functions

```typescript
import {
  getThumbnailUrl,
  getListViewUrl,
  getDetailViewUrl,
  getGalleryUrl,
  getAvatarUrl,
  getFloorPlanUrl,
} from "@/lib/cloudinary-utils";

// Get transformed URLs
const thumbnail = getThumbnailUrl(publicId); // 300x250
const listView = getListViewUrl(publicId); // 500x350
const detail = getDetailViewUrl(publicId); // 1200x800
const gallery = getGalleryUrl(publicId); // 800x600
const avatar = getAvatarUrl(publicId); // 150x150 circular
const floorPlan = getFloorPlanUrl(publicId); // 600x800
```

### Validation Functions

```typescript
import { validateFile, formatBytes } from "@/lib/cloudinary-utils";

// Validate file
const validation = validateFile(file, 5 * 1024 * 1024);
if (!validation.valid) {
  console.error(validation.error);
}

// Format file size
const sizeStr = formatBytes(1024 * 1024); // "1 MB"
```

## Image Transformations

All images are automatically optimized with Cloudinary transformations:

### Property Images
- **Thumbnail**: 300×250, fill, auto format, auto quality
- **List View**: 500×350, fill, auto format, auto quality
- **Detail View**: 1200×800, fill, auto format, auto quality
- **Gallery**: 800×600, fill, auto format, auto quality

### User Avatars
- **Size**: 150×150
- **Shape**: Circular (r_max)
- **Quality**: 80
- **Format**: Auto (WebP for modern browsers)

### Floor Plans
- **Size**: 600×800
- **Mode**: Fit (maintain aspect ratio)
- **Quality**: 85
- **Format**: Auto

## Security

The implementation includes several security measures:

1. **Authentication Required**: All uploads require a valid session
2. **File Type Validation**: Only image files (JPG, PNG, WEBP) allowed
3. **File Size Validation**: Maximum 5MB per file
4. **Server-Side Validation**: All validation is performed on the backend
5. **Rate Limiting**: Cloudinary account limits apply
6. **Secure URLs**: All images served via HTTPS
7. **Public ID Storage**: Store public IDs for secure deletion

## Testing

A test page is available at `/test-upload` (when logged in) to test all functionality:

1. Start the development server:
   ```bash
   npm run dev
   ```

2. Navigate to: `http://localhost:3000/test-upload`

3. Test the following:
   - Single image upload
   - Multiple image upload
   - Drag and drop
   - File validation errors
   - Progress tracking
   - Image gallery
   - Image deletion
   - URL copying
   - Lightbox viewer

## Error Handling

The system includes comprehensive error handling:

### Client-Side Errors
- File too large
- Invalid file type
- Upload failed
- Network errors
- Validation errors

All errors display user-friendly toast notifications.

### Server-Side Errors
- Unauthorized (401)
- Bad request (400)
- Server error (500)

All errors return JSON responses with error messages.

## Usage in Property Forms

To integrate image upload in property forms:

```tsx
"use client";

import { useState } from "react";
import { ImageUpload } from "@/components/ImageUpload";
import { ImageGallery } from "@/components/ImageGallery";
import { type ImageData } from "@/lib/types";

export function PropertyForm() {
  const [images, setImages] = useState<ImageData[]>([]);

  const handleSubmit = async (formData: FormData) => {
    // Include image URLs in form submission
    const imageUrls = images.map((img) => img.url);
    formData.append("images", JSON.stringify(imageUrls));
    
    // Submit form...
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Other form fields... */}
      
      <div>
        <h3>Property Images</h3>
        <ImageUpload
          maxFiles={15}
          folder="properties"
          propertyId={propertyId}
          onUploadSuccess={setImages}
          initialImages={images}
          multiple={true}
        />
      </div>

      {images.length > 0 && (
        <div>
          <h3>Uploaded Images</h3>
          <ImageGallery
            images={images}
            onDelete={(publicId) => {
              setImages((prev) =>
                prev.filter((img) => img.publicId !== publicId)
              );
            }}
            showControls={true}
          />
        </div>
      )}

      <button type="submit">Save Property</button>
    </form>
  );
}
```

## Performance Optimization

The implementation includes several performance optimizations:

1. **Automatic Format Conversion**: WebP for modern browsers
2. **Automatic Quality Adjustment**: Cloudinary optimizes quality
3. **Lazy Loading**: Images load as they enter viewport
4. **CDN Delivery**: All images served via Cloudinary CDN
5. **Responsive Images**: Multiple sizes generated automatically
6. **Image Compression**: Automatic compression during upload
7. **Caching**: CDN caching headers included

## Monitoring

Monitor your Cloudinary usage:

1. Log in to Cloudinary Dashboard
2. View usage statistics:
   - Storage used
   - Bandwidth used
   - Transformations used
3. Set up alerts for quota limits
4. Review image analytics

## Troubleshooting

### Common Issues

**Upload fails with "Unauthorized"**
- Ensure user is logged in
- Check authentication configuration

**Upload fails with "Invalid file format"**
- Verify file is JPG, PNG, or WEBP
- Check file extension

**Upload fails with "File too large"**
- Compress image before upload
- Ensure file is under 5MB

**Images not displaying**
- Verify environment variables are set
- Check Cloudinary cloud name is correct
- Verify public ID is correct

**Transformations not working**
- Check transformation syntax
- Verify Cloudinary URL format
- Review Cloudinary dashboard for errors

## Next Steps

1. **Integrate with Property Forms**: Add ImageUpload to property creation/editing forms
2. **Integrate with User Profile**: Add avatar upload to profile settings
3. **Add Image Cropping**: Implement client-side image cropping
4. **Add EXIF Removal**: Ensure privacy by removing metadata
5. **Add Bulk Operations**: Implement bulk delete and reorder
6. **Add Image Optimization UI**: Show optimization suggestions
7. **Add Analytics**: Track upload success rates and errors

## Resources

- [Cloudinary Documentation](https://cloudinary.com/documentation)
- [Cloudinary Node.js SDK](https://cloudinary.com/documentation/node_integration)
- [Image Transformation Reference](https://cloudinary.com/documentation/image_transformations)
- [Upload API Reference](https://cloudinary.com/documentation/upload_images)

## Support

For issues or questions:
1. Check the troubleshooting section above
2. Review Cloudinary documentation
3. Check browser console for errors
4. Contact development team
