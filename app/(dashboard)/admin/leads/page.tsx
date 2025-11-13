"use client";

import { useEffect, useState } from "react";
import { InquiryRow } from "@/components/admin/InquiryRow";
import { ConfirmDialog, Input, Select } from "@/components/admin/common";
import { InquiryStatus } from "@/lib/types";
import { Search } from "lucide-react";
import toast from "react-hot-toast";

interface Inquiry {
  id: string;
  visitorName: string;
  visitorEmail: string;
  visitorPhone?: string | null;
  propertyTitle: string;
  propertyId: string;
  status: InquiryStatus;
  agentName?: string | null;
  createdAt: string;
}

export default function LeadsManagementPage() {
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedInquiries, setSelectedInquiries] = useState<Set<string>>(new Set());
  const [statusFilter, setStatusFilter] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
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
    fetchInquiries();
  }, []);

  const fetchInquiries = async () => {
    try {
      const res = await fetch("/api/admin/inquiries");
      if (res.ok) {
        const data = await res.json();
        setInquiries(data);
      } else {
        setInquiries(generateMockInquiries());
      }
    } catch (error) {
      console.error("Error fetching inquiries:", error);
      setInquiries(generateMockInquiries());
    } finally {
      setLoading(false);
    }
  };

  const generateMockInquiries = (): Inquiry[] => {
    return Array.from({ length: 20 }, (_, i) => ({
      id: `inq-${i + 1}`,
      visitorName: `Visitor ${i + 1}`,
      visitorEmail: `visitor${i + 1}@example.com`,
      visitorPhone: i % 2 === 0 ? `555-120${i}` : null,
      propertyTitle: `Property ${(i % 8) + 1}`,
      propertyId: `prop-${(i % 8) + 1}`,
      status: Object.values(InquiryStatus)[i % Object.values(InquiryStatus).length],
      agentName: i % 3 === 0 ? `Agent ${(i % 5) + 1}` : null,
      createdAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
    }));
  };

  const filteredInquiries = inquiries.filter((inquiry) => {
    const matchesStatus = !statusFilter || inquiry.status === statusFilter;
    const matchesSearch =
      inquiry.visitorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inquiry.visitorEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inquiry.propertyTitle.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedInquiries(new Set(filteredInquiries.map((i) => i.id)));
    } else {
      setSelectedInquiries(new Set());
    }
  };

  const handleSelectInquiry = (inquiryId: string, checked: boolean) => {
    const newSelected = new Set(selectedInquiries);
    if (checked) {
      newSelected.add(inquiryId);
    } else {
      newSelected.delete(inquiryId);
    }
    setSelectedInquiries(newSelected);
  };

  const handleViewInquiry = (inquiryId: string) => {
    toast.info(`View inquiry ${inquiryId} (to be implemented)`);
  };

  const handleAssignAgent = (inquiryId: string) => {
    toast.info(`Assign agent for inquiry ${inquiryId} (to be implemented)`);
  };

  const handleChangeStatus = (inquiryId: string) => {
    toast.info(`Change status for inquiry ${inquiryId} (to be implemented)`);
  };

  const handleDeleteInquiry = (inquiryId: string) => {
    setConfirmDialog({
      isOpen: true,
      title: "Delete Inquiry",
      message: "Are you sure you want to delete this inquiry? This action cannot be undone.",
      onConfirm: async () => {
        try {
          const res = await fetch(`/api/admin/inquiries/${inquiryId}`, { method: "DELETE" });
          if (res.ok) {
            toast.success("Inquiry deleted successfully");
            fetchInquiries();
          } else {
            setInquiries((prev) => prev.filter((i) => i.id !== inquiryId));
            toast.success("Inquiry deleted (mock)");
          }
        } catch (error) {
          toast.error("Failed to delete inquiry");
        }
      },
      variant: "danger",
    });
  };

  const handleBulkAction = (action: string) => {
    if (selectedInquiries.size === 0) {
      toast.error("No inquiries selected");
      return;
    }
    toast.info(`Bulk action "${action}" for ${selectedInquiries.size} inquiries (to be implemented)`);
  };

  const handleExport = (format: "csv" | "excel") => {
    toast.success(`Exported inquiries to ${format.toUpperCase()} (mock)`);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p className="text-muted-foreground">Loading inquiries...</p>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-foreground">All Inquiries & Leads</h1>
        <p className="text-muted-foreground">Manage leads and track inquiry progress</p>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex flex-col lg:flex-row gap-4 mb-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search by visitor or property..."
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
              ...Object.values(InquiryStatus).map((s) => ({ value: s, label: s.toLowerCase() })),
            ]}
            className="w-full lg:w-40"
          />
          <button
            onClick={() => handleExport("csv")}
            className="px-4 py-2 bg-primary text-white rounded-lg font-semibold hover:bg-primary/90"
          >
            Export CSV
          </button>
          <button
            onClick={() => handleExport("excel")}
            className="px-4 py-2 bg-secondary text-white rounded-lg font-semibold hover:bg-secondary/90"
          >
            Export Excel
          </button>
        </div>

        {selectedInquiries.size > 0 && (
          <div className="flex flex-wrap gap-3 mb-4 p-4 bg-gray-50 rounded-lg">
            <span className="text-sm font-medium text-foreground">{selectedInquiries.size} selected</span>
            <button
              onClick={() => handleBulkAction("assign")}
              className="text-sm text-primary hover:underline"
            >
              Assign Agent
            </button>
            <button
              onClick={() => handleBulkAction("status")}
              className="text-sm text-secondary hover:underline"
            >
              Change Status
            </button>
            <button
              onClick={() => handleBulkAction("delete")}
              className="text-sm text-red-600 hover:underline"
            >
              Delete Inquiries
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
                    checked={selectedInquiries.size === filteredInquiries.length && filteredInquiries.length > 0}
                    onChange={(e) => handleSelectAll(e.target.checked)}
                    className="w-4 h-4 text-primary bg-gray-100 border-gray-300 rounded focus:ring-primary focus:ring-2"
                  />
                </th>
                <th className="px-3 py-3">Visitor</th>
                <th className="px-3 py-3">Contact</th>
                <th className="px-3 py-3">Property</th>
                <th className="px-3 py-3">Status</th>
                <th className="px-3 py-3">Agent</th>
                <th className="px-3 py-3">Date</th>
                <th className="px-3 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredInquiries.length === 0 ? (
                <tr>
                  <td colSpan={8} className="text-center py-8 text-muted-foreground">
                    No inquiries found
                  </td>
                </tr>
              ) : (
                filteredInquiries.map((inquiry) => (
                  <InquiryRow
                    key={inquiry.id}
                    inquiry={inquiry}
                    selected={selectedInquiries.has(inquiry.id)}
                    onSelect={handleSelectInquiry}
                    onView={handleViewInquiry}
                    onAssignAgent={handleAssignAgent}
                    onChangeStatus={handleChangeStatus}
                    onDelete={handleDeleteInquiry}
                  />
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="mt-4 flex items-center justify-between text-sm text-muted-foreground">
          <p>Showing {filteredInquiries.length} of {inquiries.length} inquiries</p>
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
