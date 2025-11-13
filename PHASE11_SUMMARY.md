# Phase 11: Cloudinary Image Upload & Management - Quick Start

## 🚀 Quick Setup Guide

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Cloudinary

1. **Create Cloudinary Account**: Visit [cloudinary.com](https://cloudinary.com/) and sign up

2. **Get Your Credentials**:
   - Go to Dashboard
   - Copy: Cloud Name, API Key, API Secret

3. **Create Upload Preset**:
   - Settings → Upload → Upload presets
   - Add preset: Name it `asylen_ventures_preset`
   - Set to "Unsigned"
   - Save

4. **Update .env File**:
   ```env
   NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME="your-cloud-name"
   CLOUDINARY_API_KEY="your-api-key"
   CLOUDINARY_API_SECRET="your-api-secret"
   NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET="asylen_ventures_preset"
   ```

### 3. Generate Database Schema
```bash
npm run db:generate
npm run db:push
```

### 4. Test the Integration
```bash
npm run dev
```

Visit: `http://localhost:3000/test-upload`

---

## 📦 What's Included

### Components
- **ImageUpload** - Full-featured upload with drag & drop
- **ImageGallery** - Display and manage uploaded images
- **PropertyImageForm** - Property image management
- **AvatarUpload** - User avatar upload

### API Endpoints
- `POST /api/upload` - Upload images
- `DELETE /api/upload/[publicId]` - Delete images
- `POST /api/upload/reorder` - Reorder images

### Utilities
- Image transformations (thumbnail, list, detail, gallery)
- File validation and formatting
- Upload/delete/reorder functions

### Hooks
- `useImageUpload` - Complete upload management

---

## 🎯 Quick Integration Examples

### Property Images
```tsx
import { ImageUpload } from "@/components/ImageUpload";

<ImageUpload
  maxFiles={15}
  folder="properties"
  propertyId={propertyId}
  onUploadSuccess={setImages}
/>
```

### User Avatar
```tsx
import { AvatarUpload } from "@/components/forms/AvatarUpload";

<AvatarUpload
  currentAvatar={user.image}
  onUploadSuccess={handleAvatarUpdate}
/>
```

### Display Gallery
```tsx
import { ImageGallery } from "@/components/ImageGallery";

<ImageGallery
  images={images}
  onDelete={handleDelete}
  showControls={true}
/>
```

---

## 📚 Documentation

- **Setup Guide**: See `CLOUDINARY_SETUP.md`
- **Integration Examples**: See `INTEGRATION_EXAMPLES.md`
- **Completion Report**: See `PHASE11_COMPLETION.md`

---

## ✅ Features

- ✅ Drag & drop file upload
- ✅ Multiple file selection
- ✅ Real-time progress tracking
- ✅ File validation (type & size)
- ✅ Image transformations (thumbnails, responsive)
- ✅ Gallery with lightbox viewer
- ✅ Image deletion with confirmation
- ✅ Copy URL to clipboard
- ✅ Responsive design
- ✅ TypeScript support
- ✅ Error handling with retry
- ✅ Toast notifications

---

## 🔒 Security

- Authentication required for all uploads
- File type validation (JPG, PNG, WEBP only)
- Size limits (5MB default, configurable)
- Server-side validation
- Secure HTTPS URLs
- Public ID tracking for safe deletion

---

## 🎨 Image Transformations

| Type | Size | Usage |
|------|------|-------|
| Thumbnail | 300×250 | Property cards |
| List View | 500×350 | Property listings |
| Detail View | 1200×800 | Property details |
| Gallery | 800×600 | Image gallery |
| Avatar | 150×150 | User profiles |
| Floor Plan | 600×800 | Floor plans |

All images automatically optimized with:
- WebP format (modern browsers)
- Auto quality adjustment
- CDN delivery
- Lazy loading

---

## 🧪 Testing

Test page available at `/test-upload`:
- Upload single/multiple images
- Test drag & drop
- Test file validation
- Test gallery features
- Test deletion
- Test transformations

---

## 📞 Support

For questions or issues:
1. Check `CLOUDINARY_SETUP.md` troubleshooting section
2. Review `INTEGRATION_EXAMPLES.md` for code examples
3. Verify environment variables are set correctly
4. Check browser console for errors

---

## 🎉 Status: ✅ COMPLETE

Phase 11 implementation is complete and ready for integration!
