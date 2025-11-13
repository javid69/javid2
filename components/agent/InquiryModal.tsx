import { Inquiry, InquiryStatus } from "@/lib/types";
import { Button } from "@/components/ui/Button";
import { X, Mail, Phone, MessageCircle } from "lucide-react";
import { useState } from "react";

interface InquiryModalProps {
  inquiry: Inquiry | null;
  onClose: () => void;
  onStatusChange: (status: InquiryStatus) => void;
  onNotesChange: (notes: string) => void;
}

export function InquiryModal({
  inquiry,
  onClose,
  onStatusChange,
  onNotesChange,
}: InquiryModalProps) {
  const [notes, setNotes] = useState(inquiry?.notes || "");
  const [isSavingNotes, setIsSavingNotes] = useState(false);

  if (!inquiry) return null;

  const handleSaveNotes = async () => {
    setIsSavingNotes(true);
    try {
      await onNotesChange(notes);
    } finally {
      setIsSavingNotes(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-border sticky top-0 bg-white">
          <h2 className="text-2xl font-bold text-foreground">Inquiry Details</h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div>
            <h3 className="text-lg font-semibold text-foreground mb-4">
              Visitor Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Name</p>
                <p className="text-foreground font-medium">{inquiry.name}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Email</p>
                <p className="text-foreground font-medium">{inquiry.email}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Phone</p>
                <p className="text-foreground font-medium">
                  {inquiry.phone || "Not provided"}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Date Received</p>
                <p className="text-foreground font-medium">
                  {new Date(inquiry.createdAt).toLocaleDateString()}{" "}
                  {new Date(inquiry.createdAt).toLocaleTimeString()}
                </p>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-foreground mb-4">
              Contact Methods
            </h3>
            <div className="flex flex-wrap gap-3">
              <a href={`mailto:${inquiry.email}`}>
                <Button variant="outline" size="sm">
                  <Mail className="w-4 h-4 mr-2" />
                  Email
                </Button>
              </a>
              {inquiry.phone && (
                <>
                  <a href={`tel:${inquiry.phone}`}>
                    <Button variant="outline" size="sm">
                      <Phone className="w-4 h-4 mr-2" />
                      Call
                    </Button>
                  </a>
                  <a
                    href={`https://wa.me/${inquiry.phone.replace(/\D/g, "")}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Button variant="outline" size="sm">
                      <MessageCircle className="w-4 h-4 mr-2" />
                      WhatsApp
                    </Button>
                  </a>
                </>
              )}
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-foreground mb-2">
              Inquiry Message
            </h3>
            <div className="bg-gray-50 rounded-lg p-4 text-foreground whitespace-pre-wrap">
              {inquiry.message}
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-foreground mb-4">
              Status & Notes
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Status
                </label>
                <select
                  value={inquiry.status}
                  onChange={(e) =>
                    onStatusChange(e.target.value as InquiryStatus)
                  }
                  className="w-full px-4 py-2 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="NEW">New</option>
                  <option value="CONTACTED">Contacted</option>
                  <option value="CONVERTED">Converted</option>
                  <option value="LOST">Lost</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Internal Notes
                </label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Add your notes here..."
                  rows={4}
                  className="w-full px-4 py-2 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <Button
                onClick={handleSaveNotes}
                disabled={isSavingNotes}
                className="w-full"
              >
                {isSavingNotes ? "Saving..." : "Save Notes"}
              </Button>
            </div>
          </div>
        </div>

        <div className="p-6 border-t border-border flex gap-3">
          <Button onClick={onClose} variant="outline" className="flex-1">
            Close
          </Button>
        </div>
      </div>
    </div>
  );
}
