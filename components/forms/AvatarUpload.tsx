"use client";

import { useState } from "react";
import { ImageUpload } from "@/components/ImageUpload";
import { type ImageData } from "@/lib/types";
import { User } from "lucide-react";
import { cn } from "@/lib/utils";

interface AvatarUploadProps {
  currentAvatar?: string;
  onUploadSuccess?: (image: ImageData) => void;
  className?: string;
}

export function AvatarUpload({
  currentAvatar,
  onUploadSuccess,
  className,
}: AvatarUploadProps) {
  const [avatar, setAvatar] = useState<ImageData | null>(null);

  const handleUpload = (images: ImageData[]) => {
    if (images.length > 0) {
      const newAvatar = images[0];
      setAvatar(newAvatar);
      if (onUploadSuccess) {
        onUploadSuccess(newAvatar);
      }
    }
  };

  const displayUrl = avatar?.url || currentAvatar;

  return (
    <div className={cn("space-y-4", className)}>
      <div className="flex items-center gap-6">
        <div className="relative">
          <div className="w-32 h-32 rounded-full overflow-hidden bg-gray-100 border-4 border-white shadow-lg">
            {displayUrl ? (
              <img
                src={displayUrl}
                alt="Avatar"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gray-200">
                <User className="w-16 h-16 text-gray-400" />
              </div>
            )}
          </div>
          {displayUrl && (
            <div className="absolute inset-0 rounded-full bg-black/0 hover:bg-black/30 transition-colors cursor-pointer flex items-center justify-center">
              <span className="text-white text-sm font-medium opacity-0 hover:opacity-100 transition-opacity">
                Change
              </span>
            </div>
          )}
        </div>

        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Profile Picture
          </h3>
          <p className="text-sm text-gray-600 mb-3">
            Upload a profile picture. Recommended size: 150x150px
          </p>
        </div>
      </div>

      <ImageUpload
        maxFiles={1}
        folder="avatars"
        onUploadSuccess={handleUpload}
        initialImages={avatar ? [avatar] : []}
        multiple={false}
        maxSize={2 * 1024 * 1024}
      />
    </div>
  );
}
