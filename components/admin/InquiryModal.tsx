"use client";

import { Modal } from "@/components/admin/common";
import { InquiryStatus } from "@/lib/types";

interface InquiryModalProps {
  isOpen: boolean;
  onClose: () => void;
  data?: {
    id: string;
    visitorName: string;
    visitorEmail: string;
    visitorPhone?: string | null;
    propertyTitle: string;
    propertyId: string;
    status: InquiryStatus;
    agentName?: string | null;
    message: string;
    notes?: string | null;
    timeline: { id: string; label: string; date: string }[];
    createdAt: string;
  };
  onAssignAgent?: (inquiryId: string) => void;
  onChangeStatus?: (inquiryId: string) => void;
  onDelete?: (inquiryId: string) => void;
}

export function InquiryModal({ isOpen, onClose, data, onAssignAgent, onChangeStatus, onDelete }: InquiryModalProps) {
  if (!data) {
    return (
      <Modal isOpen={isOpen} onClose={onClose} title="Inquiry Details">
        <p className="text-muted-foreground">Loading inquiry details…</p>
      </Modal>
    );
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Inquiry Details">
      <div className="space-y-6">
        <div>
          <h3 className="text-xl font-semibold text-foreground">{data.visitorName}</h3>
          <p className="text-sm text-muted-foreground">{data.visitorEmail}</p>
          <p className="text-sm text-muted-foreground">{data.visitorPhone ?? "No phone"}</p>
        </div>

        <div className="p-4 bg-gray-50 rounded-lg">
          <p className="text-xs uppercase text-muted-foreground mb-1">Property</p>
          <p className="font-medium text-foreground">{data.propertyTitle}</p>
          <p className="text-xs text-muted-foreground">{data.propertyId}</p>
        </div>

        <div>
          <h4 className="text-lg font-semibold text-foreground mb-2">Message</h4>
          <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap p-4 bg-gray-50 rounded-lg">
            {data.message}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 bg-gray-50 rounded-lg">
            <p className="text-xs uppercase text-muted-foreground">Status</p>
            <p className="text-sm font-semibold text-foreground capitalize">{data.status.toLowerCase()}</p>
          </div>
          <div className="p-4 bg-gray-50 rounded-lg">
            <p className="text-xs uppercase text-muted-foreground">Assigned Agent</p>
            <p className="text-sm font-semibold text-foreground">{data.agentName ?? "Unassigned"}</p>
          </div>
        </div>

        <div>
          <h4 className="text-lg font-semibold text-foreground mb-2">Timeline</h4>
          <div className="space-y-2">
            {data.timeline.map((item) => (
              <div key={item.id} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground">{item.label}</p>
                  <p className="text-xs text-muted-foreground">{new Date(item.date).toLocaleString()}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {data.notes && (
          <div>
            <h4 className="text-lg font-semibold text-foreground mb-2">Notes</h4>
            <p className="text-sm text-muted-foreground p-4 bg-gray-50 rounded-lg">{data.notes}</p>
          </div>
        )}

        <div className="flex flex-wrap gap-3">
          {onAssignAgent && (
            <button
              onClick={() => onAssignAgent(data.id)}
              className="px-4 py-2 rounded-lg bg-primary text-white font-semibold hover:bg-primary/90 transition"
            >
              Assign Agent
            </button>
          )}
          {onChangeStatus && (
            <button
              onClick={() => onChangeStatus(data.id)}
              className="px-4 py-2 rounded-lg bg-secondary text-white font-semibold hover:bg-secondary/90 transition"
            >
              Change Status
            </button>
          )}
          {onDelete && (
            <button
              onClick={() => onDelete(data.id)}
              className="px-4 py-2 rounded-lg bg-red-600 text-white font-semibold hover:bg-red-700 transition"
            >
              Delete Inquiry
            </button>
          )}
        </div>
      </div>
    </Modal>
  );
}
