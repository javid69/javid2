"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/Button";
import { Property, PropertyType } from "@/lib/types";
import { X } from "lucide-react";

const propertySchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z
    .string()
    .min(10, "Description must be at least 10 characters"),
  price: z.number().positive("Price must be positive"),
  address: z.string().min(5, "Address must be at least 5 characters"),
  city: z.string().min(2, "City must be at least 2 characters"),
  state: z.string().min(2, "State must be at least 2 characters"),
  zipCode: z.string().min(5, "Zip code must be at least 5 characters"),
  bedrooms: z.number().int().positive("Bedrooms must be positive"),
  bathrooms: z.number().positive("Bathrooms must be positive"),
  squareFeet: z.number().positive("Square feet must be positive"),
  propertyType: z.enum([
    "HOUSE",
    "APARTMENT",
    "CONDO",
    "TOWNHOUSE",
    "LAND",
    "COMMERCIAL",
  ] as const),
});

type PropertyFormData = z.infer<typeof propertySchema>;

interface PropertyFormProps {
  property?: Property;
  onSubmit: (data: PropertyFormData) => Promise<void>;
}

export function PropertyForm({ property, onSubmit }: PropertyFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<PropertyFormData>({
    resolver: zodResolver(propertySchema),
    defaultValues: property
      ? {
          title: property.title,
          description: property.description,
          price: property.price,
          address: property.address,
          city: property.city,
          state: property.state,
          zipCode: property.zipCode,
          bedrooms: property.bedrooms,
          bathrooms: property.bathrooms,
          squareFeet: property.squareFeet,
          propertyType: property.propertyType,
        }
      : undefined,
  });

  const [imageUrls, setImageUrls] = useState<string[]>(property?.images || []);

  const handleRemoveImage = (index: number) => {
    setImageUrls(imageUrls.filter((_, i) => i !== index));
  };

  const handleAddImage = (url: string) => {
    if (url && !imageUrls.includes(url)) {
      setImageUrls([...imageUrls, url]);
    }
  };

  const onFormSubmit = async (data: PropertyFormData) => {
    try {
      const finalData = { ...data, images: imageUrls };
      await onSubmit(finalData);
      if (!property) {
        reset();
        setImageUrls([]);
      }
    } catch (error) {
      console.error("Form submission error:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Property Title
          </label>
          <input
            type="text"
            placeholder="e.g., Beautiful Family Home"
            {...register("title")}
            className="w-full px-4 py-2 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          />
          {errors.title && (
            <p className="text-red-600 text-sm mt-1">{errors.title.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Price ($)
          </label>
          <input
            type="number"
            placeholder="500000"
            {...register("price", { valueAsNumber: true })}
            className="w-full px-4 py-2 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          />
          {errors.price && (
            <p className="text-red-600 text-sm mt-1">{errors.price.message}</p>
          )}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-foreground mb-2">
          Description
        </label>
        <textarea
          placeholder="Describe the property..."
          {...register("description")}
          rows={4}
          className="w-full px-4 py-2 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
        />
        {errors.description && (
          <p className="text-red-600 text-sm mt-1">
            {errors.description.message}
          </p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-foreground mb-2">
          Property Type
        </label>
        <select
          {...register("propertyType")}
          className="w-full px-4 py-2 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
        >
          <option value="">Select property type</option>
          {Object.values(PropertyType).map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>
        {errors.propertyType && (
          <p className="text-red-600 text-sm mt-1">
            {errors.propertyType.message}
          </p>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Address
          </label>
          <input
            type="text"
            placeholder="123 Main Street"
            {...register("address")}
            className="w-full px-4 py-2 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          />
          {errors.address && (
            <p className="text-red-600 text-sm mt-1">
              {errors.address.message}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            City
          </label>
          <input
            type="text"
            placeholder="New York"
            {...register("city")}
            className="w-full px-4 py-2 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          />
          {errors.city && (
            <p className="text-red-600 text-sm mt-1">{errors.city.message}</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            State
          </label>
          <input
            type="text"
            placeholder="NY"
            {...register("state")}
            className="w-full px-4 py-2 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          />
          {errors.state && (
            <p className="text-red-600 text-sm mt-1">{errors.state.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Zip Code
          </label>
          <input
            type="text"
            placeholder="10001"
            {...register("zipCode")}
            className="w-full px-4 py-2 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          />
          {errors.zipCode && (
            <p className="text-red-600 text-sm mt-1">
              {errors.zipCode.message}
            </p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Bedrooms
          </label>
          <input
            type="number"
            placeholder="3"
            {...register("bedrooms", { valueAsNumber: true })}
            className="w-full px-4 py-2 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          />
          {errors.bedrooms && (
            <p className="text-red-600 text-sm mt-1">
              {errors.bedrooms.message}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Bathrooms
          </label>
          <input
            type="number"
            placeholder="2"
            {...register("bathrooms", { valueAsNumber: true })}
            className="w-full px-4 py-2 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          />
          {errors.bathrooms && (
            <p className="text-red-600 text-sm mt-1">
              {errors.bathrooms.message}
            </p>
          )}
        </div>

        <div className="col-span-2">
          <label className="block text-sm font-medium text-foreground mb-2">
            Square Feet
          </label>
          <input
            type="number"
            placeholder="2500"
            {...register("squareFeet", { valueAsNumber: true })}
            className="w-full px-4 py-2 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          />
          {errors.squareFeet && (
            <p className="text-red-600 text-sm mt-1">
              {errors.squareFeet.message}
            </p>
          )}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-foreground mb-2">
          Property Images
        </label>
        <div className="flex gap-2 mb-4">
          <input
            type="text"
            placeholder="Add image URL"
            onKeyPress={(e) => {
              if (e.key === "Enter") {
                handleAddImage((e.target as HTMLInputElement).value);
                (e.target as HTMLInputElement).value = "";
              }
            }}
            className="flex-1 px-4 py-2 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          />
          <Button
            type="button"
            variant="outline"
            onClick={() => {
              const input = document.querySelector(
                'input[placeholder="Add image URL"]'
              ) as HTMLInputElement;
              handleAddImage(input.value);
              input.value = "";
            }}
          >
            Add
          </Button>
        </div>

        {imageUrls.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {imageUrls.map((url, index) => (
              <div key={index} className="relative">
                <div className="w-full h-24 rounded-lg bg-gray-100 flex items-center justify-center overflow-hidden">
                  <span className="text-2xl">🖼️</span>
                </div>
                <button
                  type="button"
                  onClick={() => handleRemoveImage(index)}
                  className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full p-1 hover:bg-red-700"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="flex gap-4">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Saving..." : property ? "Update Property" : "Add Property"}
        </Button>
        <Button type="button" variant="outline">
          Cancel
        </Button>
      </div>
    </form>
  );
}
