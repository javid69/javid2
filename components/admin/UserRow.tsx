"use client";

import { Checkbox } from "@/components/admin/common";
import { UserRole, UserStatus } from "@/lib/types";

interface UserRowProps {
  user: {
    id: string;
    name: string;
    email: string;
    phone?: string | null;
    role: UserRole;
    status: UserStatus;
    propertiesCount: number;
    joinDate: string;
  };
  selected: boolean;
  onSelect: (userId: string, checked: boolean) => void;
  onView: (userId: string) => void;
  onChangeRole: (userId: string) => void;
  onToggleBan: (userId: string, status: UserStatus) => void;
  onDelete: (userId: string) => void;
}

export function UserRow({
  user,
  selected,
  onSelect,
  onView,
  onChangeRole,
  onToggleBan,
  onDelete,
}: UserRowProps) {
  const statusBadge = {
    [UserStatus.ACTIVE]: "bg-green-100 text-green-700",
    [UserStatus.INACTIVE]: "bg-gray-100 text-gray-700",
    [UserStatus.BANNED]: "bg-red-100 text-red-600",
  }[user.status];

  return (
    <tr className="border-b border-border text-sm text-foreground">
      <td className="px-3 py-4">
        <Checkbox
          checked={selected}
          onChange={(checked) => onSelect(user.id, checked)}
          aria-label={`Select ${user.name}`}
        />
      </td>
      <td className="px-3 py-4">
        <div className="font-semibold text-sm">{user.id}</div>
      </td>
      <td className="px-3 py-4">
        <div className="font-medium">{user.name}</div>
        <div className="text-xs text-muted-foreground">{user.email}</div>
      </td>
      <td className="px-3 py-4">
        <div className="text-sm">{user.phone ?? "—"}</div>
      </td>
      <td className="px-3 py-4 capitalize">{user.role.toLowerCase()}</td>
      <td className="px-3 py-4">
        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${statusBadge}`}>
          {user.status}
        </span>
      </td>
      <td className="px-3 py-4 text-center">{user.propertiesCount}</td>
      <td className="px-3 py-4 text-sm text-muted-foreground">
        {new Date(user.joinDate).toLocaleDateString()}
      </td>
      <td className="px-3 py-4">
        <div className="flex items-center gap-3">
          <button
            className="text-primary hover:underline"
            onClick={() => onView(user.id)}
          >
            View
          </button>
          <button
            className="text-accent hover:underline"
            onClick={() => onChangeRole(user.id)}
          >
            Edit Role
          </button>
          <button
            className="text-secondary hover:underline"
            onClick={() => onToggleBan(user.id, user.status)}
          >
            {user.status === UserStatus.BANNED ? "Unban" : "Ban"}
          </button>
          <button
            className="text-red-600 hover:underline"
            onClick={() => onDelete(user.id)}
          >
            Delete
          </button>
        </div>
      </td>
    </tr>
  );
}
