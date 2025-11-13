"use client";

import { useState } from "react";
import { ImageUpload } from "@/components/ImageUpload";
import { ImageGallery } from "@/components/ImageGallery";
import { type ImageData } from "@/lib/types";

export default function TestUploadPage() {
  const [propertyImages, setPropertyImages] = useState<ImageData[]>([]);
  const [avatarImages, setAvatarImages] = useState<ImageData[]>([]);

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Image Upload Test
        </h1>
        <p className="text-gray-600">
          Test the Cloudinary image upload and management system
        </p>
      </div>

      <div className="space-y-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Property Images</h2>
          <p className="text-gray-600 mb-4">
            Upload multiple images (up to 15) for a property
          </p>
          <ImageUpload
            maxFiles={15}
            folder="properties"
            propertyId="test-property-123"
            onUploadSuccess={setPropertyImages}
            initialImages={propertyImages}
            multiple={true}
          />
        </div>

        {propertyImages.length > 0 && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Property Gallery</h2>
            <ImageGallery
              images={propertyImages}
              onDelete={(publicId) => {
                setPropertyImages((prev) =>
                  prev.filter((img) => img.publicId !== publicId),
                );
              }}
              showControls={true}
            />
          </div>
        )}

        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Avatar Upload</h2>
          <p className="text-gray-600 mb-4">Upload a single avatar image</p>
          <ImageUpload
            maxFiles={1}
            folder="avatars"
            onUploadSuccess={setAvatarImages}
            initialImages={avatarImages}
            multiple={false}
          />
        </div>

        {avatarImages.length > 0 && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Avatar Preview</h2>
            <div className="flex items-center gap-4">
              <img
                src={avatarImages[0].url}
                alt="Avatar"
                className="w-32 h-32 rounded-full object-cover border-4 border-primary"
              />
              <div>
                <p className="text-sm text-gray-600">
                  {avatarImages[0].width} × {avatarImages[0].height}
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  {avatarImages[0].publicId}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="font-semibold text-blue-900 mb-2">
          Testing Instructions
        </h3>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• Upload images using drag and drop or click to browse</li>
          <li>• Test file validation (size and format)</li>
          <li>• Test progress indicators during upload</li>
          <li>• Test image preview and gallery functionality</li>
          <li>• Test image deletion</li>
          <li>• Test copying image URLs</li>
          <li>• Test responsive image transformations</li>
        </ul>
      </div>
    </div>
  );
}
