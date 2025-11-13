import Link from "next/link";
import { Property } from "@/lib/types";
import { Button } from "@/components/ui/Button";
import { Trash2, Edit, Star, CheckCircle } from "lucide-react";

interface PropertyRowProps {
  property: Property;
  onDelete: (id: string) => void;
  onToggleFeatured: (id: string) => void;
  onMarkSold: (id: string) => void;
}

export function PropertyRow({
  property,
  onDelete,
  onToggleFeatured,
  onMarkSold,
}: PropertyRowProps) {
  return (
    <tr className="border-b border-border hover:bg-gray-50 transition-colors">
      <td className="px-4 py-4">
        <div className="w-12 h-12 rounded bg-gray-200 flex items-center justify-center text-sm">
          {property.images[0] ? "🖼️" : "📷"}
        </div>
      </td>
      <td className="px-4 py-4">
        <Link
          href={`/agent/properties/${property.id}/edit`}
          className="font-medium text-primary hover:underline"
        >
          {property.title}
        </Link>
      </td>
      <td className="px-4 py-4">
        <div className="text-sm font-semibold text-foreground">
          ${property.price.toLocaleString()}
        </div>
      </td>
      <td className="px-4 py-4">
        <div className="text-sm text-foreground">{property.propertyType}</div>
      </td>
      <td className="px-4 py-4">
        <div className="text-sm text-foreground">
          {property.address}, {property.city}
        </div>
      </td>
      <td className="px-4 py-4">
        <span
          className={`inline-block px-2 py-1 rounded text-xs font-medium ${
            property.status === "AVAILABLE"
              ? "bg-green-100 text-green-800"
              : property.status === "SOLD"
                ? "bg-red-100 text-red-800"
                : property.status === "RENTED"
                  ? "bg-blue-100 text-blue-800"
                  : "bg-yellow-100 text-yellow-800"
          }`}
        >
          {property.status}
        </span>
      </td>
      <td className="px-4 py-4">
        <div className="text-sm text-foreground">
          {new Date(property.createdAt).toLocaleDateString()}
        </div>
      </td>
      <td className="px-4 py-4">
        <div className="text-sm font-medium text-foreground">{property.views}</div>
      </td>
      <td className="px-4 py-4">
        <div className="text-sm font-medium text-foreground">
          {/* TODO: Get inquiry count from API */}0
        </div>
      </td>
      <td className="px-4 py-4">
        <div className="flex items-center gap-2">
          <Link href={`/agent/properties/${property.id}/edit`}>
            <Button size="sm" variant="ghost">
              <Edit className="w-4 h-4" />
            </Button>
          </Link>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => onToggleFeatured(property.id)}
          >
            <Star
              className={`w-4 h-4 ${property.featured ? "fill-yellow-400" : ""}`}
            />
          </Button>
          {property.status !== "SOLD" && (
            <Button
              size="sm"
              variant="ghost"
              onClick={() => onMarkSold(property.id)}
            >
              <CheckCircle className="w-4 h-4" />
            </Button>
          )}
          <Button
            size="sm"
            variant="ghost"
            onClick={() => onDelete(property.id)}
            className="text-red-600 hover:bg-red-50"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </td>
    </tr>
  );
}
