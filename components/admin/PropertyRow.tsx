"use client";

import Image from "next/image";
import { Checkbox } from "@/components/admin/common";
import { ApprovalStatus, PropertyStatus } from "@/lib/types";

interface PropertyRowProps {
  property: {
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
  };
  selected: boolean;
  onSelect: (propertyId: string, checked: boolean) => void;
  onView: (propertyId: string) => void;
  onViewAgent: (agentId: string) => void;
  onEdit: (propertyId: string) => void;
  onDelete: (propertyId: string) => void;
  onFeatureToggle: (propertyId: string, isFeatured: boolean) => void;
  onApprove: (propertyId: string, approvalStatus: ApprovalStatus) => void;
  onStatusChange: (propertyId: string) => void;
}

export function PropertyRow({
  property,
  selected,
  onSelect,
  onView,
  onViewAgent,
  onEdit,
  onDelete,
  onFeatureToggle,
  onApprove,
  onStatusChange,
}: PropertyRowProps) {
  const statusColors: Record<PropertyStatus, string> = {
    [PropertyStatus.ACTIVE]: "bg-green-100 text-green-700",
    [PropertyStatus.PENDING]: "bg-yellow-100 text-yellow-600",
    [PropertyStatus.SOLD]: "bg-gray-200 text-gray-700",
    [PropertyStatus.RENTED]: "bg-blue-100 text-blue-700",
    [PropertyStatus.INACTIVE]: "bg-slate-200 text-slate-700",
  };

  const approvalColors: Record<ApprovalStatus, string> = {
    [ApprovalStatus.APPROVED]: "bg-green-100 text-green-700",
    [ApprovalStatus.PENDING]: "bg-yellow-100 text-yellow-600",
    [ApprovalStatus.REJECTED]: "bg-red-100 text-red-600",
  };

  return (
    <tr className="border-b border-border text-sm">
      <td className="px-3 py-4">
        <Checkbox
          checked={selected}
          onChange={(checked) => onSelect(property.id, checked)}
          aria-label={`Select ${property.title}`}
        />
      </td>
      <td className="px-3 py-4">
        <div className="flex items-center gap-3">
          <div className="relative w-14 h-14 rounded-lg overflow-hidden bg-gray-100">
            {property.image ? (
              <Image
                src={property.image}
                alt={property.title}
                fill
                className="object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-xs text-muted-foreground">
                Image
              </div>
            )}
          </div>
          <div>
            <div className="font-semibold text-foreground">{property.title}</div>
            <div className="text-xs text-muted-foreground">{property.id}</div>
          </div>
        </div>
      </td>
      <td className="px-3 py-4">
        <button
          className="text-primary hover:underline"
          onClick={() => onViewAgent(property.agentId)}
        >
          {property.agentName}
        </button>
      </td>
      <td className="px-3 py-4 font-semibold text-primary">
        ${property.price.toLocaleString()}
      </td>
      <td className="px-3 py-4 capitalize">{property.category.toLowerCase()}</td>
      <td className="px-3 py-4">
        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${statusColors[property.status]}`}>
          {property.status.toLowerCase()}
        </span>
      </td>
      <td className="px-3 py-4">
        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${approvalColors[property.approvalStatus]}`}>
          {property.approvalStatus.toLowerCase()}
        </span>
      </td>
      <td className="px-3 py-4 text-muted-foreground">
        {new Date(property.createdAt).toLocaleDateString()}
      </td>
      <td className="px-3 py-4 text-center">{property.views.toLocaleString()}</td>
      <td className="px-3 py-4">
        <div className="flex flex-wrap gap-3">
          <button className="text-primary hover:underline" onClick={() => onView(property.id)}>
            View
          </button>
          <button className="text-accent hover:underline" onClick={() => onEdit(property.id)}>
            Edit
          </button>
          <button
            className="text-secondary hover:underline"
            onClick={() => onFeatureToggle(property.id, property.isFeatured)}
          >
            {property.isFeatured ? "Unfeature" : "Feature"}
          </button>
          <button
            className="text-emerald-600 hover:underline"
            onClick={() => onApprove(property.id, property.approvalStatus)}
          >
            {property.approvalStatus === ApprovalStatus.APPROVED ? "Revoke" : "Approve"}
          </button>
          <button className="text-secondary hover:underline" onClick={() => onStatusChange(property.id)}>
            Status
          </button>
          <button className="text-red-600 hover:underline" onClick={() => onDelete(property.id)}>
            Delete
          </button>
        </div>
      </td>
    </tr>
  );
}
