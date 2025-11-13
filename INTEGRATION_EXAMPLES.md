# Cloudinary Integration Examples

This document provides practical examples of how to integrate the Cloudinary image upload system into various parts of the ASYLEN VENTURES platform.

## Table of Contents

1. [Property Form Integration](#property-form-integration)
2. [User Profile Avatar](#user-profile-avatar)
3. [Image Gallery Display](#image-gallery-display)
4. [Floor Plan Upload](#floor-plan-upload)
5. [API Usage Examples](#api-usage-examples)
6. [Database Integration](#database-integration)

## Property Form Integration

### Complete Property Form with Image Upload

```tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ImageUpload } from "@/components/ImageUpload";
import { ImageGallery } from "@/components/ImageGallery";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { type ImageData } from "@/lib/types";
import toast from "react-hot-toast";

export function CreatePropertyForm() {
  const router = useRouter();
  const [images, setImages] = useState<ImageData[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (images.length === 0) {
      toast.error("Please upload at least one image");
      return;
    }

    setIsSubmitting(true);

    try {
      const formData = new FormData(e.currentTarget);
      
      // Add image data to form
      const imageUrls = images.map((img) => img.url);
      const imagePublicIds = images.map((img) => img.publicId);
      
      const propertyData = {
        title: formData.get("title"),
        description: formData.get("description"),
        price: Number(formData.get("price")),
        address: formData.get("address"),
        city: formData.get("city"),
        state: formData.get("state"),
        zipCode: formData.get("zipCode"),
        bedrooms: Number(formData.get("bedrooms")),
        bathrooms: Number(formData.get("bathrooms")),
        squareFeet: Number(formData.get("squareFeet")),
        propertyType: formData.get("propertyType"),
        images: imageUrls,
        imageData: images, // Full image metadata
      };

      const response = await fetch("/api/properties", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(propertyData),
      });

      if (!response.ok) {
        throw new Error("Failed to create property");
      }

      toast.success("Property created successfully");
      router.push("/dashboard/properties");
    } catch (error) {
      toast.error("Failed to create property");
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold mb-6">Property Details</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            name="title"
            label="Property Title"
            placeholder="Beautiful Family Home"
            required
          />
          
          <Input
            name="price"
            label="Price"
            type="number"
            placeholder="500000"
            required
          />
          
          <Input
            name="address"
            label="Address"
            placeholder="123 Main St"
            required
          />
          
          <Input
            name="city"
            label="City"
            placeholder="Los Angeles"
            required
          />
          
          <Input
            name="state"
            label="State"
            placeholder="CA"
            required
          />
          
          <Input
            name="zipCode"
            label="ZIP Code"
            placeholder="90001"
            required
          />
          
          <Input
            name="bedrooms"
            label="Bedrooms"
            type="number"
            placeholder="3"
            required
          />
          
          <Input
            name="bathrooms"
            label="Bathrooms"
            type="number"
            placeholder="2"
            required
          />
          
          <Input
            name="squareFeet"
            label="Square Feet"
            type="number"
            placeholder="2000"
            required
          />
          
          <select
            name="propertyType"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg"
            required
          >
            <option value="">Select Type</option>
            <option value="HOUSE">House</option>
            <option value="APARTMENT">Apartment</option>
            <option value="CONDO">Condo</option>
            <option value="TOWNHOUSE">Townhouse</option>
            <option value="LAND">Land</option>
            <option value="COMMERCIAL">Commercial</option>
          </select>
        </div>
        
        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Description
          </label>
          <textarea
            name="description"
            rows={4}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg"
            placeholder="Describe the property..."
            required
          />
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold mb-6">Property Images</h2>
        <ImageUpload
          maxFiles={15}
          folder="properties"
          onUploadSuccess={setImages}
          initialImages={images}
          multiple={true}
        />
        
        {images.length > 0 && (
          <div className="mt-6">
            <h3 className="text-lg font-semibold mb-4">
              Uploaded Images ({images.length})
            </h3>
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
      </div>

      <div className="flex justify-end gap-3">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.back()}
          disabled={isSubmitting}
        >
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting || images.length === 0}>
          {isSubmitting ? "Creating..." : "Create Property"}
        </Button>
      </div>
    </form>
  );
}
```

## User Profile Avatar

### Avatar Upload in Profile Settings

```tsx
"use client";

import { useState } from "react";
import { AvatarUpload } from "@/components/forms/AvatarUpload";
import { Button } from "@/components/ui/Button";
import { type ImageData } from "@/lib/types";
import toast from "react-hot-toast";

interface User {
  id: string;
  name: string;
  email: string;
  image?: string;
}

export function ProfileSettings({ user }: { user: User }) {
  const [avatar, setAvatar] = useState<ImageData | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const handleSaveProfile = async () => {
    setIsSaving(true);

    try {
      const response = await fetch("/api/user/profile", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          image: avatar?.url || user.image,
          imagePublicId: avatar?.publicId,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to update profile");
      }

      toast.success("Profile updated successfully");
    } catch (error) {
      toast.error("Failed to update profile");
      console.error(error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold mb-6">Profile Picture</h2>
        <AvatarUpload
          currentAvatar={user.image}
          onUploadSuccess={setAvatar}
        />
      </div>

      <div className="flex justify-end">
        <Button onClick={handleSaveProfile} disabled={isSaving || !avatar}>
          {isSaving ? "Saving..." : "Save Changes"}
        </Button>
      </div>
    </div>
  );
}
```

## Image Gallery Display

### Property Listing with Image Gallery

```tsx
"use client";

import { ImageGallery } from "@/components/ImageGallery";
import { type ImageData } from "@/lib/types";

interface PropertyDetailsProps {
  property: {
    id: string;
    title: string;
    images: string[];
    imageData?: ImageData[];
  };
  isOwner: boolean;
}

export function PropertyDetails({ property, isOwner }: PropertyDetailsProps) {
  // Convert image URLs to ImageData format if needed
  const images: ImageData[] =
    property.imageData ||
    property.images.map((url, index) => ({
      url,
      publicId: url.split("/").slice(-2).join("/"),
      width: 0,
      height: 0,
      order: index,
    }));

  const handleDelete = async (publicId: string) => {
    // Only allow owner to delete
    if (!isOwner) return;

    try {
      await fetch(`/api/properties/${property.id}/images/${publicId}`, {
        method: "DELETE",
      });
      // Refresh property data
    } catch (error) {
      console.error("Failed to delete image:", error);
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">{property.title}</h1>
      
      <ImageGallery
        images={images}
        onDelete={isOwner ? handleDelete : undefined}
        showControls={isOwner}
      />
    </div>
  );
}
```

## Floor Plan Upload

### Specialized Floor Plan Component

```tsx
"use client";

import { useState } from "react";
import { ImageUpload } from "@/components/ImageUpload";
import { type ImageData } from "@/lib/types";
import { Button } from "@/components/ui/Button";
import toast from "react-hot-toast";

interface FloorPlanUploadProps {
  propertyId: string;
  initialFloorPlan?: string;
}

export function FloorPlanUpload({
  propertyId,
  initialFloorPlan,
}: FloorPlanUploadProps) {
  const [floorPlan, setFloorPlan] = useState<ImageData | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    if (!floorPlan) return;

    setIsSaving(true);

    try {
      const response = await fetch(`/api/properties/${propertyId}/floor-plan`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          floorPlanUrl: floorPlan.url,
          floorPlanPublicId: floorPlan.publicId,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to save floor plan");
      }

      toast.success("Floor plan saved successfully");
    } catch (error) {
      toast.error("Failed to save floor plan");
      console.error(error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-semibold mb-2">Floor Plan</h3>
        <p className="text-sm text-gray-600 mb-4">
          Upload a floor plan image (recommended size: 600x800px)
        </p>
      </div>

      <ImageUpload
        maxFiles={1}
        folder="floor-plans"
        propertyId={propertyId}
        onUploadSuccess={(images) => setFloorPlan(images[0])}
        multiple={false}
        maxSize={3 * 1024 * 1024} // 3MB max
      />

      {(floorPlan || initialFloorPlan) && (
        <div className="border rounded-lg p-4">
          <img
            src={floorPlan?.url || initialFloorPlan}
            alt="Floor plan"
            className="max-w-full h-auto"
          />
        </div>
      )}

      <Button onClick={handleSave} disabled={isSaving || !floorPlan}>
        {isSaving ? "Saving..." : "Save Floor Plan"}
      </Button>
    </div>
  );
}
```

## API Usage Examples

### Uploading from API Route

```typescript
// app/api/properties/route.ts
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const data = await request.json();
    
    // Create property with images
    const property = await prisma.property.create({
      data: {
        title: data.title,
        description: data.description,
        price: data.price,
        address: data.address,
        city: data.city,
        state: data.state,
        zipCode: data.zipCode,
        bedrooms: data.bedrooms,
        bathrooms: data.bathrooms,
        squareFeet: data.squareFeet,
        propertyType: data.propertyType,
        images: data.images, // Array of URLs
        agentId: session.user.id,
        // Create related PropertyImage records
        propertyImages: {
          create: data.imageData.map((img: any, index: number) => ({
            url: img.url,
            publicId: img.publicId,
            width: img.width,
            height: img.height,
            order: index,
          })),
        },
      },
      include: {
        propertyImages: true,
      },
    });

    return NextResponse.json(property);
  } catch (error) {
    console.error("Create property error:", error);
    return NextResponse.json(
      { error: "Failed to create property" },
      { status: 500 }
    );
  }
}
```

### Deleting Property Images

```typescript
// app/api/properties/[id]/images/[publicId]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import cloudinary from "@/lib/cloudinary";
import prisma from "@/lib/prisma";

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; publicId: string }> }
) {
  try {
    const session = await auth();
    
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id, publicId } = await params;

    // Verify ownership
    const property = await prisma.property.findUnique({
      where: { id },
      select: { agentId: true },
    });

    if (!property || property.agentId !== session.user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Delete from Cloudinary
    await cloudinary.uploader.destroy(publicId);

    // Delete from database
    await prisma.propertyImage.deleteMany({
      where: {
        propertyId: id,
        publicId,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Delete image error:", error);
    return NextResponse.json(
      { error: "Failed to delete image" },
      { status: 500 }
    );
  }
}
```

## Database Integration

### Querying Properties with Images

```typescript
import prisma from "@/lib/prisma";

// Get property with all images
async function getProperty(id: string) {
  return await prisma.property.findUnique({
    where: { id },
    include: {
      propertyImages: {
        orderBy: { order: "asc" },
      },
      agent: {
        select: {
          id: true,
          name: true,
          email: true,
          image: true,
        },
      },
    },
  });
}

// Get all properties with first image
async function getAllProperties() {
  const properties = await prisma.property.findMany({
    include: {
      propertyImages: {
        take: 1,
        orderBy: { order: "asc" },
      },
    },
  });

  return properties.map((property) => ({
    ...property,
    mainImage: property.propertyImages[0]?.url || null,
  }));
}

// Update image order
async function updateImageOrder(propertyId: string, imageIds: string[]) {
  const updates = imageIds.map((id, index) =>
    prisma.propertyImage.update({
      where: { id },
      data: { order: index },
    })
  );

  await prisma.$transaction(updates);
}
```

### Batch Image Operations

```typescript
import prisma from "@/lib/prisma";
import cloudinary from "@/lib/cloudinary";

// Delete all images for a property
async function deleteAllPropertyImages(propertyId: string) {
  const images = await prisma.propertyImage.findMany({
    where: { propertyId },
  });

  // Delete from Cloudinary
  const deletePromises = images.map((img) =>
    cloudinary.uploader.destroy(img.publicId)
  );
  await Promise.all(deletePromises);

  // Delete from database
  await prisma.propertyImage.deleteMany({
    where: { propertyId },
  });
}

// Add images to existing property
async function addPropertyImages(
  propertyId: string,
  images: Array<{ url: string; publicId: string; width: number; height: number }>
) {
  const existingCount = await prisma.propertyImage.count({
    where: { propertyId },
  });

  await prisma.propertyImage.createMany({
    data: images.map((img, index) => ({
      propertyId,
      url: img.url,
      publicId: img.publicId,
      width: img.width,
      height: img.height,
      order: existingCount + index,
    })),
  });
}
```

## Advanced Usage

### Custom Transformation Hook

```typescript
import { useMemo } from "react";
import { getTransformedUrl } from "@/lib/cloudinary-utils";

export function useImageTransformations(publicId: string) {
  return useMemo(
    () => ({
      thumbnail: getTransformedUrl(publicId, "w_300,h_250,c_fill,f_auto,q_auto"),
      small: getTransformedUrl(publicId, "w_500,h_350,c_fill,f_auto,q_auto"),
      medium: getTransformedUrl(publicId, "w_800,h_600,c_fill,f_auto,q_auto"),
      large: getTransformedUrl(publicId, "w_1200,h_800,c_fill,f_auto,q_auto"),
      srcset: [300, 500, 800, 1200]
        .map((width) => {
          const url = getTransformedUrl(publicId, `w_${width},c_scale,f_auto,q_auto`);
          return `${url} ${width}w`;
        })
        .join(", "),
    }),
    [publicId]
  );
}
```

### Responsive Image Component

```tsx
import { useImageTransformations } from "@/hooks/useImageTransformations";

interface ResponsiveImageProps {
  publicId: string;
  alt: string;
  className?: string;
}

export function ResponsiveImage({ publicId, alt, className }: ResponsiveImageProps) {
  const { medium, srcset } = useImageTransformations(publicId);

  return (
    <img
      src={medium}
      srcSet={srcset}
      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
      alt={alt}
      loading="lazy"
      className={className}
    />
  );
}
```

---

For more information, see [CLOUDINARY_SETUP.md](./CLOUDINARY_SETUP.md)
