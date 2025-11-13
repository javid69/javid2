"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Search, GripVertical } from "lucide-react";
import { Input, ConfirmDialog } from "@/components/admin/common";
import toast from "react-hot-toast";

interface FeaturedProperty {
  id: string;
  title: string;
  image: string;
  price: number;
  location: string;
  order: number;
}

export default function FeaturedPropertiesPage() {
  const [featuredProperties, setFeaturedProperties] = useState<FeaturedProperty[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [availableProperties, setAvailableProperties] = useState<FeaturedProperty[]>([]);
  const [confirmDialog, setConfirmDialog] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
  }>({
    isOpen: false,
    title: "",
    message: "",
    onConfirm: () => {},
  });

  const maxFeatured = 10;

  useEffect(() => {
    fetchFeaturedProperties();
    fetchAvailableProperties();
  }, []);

  const fetchFeaturedProperties = async () => {
    try {
      const res = await fetch("/api/admin/featured");
      if (res.ok) {
        const data = await res.json();
        setFeaturedProperties(data);
      } else {
        setFeaturedProperties(generateMockFeatured());
      }
    } catch (error) {
      console.error("Error fetching featured properties:", error);
      setFeaturedProperties(generateMockFeatured());
    } finally {
      setLoading(false);
    }
  };

  const fetchAvailableProperties = async () => {
    try {
      const res = await fetch("/api/admin/properties?featured=false");
      if (res.ok) {
        const data = await res.json();
        setAvailableProperties(data);
      } else {
        setAvailableProperties(generateMockAvailable());
      }
    } catch (error) {
      console.error("Error fetching available properties:", error);
      setAvailableProperties(generateMockAvailable());
    }
  };

  const generateMockFeatured = (): FeaturedProperty[] => {
    return Array.from({ length: 5 }, (_, i) => ({
      id: `feat-${i + 1}`,
      title: `Featured Property ${i + 1}`,
      image: "",
      price: 350000 + i * 50000,
      location: `City ${i + 1}`,
      order: i + 1,
    }));
  };

  const generateMockAvailable = (): FeaturedProperty[] => {
    return Array.from({ length: 15 }, (_, i) => ({
      id: `prop-${i + 1}`,
      title: `Property ${i + 1}`,
      image: "",
      price: 250000 + i * 30000,
      location: `City ${i + 1}`,
      order: 0,
    }));
  };

  const handleRemoveFeatured = (propertyId: string) => {
    setConfirmDialog({
      isOpen: true,
      title: "Remove Featured Property",
      message: "Are you sure you want to remove this property from featured?",
      onConfirm: async () => {
        try {
          const res = await fetch(`/api/admin/properties/${propertyId}/unfeature`, { method: "POST" });
          if (res.ok) {
            toast.success("Property removed from featured");
            fetchFeaturedProperties();
            fetchAvailableProperties();
          } else {
            setFeaturedProperties((prev) => prev.filter((p) => p.id !== propertyId));
            toast.success("Property removed from featured (mock)");
          }
        } catch (error) {
          toast.error("Failed to remove featured property");
        }
      },
    });
  };

  const handleAddFeatured = (propertyId: string) => {
    if (featuredProperties.length >= maxFeatured) {
      toast.error(`Maximum ${maxFeatured} featured properties allowed`);
      return;
    }

    setConfirmDialog({
      isOpen: true,
      title: "Add to Featured",
      message: "Are you sure you want to feature this property?",
      onConfirm: async () => {
        try {
          const res = await fetch(`/api/admin/properties/${propertyId}/feature`, { method: "POST" });
          if (res.ok) {
            toast.success("Property added to featured");
            fetchFeaturedProperties();
            fetchAvailableProperties();
            setShowAddModal(false);
          } else {
            const property = availableProperties.find((p) => p.id === propertyId);
            if (property) {
              setFeaturedProperties((prev) => [...prev, { ...property, order: prev.length + 1 }]);
              setAvailableProperties((prev) => prev.filter((p) => p.id !== propertyId));
              toast.success("Property added to featured (mock)");
              setShowAddModal(false);
            }
          }
        } catch (error) {
          toast.error("Failed to feature property");
        }
      },
    });
  };

  const handleReorder = (fromIndex: number, toIndex: number) => {
    if (fromIndex === toIndex) return;
    const reordered = [...featuredProperties];
    const [moved] = reordered.splice(fromIndex, 1);
    reordered.splice(toIndex, 0, moved);
    const updated = reordered.map((p, i) => ({ ...p, order: i + 1 }));
    setFeaturedProperties(updated);
    toast.success("Order updated (mock)");
  };

  const filteredAvailable = availableProperties.filter((p) =>
    p.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p className="text-muted-foreground">Loading featured properties...</p>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-foreground">Featured Properties</h1>
        <p className="text-muted-foreground">Manage homepage featured properties</p>
        <div className="mt-2 text-sm text-muted-foreground">
          {featuredProperties.length} / {maxFeatured} featured properties
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-foreground">Current Featured Properties</h2>
          <button
            onClick={() => setShowAddModal(true)}
            disabled={featuredProperties.length >= maxFeatured}
            className="px-4 py-2 bg-primary text-white rounded-lg font-semibold hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Add Featured Property
          </button>
        </div>

        <div className="space-y-3">
          {featuredProperties.length === 0 ? (
            <p className="text-center py-8 text-muted-foreground">No featured properties yet</p>
          ) : (
            featuredProperties.map((property, index) => (
              <div
                key={property.id}
                className="flex items-center gap-4 p-4 border border-border rounded-lg bg-gray-50"
              >
                <button className="cursor-move text-muted-foreground hover:text-foreground">
                  <GripVertical className="w-5 h-5" />
                </button>
                <div className="relative w-20 h-20 rounded-lg overflow-hidden bg-gray-200 flex-shrink-0">
                  {property.image ? (
                    <Image src={property.image} alt={property.title} fill className="object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-xs text-muted-foreground">
                      No Image
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-foreground">{property.title}</h3>
                  <p className="text-sm text-muted-foreground">{property.location}</p>
                  <p className="text-sm font-semibold text-primary">${property.price.toLocaleString()}</p>
                </div>
                <div className="flex flex-col gap-2">
                  <button
                    onClick={() => handleReorder(index, Math.max(0, index - 1))}
                    disabled={index === 0}
                    className="px-3 py-1 text-sm border border-border rounded hover:bg-white disabled:opacity-50"
                  >
                    Move Up
                  </button>
                  <button
                    onClick={() => handleReorder(index, Math.min(featuredProperties.length - 1, index + 1))}
                    disabled={index === featuredProperties.length - 1}
                    className="px-3 py-1 text-sm border border-border rounded hover:bg-white disabled:opacity-50"
                  >
                    Move Down
                  </button>
                </div>
                <button
                  onClick={() => handleRemoveFeatured(property.id)}
                  className="px-4 py-2 text-sm text-red-600 border border-red-600 rounded-lg hover:bg-red-50"
                >
                  Remove
                </button>
              </div>
            ))
          )}
        </div>
      </div>

      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-4 border-b border-border">
              <h2 className="text-xl font-bold text-foreground">Add Featured Property</h2>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-muted-foreground hover:text-foreground"
              >
                ×
              </button>
            </div>
            <div className="p-4">
              <div className="mb-4">
                <Input
                  type="text"
                  placeholder="Search properties..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full"
                />
              </div>
              <div className="space-y-2 max-h-[500px] overflow-y-auto">
                {filteredAvailable.length === 0 ? (
                  <p className="text-center py-4 text-muted-foreground">No properties available</p>
                ) : (
                  filteredAvailable.map((property) => (
                    <div
                      key={property.id}
                      className="flex items-center gap-4 p-3 border border-border rounded-lg hover:bg-gray-50"
                    >
                      <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-gray-200 flex-shrink-0">
                        {property.image ? (
                          <Image src={property.image} alt={property.title} fill className="object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-xs text-muted-foreground">
                            No Image
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-foreground">{property.title}</h3>
                        <p className="text-sm text-muted-foreground">{property.location}</p>
                        <p className="text-sm font-semibold text-primary">${property.price.toLocaleString()}</p>
                      </div>
                      <button
                        onClick={() => handleAddFeatured(property.id)}
                        className="px-4 py-2 text-sm bg-primary text-white rounded-lg hover:bg-primary/90"
                      >
                        Add
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      <ConfirmDialog
        isOpen={confirmDialog.isOpen}
        onClose={() => setConfirmDialog({ ...confirmDialog, isOpen: false })}
        onConfirm={confirmDialog.onConfirm}
        title={confirmDialog.title}
        message={confirmDialog.message}
      />
    </div>
  );
}
