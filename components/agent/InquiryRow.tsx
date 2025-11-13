import { Inquiry, InquiryStatus } from "@/lib/types";
import { Button } from "@/components/ui/Button";
import { Trash2, Eye } from "lucide-react";

interface InquiryRowProps {
  inquiry: Inquiry & { propertyTitle?: string };
  onViewDetails: (inquiry: Inquiry) => void;
  onStatusChange: (id: string, status: InquiryStatus) => void;
  onDelete: (id: string) => void;
}

const statusColors = {
  NEW: "bg-blue-100 text-blue-800",
  CONTACTED: "bg-yellow-100 text-yellow-800",
  CONVERTED: "bg-green-100 text-green-800",
  LOST: "bg-red-100 text-red-800",
};

export function InquiryRow({
  inquiry,
  onViewDetails,
  onStatusChange,
  onDelete,
}: InquiryRowProps) {
  return (
    <tr className="border-b border-border hover:bg-gray-50 transition-colors">
      <td className="px-4 py-4">
        <div className="font-medium text-foreground">{inquiry.name}</div>
        <div className="text-sm text-muted-foreground">{inquiry.email}</div>
      </td>
      <td className="px-4 py-4">
        <div className="text-sm text-foreground">{inquiry.phone || "N/A"}</div>
      </td>
      <td className="px-4 py-4">
        <div className="text-sm text-foreground">
          {inquiry.propertyTitle || "Property #" + inquiry.propertyId.slice(0, 8)}
        </div>
      </td>
      <td className="px-4 py-4">
        <div className="text-sm text-foreground line-clamp-2">
          {inquiry.message}
        </div>
      </td>
      <td className="px-4 py-4">
        <span
          className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${statusColors[inquiry.status]}`}
        >
          {inquiry.status}
        </span>
      </td>
      <td className="px-4 py-4">
        <div className="text-sm text-muted-foreground">
          {new Date(inquiry.createdAt).toLocaleDateString()}
        </div>
      </td>
      <td className="px-4 py-4">
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="ghost"
            onClick={() => onViewDetails(inquiry)}
          >
            <Eye className="w-4 h-4" />
          </Button>
          <select
            value={inquiry.status}
            onChange={(e) => onStatusChange(inquiry.id, e.target.value as InquiryStatus)}
            className="px-2 py-1 text-sm border border-input rounded focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="NEW">New</option>
            <option value="CONTACTED">Contacted</option>
            <option value="CONVERTED">Converted</option>
            <option value="LOST">Lost</option>
          </select>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => onDelete(inquiry.id)}
            className="text-red-600 hover:bg-red-50"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </td>
    </tr>
  );
}
