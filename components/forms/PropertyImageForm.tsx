"use client";

import { useState } from "react";
import { ImageUpload } from "@/components/ImageUpload";
import { ImageGallery } from "@/components/ImageGallery";
import { type ImageData } from "@/lib/types";
import { Button } from "@/components/ui/Button";

interface PropertyImageFormProps {
  propertyId?: string;
  initialImages?: ImageData[];
  onSave?: (images: ImageData[]) => void;
}

export function PropertyImageForm({
  propertyId,
  initialImages = [],
  onSave,
}: PropertyImageFormProps) {
  const [images, setImages] = useState<ImageData[]>(initialImages);
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    if (!onSave) return;

    setIsSaving(true);
    try {
      await onSave(images);
    } catch (error) {
      console.error("Failed to save images:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = (publicId: string) => {
    setImages((prev) => prev.filter((img) => img.publicId !== publicId));
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Property Images
        </h3>
        <p className="text-sm text-gray-600 mb-4">
          Upload up to 15 high-quality images of your property. The first image
          will be used as the main listing photo.
        </p>
        <ImageUpload
          maxFiles={15}
          folder="properties"
          propertyId={propertyId || "new-property"}
          onUploadSuccess={setImages}
          initialImages={images}
          multiple={true}
        />
      </div>

      {images.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Uploaded Images ({images.length})
          </h3>
          <ImageGallery
            images={images}
            onDelete={handleDelete}
            showControls={true}
          />
        </div>
      )}

      {onSave && (
        <div className="flex justify-end gap-3">
          <Button
            variant="outline"
            onClick={() => setImages(initialImages)}
            disabled={isSaving}
          >
            Reset
          </Button>
          <Button onClick={handleSave} disabled={isSaving || images.length === 0}>
            {isSaving ? "Saving..." : "Save Images"}
          </Button>
        </div>
      )}
    </div>
  );
}
