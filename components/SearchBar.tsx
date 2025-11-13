"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Search } from "lucide-react";
import { PropertyType } from "@/lib/types";

const searchSchema = z.object({
  location: z.string().optional(),
  minPrice: z.string().optional(),
  maxPrice: z.string().optional(),
  propertyType: z.string().optional(),
});

type SearchFormData = z.infer<typeof searchSchema>;

export function SearchBar() {
  const router = useRouter();
  const { register, handleSubmit } = useForm<SearchFormData>({
    resolver: zodResolver(searchSchema),
  });

  const onSubmit = (data: SearchFormData) => {
    const params = new URLSearchParams();

    if (data.location) params.set("city", data.location);
    if (data.minPrice) params.set("minPrice", data.minPrice);
    if (data.maxPrice) params.set("maxPrice", data.maxPrice);
    if (data.propertyType && data.propertyType !== "all")
      params.set("propertyType", data.propertyType);

    router.push(`/properties?${params.toString()}`);
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="bg-white rounded-lg shadow-xl p-4 md:p-6 max-w-5xl mx-auto"
    >
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="md:col-span-1">
          <label
            htmlFor="location"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Location
          </label>
          <input
            {...register("location")}
            type="text"
            id="location"
            placeholder="Enter city"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
          />
        </div>

        <div>
          <label
            htmlFor="minPrice"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Min Price
          </label>
          <select
            {...register("minPrice")}
            id="minPrice"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
          >
            <option value="">Any</option>
            <option value="1000000">₹10 Lakh</option>
            <option value="2500000">₹25 Lakh</option>
            <option value="5000000">₹50 Lakh</option>
            <option value="7500000">₹75 Lakh</option>
            <option value="10000000">₹1 Crore</option>
            <option value="20000000">₹2 Crore</option>
          </select>
        </div>

        <div>
          <label
            htmlFor="maxPrice"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Max Price
          </label>
          <select
            {...register("maxPrice")}
            id="maxPrice"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
          >
            <option value="">Any</option>
            <option value="2500000">₹25 Lakh</option>
            <option value="5000000">₹50 Lakh</option>
            <option value="7500000">₹75 Lakh</option>
            <option value="10000000">₹1 Crore</option>
            <option value="20000000">₹2 Crore</option>
            <option value="50000000">₹5 Crore</option>
          </select>
        </div>

        <div>
          <label
            htmlFor="propertyType"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Property Type
          </label>
          <select
            {...register("propertyType")}
            id="propertyType"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
          >
            <option value="all">All Types</option>
            <option value={PropertyType.APARTMENT}>Apartment</option>
            <option value={PropertyType.HOUSE}>House</option>
            <option value={PropertyType.CONDO}>Condo</option>
            <option value={PropertyType.TOWNHOUSE}>Townhouse</option>
            <option value={PropertyType.LAND}>Land</option>
            <option value={PropertyType.COMMERCIAL}>Commercial</option>
          </select>
        </div>
      </div>

      <div className="mt-4 flex justify-center">
        <button
          type="submit"
          className="bg-secondary hover:bg-secondary/90 text-white px-8 py-3 rounded-lg font-semibold flex items-center gap-2 transition-colors"
        >
          <Search className="w-5 h-5" />
          Search Properties
        </button>
      </div>
    </form>
  );
}
