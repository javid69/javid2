"use client";

import { useRouter, useParams } from "next/navigation";
import { PropertyForm } from "@/components/agent/PropertyForm";
import { Button } from "@/components/ui/Button";
import { useEffect, useState } from "react";
import { Property } from "@/lib/types";
import toast from "react-hot-toast";
import { Trash2 } from "lucide-react";

export default function EditPropertyPage() {
  const router = useRouter();
  const params = useParams();
  const propertyId = params.id as string;

  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initProperty = async () => {
      await fetchProperty();
    };
    initProperty();
  }, [propertyId]);

  const fetchProperty = async () => {
    try {
      const response = await fetch(`/api/agent/properties/${propertyId}`);
      if (response.ok) {
        const data = await response.json();
        setProperty(data);
      } else {
        toast.error("Failed to load property");
        router.push("/agent/properties");
      }
    } catch (error) {
      console.error("Error fetching property:", error);
      toast.error("Failed to load property");
      router.push("/agent/properties");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (data: unknown) => {
    try {
      const response = await fetch(`/api/agent/properties/${propertyId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        toast.success("Property updated successfully!");
        router.push("/agent/properties");
      } else {
        const error = await response.json();
        toast.error(error.message || "Failed to update property");
      }
    } catch (error) {
      console.error("Error updating property:", error);
      toast.error("Failed to update property");
    }
  };

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this property?")) return;

    try {
      const response = await fetch(`/api/agent/properties/${propertyId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        toast.success("Property deleted successfully!");
        router.push("/agent/properties");
      } else {
        toast.error("Failed to delete property");
      }
    } catch (error) {
      console.error("Error deleting property:", error);
      toast.error("Failed to delete property");
    }
  };

  if (loading) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">Loading property...</p>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">Property not found</p>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground">Edit Property</h1>
        <p className="text-muted-foreground mt-2">
          Update the property details
        </p>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <PropertyForm property={property} onSubmit={handleSubmit} />

        <div className="mt-8 pt-8 border-t border-border">
          <h3 className="text-lg font-semibold text-foreground mb-4">
            Danger Zone
          </h3>
          <Button
            variant="outline"
            className="text-red-600 hover:bg-red-50 border-red-200"
            onClick={handleDelete}
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Delete Property
          </Button>
        </div>
      </div>
    </div>
  );
}
