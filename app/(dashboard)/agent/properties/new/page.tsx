"use client";

import { useRouter } from "next/navigation";
import { PropertyForm } from "@/components/agent/PropertyForm";
import toast from "react-hot-toast";

export default function AddPropertyPage() {
  const router = useRouter();

  const handleSubmit = async (data: unknown) => {
    try {
      const response = await fetch("/api/agent/properties", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        const property = await response.json();
        toast.success("Property added successfully!");
        router.push("/agent/properties");
      } else {
        const error = await response.json();
        toast.error(error.message || "Failed to add property");
      }
    } catch (error) {
      console.error("Error adding property:", error);
      toast.error("Failed to add property");
    }
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground">Add New Property</h1>
        <p className="text-muted-foreground mt-2">
          Fill in the details to list a new property
        </p>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <PropertyForm onSubmit={handleSubmit} />
      </div>
    </div>
  );
}
