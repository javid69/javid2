"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/Button";
import { PropertyRow } from "@/components/agent/PropertyRow";
import { Property, PropertyStatus } from "@/lib/types";
import toast from "react-hot-toast";
import { Trash2 } from "lucide-react";

export default function PropertiesPage() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedStatus, setSelectedStatus] = useState<
    PropertyStatus | "ALL"
  >("ALL");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchProperties();
  }, []);

  const fetchProperties = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/agent/properties");
      if (response.ok) {
        const data = await response.json();
        setProperties(data);
      }
    } catch (error) {
      console.error("Failed to fetch properties:", error);
      toast.error("Failed to load properties");
    } finally {
      setLoading(false);
    }
  };

  const filteredProperties = properties.filter((p) => {
    const matchesStatus = selectedStatus === "ALL" || p.status === selectedStatus;
    const matchesSearch = p.title
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this property?")) return;

    try {
      const response = await fetch(`/api/agent/properties/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setProperties(properties.filter((p) => p.id !== id));
        toast.success("Property deleted successfully");
      } else {
        toast.error("Failed to delete property");
      }
    } catch (error) {
      console.error("Failed to delete property:", error);
      toast.error("Failed to delete property");
    }
  };

  const handleToggleFeatured = async (id: string) => {
    try {
      const property = properties.find((p) => p.id === id);
      if (!property) return;

      const response = await fetch(`/api/agent/properties/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...property, featured: !property.featured }),
      });

      if (response.ok) {
        setProperties(
          properties.map((p) =>
            p.id === id ? { ...p, featured: !p.featured } : p
          )
        );
        toast.success(
          `Property ${!property.featured ? "featured" : "unfeatured"} successfully`
        );
      }
    } catch (error) {
      console.error("Failed to toggle featured:", error);
      toast.error("Failed to update property");
    }
  };

  const handleMarkSold = async (id: string) => {
    try {
      const property = properties.find((p) => p.id === id);
      if (!property) return;

      const response = await fetch(`/api/agent/properties/${id}/mark-sold`, {
        method: "POST",
      });

      if (response.ok) {
        setProperties(
          properties.map((p) => (p.id === id ? { ...p, status: "SOLD" } : p))
        );
        toast.success("Property marked as sold");
      }
    } catch (error) {
      console.error("Failed to mark property as sold:", error);
      toast.error("Failed to mark property as sold");
    }
  };

  const handleBulkDelete = async () => {
    if (
      !confirm(
        "Are you sure you want to delete selected properties?"
      )
    )
      return;

    // TODO: Implement bulk delete with checkbox selection
    toast.info("Bulk delete feature coming soon");
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground">My Properties</h1>
          <p className="text-muted-foreground mt-2">
            Manage your property listings
          </p>
        </div>
        <Link href="/agent/properties/new">
          <Button>➕ Add New Property</Button>
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <input
            type="text"
            placeholder="Search by property name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 px-4 py-2 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          />
          <select
            value={selectedStatus}
            onChange={(e) =>
              setSelectedStatus(e.target.value as PropertyStatus | "ALL")
            }
            className="px-4 py-2 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="ALL">All Status</option>
            <option value="AVAILABLE">Available</option>
            <option value="PENDING">Pending</option>
            <option value="SOLD">Sold</option>
            <option value="RENTED">Rented</option>
          </select>
          <Button 
            variant="outline" 
            onClick={handleBulkDelete}
            disabled
            title="Bulk delete feature coming soon"
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Delete Selected
          </Button>
        </div>
      </div>

      {loading ? (
        <div className="bg-white rounded-lg shadow-md p-6 text-center">
          <p className="text-muted-foreground">Loading properties...</p>
        </div>
      ) : filteredProperties.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-6 text-center">
          <p className="text-muted-foreground">
            {properties.length === 0
              ? "No properties yet. Create your first property!"
              : "No properties match your search."}
          </p>
          {properties.length === 0 && (
            <Link href="/agent/properties/new">
              <Button className="mt-4">Add Your First Property</Button>
            </Link>
          )}
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-foreground">
                    Image
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-foreground">
                    Property Name
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-foreground">
                    Price
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-foreground">
                    Type
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-foreground">
                    Location
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-foreground">
                    Status
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-foreground">
                    Date
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-foreground">
                    Views
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-foreground">
                    Inquiries
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-foreground">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredProperties.map((property) => (
                  <PropertyRow
                    key={property.id}
                    property={property}
                    onDelete={handleDelete}
                    onToggleFeatured={handleToggleFeatured}
                    onMarkSold={handleMarkSold}
                  />
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
