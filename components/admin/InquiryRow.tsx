"use client";

import { Checkbox } from "@/components/admin/common";
import { InquiryStatus } from "@/lib/types";

interface InquiryRowProps {
  inquiry: {
    id: string;
    visitorName: string;
    visitorEmail: string;
    visitorPhone?: string | null;
    propertyTitle: string;
    propertyId: string;
    status: InquiryStatus;
    agentName?: string | null;
    createdAt: string;
  };
  selected: boolean;
  onSelect: (inquiryId: string, checked: boolean) => void;
  onView: (inquiryId: string) => void;
  onAssignAgent: (inquiryId: string) => void;
  onChangeStatus: (inquiryId: string) => void;
  onDelete: (inquiryId: string) => void;
}

export function InquiryRow({
  inquiry,
  selected,
  onSelect,
  onView,
  onAssignAgent,
  onChangeStatus,
  onDelete,
}: InquiryRowProps) {
  const statusColors: Record<InquiryStatus, string> = {
    [InquiryStatus.NEW]: "bg-blue-100 text-blue-700",
    [InquiryStatus.CONTACTED]: "bg-yellow-100 text-yellow-600",
    [InquiryStatus.CONVERTED]: "bg-green-100 text-green-700",
    [InquiryStatus.LOST]: "bg-red-100 text-red-600",
  };

  return (
    <tr className="border-b border-border text-sm">
      <td className="px-3 py-4">
        <Checkbox
          checked={selected}
          onChange={(checked) => onSelect(inquiry.id, checked)}
          aria-label={`Select inquiry from ${inquiry.visitorName}`}
        />
      </td>
      <td className="px-3 py-4">
        <div className="font-medium text-foreground">{inquiry.visitorName}</div>
        <div className="text-xs text-muted-foreground">{inquiry.visitorEmail}</div>
      </td>
      <td className="px-3 py-4 text-muted-foreground">
        {inquiry.visitorPhone ?? "—"}
      </td>
      <td className="px-3 py-4">
        <button
          className="text-primary hover:underline"
          onClick={() => onView(inquiry.propertyId)}
        >
          {inquiry.propertyTitle}
        </button>
      </td>
      <td className="px-3 py-4">
        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${statusColors[inquiry.status]}`}>
          {inquiry.status.toLowerCase()}
        </span>
      </td>
      <td className="px-3 py-4 text-muted-foreground">
        {inquiry.agentName ?? "Unassigned"}
      </td>
      <td className="px-3 py-4 text-muted-foreground">
        {new Date(inquiry.createdAt).toLocaleDateString()}
      </td>
      <td className="px-3 py-4">
        <div className="flex flex-wrap gap-3">
          <button className="text-primary hover:underline" onClick={() => onView(inquiry.id)}>
            View
          </button>
          <button className="text-accent hover:underline" onClick={() => onAssignAgent(inquiry.id)}>
            Assign
          </button>
          <button className="text-secondary hover:underline" onClick={() => onChangeStatus(inquiry.id)}>
            Status
          </button>
          <button className="text-red-600 hover:underline" onClick={() => onDelete(inquiry.id)}>
            Delete
          </button>
        </div>
      </td>
    </tr>
  );
}
