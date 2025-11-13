"use client";

import { Modal } from "@/components/admin/common";
import { UserRole, UserStatus } from "@/lib/types";

export type UserModalData = {
  id: string;
  name: string;
  email: string;
  phone?: string | null;
  role: UserRole;
  status: UserStatus;
  joinDate: string;
  lastActive?: string | null;
  properties: {
    id: string;
    title: string;
    status: string;
    createdAt: string;
  }[];
  inquiries: {
    id: string;
    propertyTitle: string;
    status: string;
    createdAt: string;
  }[];
};

interface UserModalProps {
  isOpen: boolean;
  onClose: () => void;
  data?: UserModalData;
  onBanToggle?: (userId: string, status: UserStatus) => void;
  onRoleChange?: (userId: string) => void;
  onDelete?: (userId: string) => void;
}

export function UserModal({ isOpen, onClose, data, onBanToggle, onRoleChange, onDelete }: UserModalProps) {
  if (!data) {
    return <Modal isOpen={isOpen} onClose={onClose} title="User Details"><p>Loading user…</p></Modal>;
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="User Details">
      <div className="space-y-6">
        <div className="space-y-2">
          <h3 className="text-xl font-semibold text-foreground">{data.name}</h3>
          <p className="text-muted-foreground text-sm">{data.email}</p>
          <p className="text-muted-foreground text-sm">{data.phone ?? "No phone"}</p>
          <div className="flex gap-2">
            <span className="px-2 py-1 text-xs font-semibold rounded-full bg-primary/10 text-primary">
              {data.role}
            </span>
            <span className="px-2 py-1 text-xs font-semibold rounded-full bg-emerald-100 text-emerald-700">
              {data.status}
            </span>
          </div>
          <p className="text-xs text-muted-foreground">
            Joined {new Date(data.joinDate).toLocaleDateString()} • Last active {data.lastActive ? new Date(data.lastActive).toLocaleString() : "Unknown"}
          </p>
        </div>

        <div className="space-y-3">
          <h4 className="text-lg font-semibold text-foreground">Properties</h4>
          {data.properties.length === 0 ? (
            <p className="text-sm text-muted-foreground">No properties associated.</p>
          ) : (
            <ul className="space-y-2">
              {data.properties.map((property) => (
                <li key={property.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium">{property.title}</p>
                    <p className="text-xs text-muted-foreground">{property.id}</p>
                  </div>
                  <div className="text-right text-sm">
                    <p className="capitalize">{property.status.toLowerCase()}</p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(property.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="space-y-3">
          <h4 className="text-lg font-semibold text-foreground">Inquiries</h4>
          {data.inquiries.length === 0 ? (
            <p className="text-sm text-muted-foreground">No inquiries from this user.</p>
          ) : (
            <ul className="space-y-2">
              {data.inquiries.map((inquiry) => (
                <li key={inquiry.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium">{inquiry.propertyTitle}</p>
                    <p className="text-xs text-muted-foreground">{inquiry.id}</p>
                  </div>
                  <div className="text-right text-sm">
                    <p className="capitalize">{inquiry.status.toLowerCase()}</p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(inquiry.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="flex flex-wrap gap-3">
          {onRoleChange && (
            <button
              onClick={() => onRoleChange(data.id)}
              className="px-4 py-2 rounded-lg bg-primary text-white font-semibold hover:bg-primary/90 transition"
            >
              Change Role
            </button>
          )}
          {onBanToggle && (
            <button
              onClick={() => onBanToggle(data.id, data.status)}
              className="px-4 py-2 rounded-lg bg-secondary text-white font-semibold hover:bg-secondary/90 transition"
            >
              {data.status === UserStatus.BANNED ? "Unban User" : "Ban User"}
            </button>
          )}
          {onDelete && (
            <button
              onClick={() => onDelete(data.id)}
              className="px-4 py-2 rounded-lg bg-red-600 text-white font-semibold hover:bg-red-700 transition"
            >
              Delete User
            </button>
          )}
        </div>
      </div>
    </Modal>
  );
}
