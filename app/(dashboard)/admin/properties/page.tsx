"use client";

import { useEffect, useState } from "react";
import { PropertyRow } from "@/components/admin/PropertyRow";
import { ConfirmDialog, Input, Select } from "@/components/admin/common";
import { ApprovalStatus, PropertyCategory, PropertyStatus } from "@/lib/types";
import { Search } from "lucide-react";
import toast from "react-hot-toast";

interface Property {
  id: string;
  title: string;
  image: string;
  agentId: string;
  agentName: string;
  price: number;
  category: string;
  status: PropertyStatus;
  approvalStatus: ApprovalStatus;
  location: string;
  createdAt: string;
  views: number;
  isFeatured: boolean;
}

export default function PropertiesManagementPage() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProperties, setSelectedProperties] = useState<Set<string>>(new Set());
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [approvalFilter, setApprovalFilter] = useState("");
  const [confirmDialog, setConfirmDialog] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
    variant?: "danger" | "default";
  }>({
    isOpen: false,
    title: "",
    message: "",
    onConfirm: () => {},
  });

  useEffect(() => {
    fetchProperties();
  }, []);

  const fetchProperties = async () => {
    try {
      const res = await fetch("/api/admin/properties");
      if (res.ok) {
        const data = await res.json();
        setProperties(data);
      } else {
        setProperties(generateMockProperties());
      }
    } catch (error) {
      console.error("Error fetching properties:", error);
      setProperties(generateMockProperties());
    } finally {
      setLoading(false);
    }
  };

  const generateMockProperties = (): Property[] => {
    return Array.from({ length: 30 }, (_, i) => ({
      id: `prop-${i + 1}`,
      title: `Property ${i + 1}`,
      image: i % 2 === 0 ? "/placeholder-property.jpg" : "",
      agentId: `agent-${(i % 5) + 1}`,
      agentName: `Agent ${(i % 5) + 1}`,
      price: 250000 + Math.floor(Math.random() * 500000),
      category: ["SALE", "RENT", "LEASE"][i % 3],
      status: Object.values(PropertyStatus)[i % Object.values(PropertyStatus).length],
      approvalStatus: Object.values(ApprovalStatus)[i % Object.values(ApprovalStatus).length],
      location: `City ${(i % 10) + 1}`,
      createdAt: new Date(Date.now() - Math.random() * 90 * 24 * 60 * 60 * 1000).toISOString(),
      views: Math.floor(Math.random() * 1000),
      isFeatured: i % 7 === 0,
    }));
  };

  const filteredProperties = properties.filter((property) => {
    const matchesSearch = property.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = !statusFilter || property.status === statusFilter;
    const matchesCategory = !categoryFilter || property.category === categoryFilter;
    const matchesApproval = !approvalFilter || property.approvalStatus === approvalFilter;
    return matchesSearch && matchesStatus && matchesCategory && matchesApproval;
  });

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedProperties(new Set(filteredProperties.map((p) => p.id)));
    } else {
      setSelectedProperties(new Set());
    }
  };

  const handleSelectProperty = (propertyId: string, checked: boolean) => {
    const newSelected = new Set(selectedProperties);
    if (checked) {
      newSelected.add(propertyId);
    } else {
      newSelected.delete(propertyId);
    }
    setSelectedProperties(newSelected);
  };

  const handleViewProperty = (propertyId: string) => {
    toast.info(`View property ${propertyId} (to be implemented)`);
  };

  const handleEditProperty = (propertyId: string) => {
    toast.info(`Edit property ${propertyId} (to be implemented)`);
  };

  const handleFeatureToggle = (propertyId: string, isFeatured: boolean) => {
    setConfirmDialog({
      isOpen: true,
      title: isFeatured ? "Remove Featured" : "Feature Property",
      message: `Are you sure you want to ${isFeatured ? "remove this property from featured" : "feature this property"}?`,
      onConfirm: async () => {
        try {
          const endpoint = isFeatured 
            ? `/api/admin/properties/${propertyId}/unfeature`
            : `/api/admin/properties/${propertyId}/feature`;
          const res = await fetch(endpoint, { method: "POST" });
          if (res.ok) {
            toast.success(`Property ${isFeatured ? "unfeatured" : "featured"} successfully`);
            fetchProperties();
          } else {
            setProperties((prev) =>
              prev.map((p) => (p.id === propertyId ? { ...p, isFeatured: !isFeatured } : p))
            );
            toast.success(`Property ${isFeatured ? "unfeatured" : "featured"} (mock)`);
          }
        } catch (error) {
          toast.error("Failed to update property");
        }
      },
    });
  };

  const handleApprove = (propertyId: string, currentApprovalStatus: ApprovalStatus) => {
    const newStatus = currentApprovalStatus === ApprovalStatus.APPROVED 
      ? ApprovalStatus.PENDING 
      : ApprovalStatus.APPROVED;
    
    setConfirmDialog({
      isOpen: true,
      title: newStatus === ApprovalStatus.APPROVED ? "Approve Property" : "Revoke Approval",
      message: `Are you sure you want to ${newStatus === ApprovalStatus.APPROVED ? "approve" : "revoke approval for"} this property?`,
      onConfirm: async () => {
        try {
          const res = await fetch(`/api/admin/properties/${propertyId}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ approvalStatus: newStatus }),
          });
          if (res.ok) {
            toast.success(`Property ${newStatus === ApprovalStatus.APPROVED ? "approved" : "approval revoked"} successfully`);
            fetchProperties();
          } else {
            setProperties((prev) =>
              prev.map((p) => (p.id === propertyId ? { ...p, approvalStatus: newStatus } : p))
            );
            toast.success(`Property ${newStatus === ApprovalStatus.APPROVED ? "approved" : "approval revoked"} (mock)`);
          }
        } catch (error) {
          toast.error("Failed to update property");
        }
      },
    });
  };

  const handleStatusChange = (propertyId: string) => {
    toast.info(`Change status for property ${propertyId} (to be implemented)`);
  };

  const handleDeleteProperty = (propertyId: string) => {
    setConfirmDialog({
      isOpen: true,
      title: "Delete Property",
      message: "Are you sure you want to delete this property? This action cannot be undone.",
      onConfirm: async () => {
        try {
          const res = await fetch(`/api/admin/properties/${propertyId}`, { method: "DELETE" });
          if (res.ok) {
            toast.success("Property deleted successfully");
            fetchProperties();
          } else {
            setProperties((prev) => prev.filter((p) => p.id !== propertyId));
            toast.success("Property deleted (mock)");
          }
        } catch (error) {
          toast.error("Failed to delete property");
        }
      },
      variant: "danger",
    });
  };

  const handleBulkAction = (action: string) => {
    if (selectedProperties.size === 0) {
      toast.error("No properties selected");
      return;
    }
    toast.info(`Bulk action "${action}" for ${selectedProperties.size} properties (to be implemented)`);
  };

  const pendingApprovals = properties.filter((p) => p.approvalStatus === ApprovalStatus.PENDING).length;

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p className="text-muted-foreground">Loading properties...</p>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-foreground">Manage Properties</h1>
        <p className="text-muted-foreground">View and manage all platform properties</p>
        {pendingApprovals > 0 && (
          <div className="mt-2 px-4 py-2 bg-yellow-50 border border-yellow-200 rounded-lg inline-block">
            <p className="text-sm text-yellow-800 font-medium">
              {pendingApprovals} {pendingApprovals === 1 ? "property" : "properties"} pending approval
            </p>
          </div>
        )}
      </div>

      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex flex-col lg:flex-row gap-4 mb-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search properties..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-full"
            />
          </div>
          <Select
            value={statusFilter}
            onChange={setStatusFilter}
            options={[
              { value: "", label: "All Status" },
              ...Object.values(PropertyStatus).map((s) => ({ value: s, label: s.toLowerCase() })),
            ]}
            className="w-full lg:w-40"
          />
          <Select
            value={categoryFilter}
            onChange={setCategoryFilter}
            options={[
              { value: "", label: "All Categories" },
              { value: PropertyCategory.SALE, label: "Sale" },
              { value: PropertyCategory.RENT, label: "Rent" },
              { value: PropertyCategory.LEASE, label: "Lease" },
            ]}
            className="w-full lg:w-40"
          />
          <Select
            value={approvalFilter}
            onChange={setApprovalFilter}
            options={[
              { value: "", label: "All Approval" },
              ...Object.values(ApprovalStatus).map((s) => ({ value: s, label: s.toLowerCase() })),
            ]}
            className="w-full lg:w-40"
          />
        </div>

        {selectedProperties.size > 0 && (
          <div className="flex flex-wrap gap-3 mb-4 p-4 bg-gray-50 rounded-lg">
            <span className="text-sm font-medium text-foreground">{selectedProperties.size} selected</span>
            <button
              onClick={() => handleBulkAction("feature")}
              className="text-sm text-primary hover:underline"
            >
              Feature Properties
            </button>
            <button
              onClick={() => handleBulkAction("unfeature")}
              className="text-sm text-accent hover:underline"
            >
              Remove Featured
            </button>
            <button
              onClick={() => handleBulkAction("change-status")}
              className="text-sm text-secondary hover:underline"
            >
              Change Status
            </button>
            <button
              onClick={() => handleBulkAction("delete")}
              className="text-sm text-red-600 hover:underline"
            >
              Delete Properties
            </button>
          </div>
        )}

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-b-2 border-border">
              <tr className="text-left text-sm font-semibold text-foreground">
                <th className="px-3 py-3">
                  <input
                    type="checkbox"
                    checked={selectedProperties.size === filteredProperties.length && filteredProperties.length > 0}
                    onChange={(e) => handleSelectAll(e.target.checked)}
                    className="w-4 h-4 text-primary bg-gray-100 border-gray-300 rounded focus:ring-primary focus:ring-2"
                  />
                </th>
                <th className="px-3 py-3">Property</th>
                <th className="px-3 py-3">Agent</th>
                <th className="px-3 py-3">Price</th>
                <th className="px-3 py-3">Category</th>
                <th className="px-3 py-3">Status</th>
                <th className="px-3 py-3">Approval</th>
                <th className="px-3 py-3">Created</th>
                <th className="px-3 py-3">Views</th>
                <th className="px-3 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredProperties.length === 0 ? (
                <tr>
                  <td colSpan={10} className="text-center py-8 text-muted-foreground">
                    No properties found
                  </td>
                </tr>
              ) : (
                filteredProperties.map((property) => (
                  <PropertyRow
                    key={property.id}
                    property={property}
                    selected={selectedProperties.has(property.id)}
                    onSelect={handleSelectProperty}
                    onView={handleViewProperty}
                    onViewAgent={(agentId) => toast.info(`View agent ${agentId} (to be implemented)`)}
                    onEdit={handleEditProperty}
                    onDelete={handleDeleteProperty}
                    onFeatureToggle={handleFeatureToggle}
                    onApprove={handleApprove}
                    onStatusChange={handleStatusChange}
                  />
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="mt-4 flex items-center justify-between text-sm text-muted-foreground">
          <p>Showing {filteredProperties.length} of {properties.length} properties</p>
          <div className="flex gap-2">
            <button className="px-3 py-1 border border-border rounded hover:bg-gray-50">Previous</button>
            <button className="px-3 py-1 border border-border rounded hover:bg-gray-50">Next</button>
          </div>
        </div>
      </div>

      <ConfirmDialog
        isOpen={confirmDialog.isOpen}
        onClose={() => setConfirmDialog({ ...confirmDialog, isOpen: false })}
        onConfirm={confirmDialog.onConfirm}
        title={confirmDialog.title}
        message={confirmDialog.message}
        variant={confirmDialog.variant}
      />
    </div>
  );
}
