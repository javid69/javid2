"use client";

import Image from "next/image";
import { Modal } from "@/components/admin/common";
import { ApprovalStatus, PropertyStatus } from "@/lib/types";

interface PropertyModalProps {
  isOpen: boolean;
  onClose: () => void;
  data?: {
    id: string;
    title: string;
    images: string[];
    price: number;
    category: string;
    status: PropertyStatus;
    approvalStatus: ApprovalStatus;
    location: string;
    description: string;
    agent: {
      id: string;
      name: string;
      email: string;
      phone?: string | null;
    };
    inquiries: {
      id: string;
      visitorName: string;
      status: string;
      createdAt: string;
    }[];
    createdAt: string;
    views: number;
  };
  onApprove?: (propertyId: string, approvalStatus: ApprovalStatus) => void;
  onFeatureToggle?: (propertyId: string, isFeatured: boolean) => void;
  onDelete?: (propertyId: string) => void;
}

export function PropertyModal({ isOpen, onClose, data, onApprove, onFeatureToggle, onDelete }: PropertyModalProps) {
  if (!data) {
    return (
      <Modal isOpen={isOpen} onClose={onClose} title="Property Details">
        <p className="text-muted-foreground">Loading property details…</p>
      </Modal>
    );
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Property Details">
      <div className="space-y-6">
        <div>
          <h3 className="text-2xl font-semibold text-foreground">{data.title}</h3>
          <p className="text-sm text-muted-foreground">{data.location}</p>
          <p className="text-xl font-bold text-primary mt-2">${data.price.toLocaleString()}</p>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {data.images.length === 0 ? (
            <div className="col-span-2 flex items-center justify-center h-48 bg-gray-100 rounded-lg text-muted-foreground">
              No images available
            </div>
          ) : (
            data.images.map((src) => (
              <div key={src} className="relative w-full h-40 rounded-lg overflow-hidden">
                <Image src={src} alt={data.title} fill className="object-cover" />
              </div>
            ))
          )}
        </div>

        <div>
          <h4 className="text-lg font-semibold text-foreground mb-2">Description</h4>
          <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap">
            {data.description}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 bg-gray-50 rounded-lg">
            <p className="text-xs uppercase text-muted-foreground">Status</p>
            <p className="text-sm font-semibold text-foreground capitalize">{data.status.toLowerCase()}</p>
          </div>
          <div className="p-4 bg-gray-50 rounded-lg">
            <p className="text-xs uppercase text-muted-foreground">Approval</p>
            <p className="text-sm font-semibold text-foreground capitalize">{data.approvalStatus.toLowerCase()}</p>
          </div>
          <div className="p-4 bg-gray-50 rounded-lg">
            <p className="text-xs uppercase text-muted-foreground">Created</p>
            <p className="text-sm font-semibold text-foreground">{new Date(data.createdAt).toLocaleString()}</p>
          </div>
          <div className="p-4 bg-gray-50 rounded-lg">
            <p className="text-xs uppercase text-muted-foreground">Views</p>
            <p className="text-sm font-semibold text-foreground">{data.views.toLocaleString()}</p>
          </div>
        </div>

        <div className="p-4 bg-gray-50 rounded-lg">
          <h4 className="text-lg font-semibold text-foreground mb-2">Agent Information</h4>
          <p className="font-medium text-foreground">{data.agent.name}</p>
          <p className="text-sm text-muted-foreground">{data.agent.email}</p>
          <p className="text-sm text-muted-foreground">{data.agent.phone ?? "No phone"}</p>
        </div>

        <div>
          <h4 className="text-lg font-semibold text-foreground mb-2">Inquiries</h4>
          {data.inquiries.length === 0 ? (
            <p className="text-sm text-muted-foreground">No inquiries for this property yet.</p>
          ) : (
            <ul className="space-y-2">
              {data.inquiries.map((inquiry) => (
                <li key={inquiry.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-foreground">{inquiry.visitorName}</p>
                    <p className="text-xs text-muted-foreground">{inquiry.id}</p>
                  </div>
                  <div className="text-right text-sm">
                    <p className="capitalize">{inquiry.status.toLowerCase()}</p>
                    <p className="text-xs text-muted-foreground">{new Date(inquiry.createdAt).toLocaleDateString()}</p>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="flex flex-wrap gap-3">
          {onApprove && (
            <button
              onClick={() => onApprove(data.id, data.approvalStatus)}
              className="px-4 py-2 rounded-lg bg-primary text-white font-semibold hover:bg-primary/90 transition"
            >
              {data.approvalStatus === ApprovalStatus.APPROVED ? "Revoke Approval" : "Approve Property"}
            </button>
          )}
          {onFeatureToggle && (
            <button
              onClick={() => onFeatureToggle(data.id, true)}
              className="px-4 py-2 rounded-lg bg-secondary text-white font-semibold hover:bg-secondary/90 transition"
            >
              Feature Property
            </button>
          )}
          {onDelete && (
            <button
              onClick={() => onDelete(data.id)}
              className="px-4 py-2 rounded-lg bg-red-600 text-white font-semibold hover:bg-red-700 transition"
            >
              Delete Property
            </button>
          )}
        </div>
      </div>
    </Modal>
  );
}
