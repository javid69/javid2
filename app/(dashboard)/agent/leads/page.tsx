"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/Button";
import { InquiryRow } from "@/components/agent/InquiryRow";
import { InquiryModal } from "@/components/agent/InquiryModal";
import { Inquiry, InquiryStatus } from "@/lib/types";
import toast from "react-hot-toast";
import { Download } from "lucide-react";

export default function LeadsPage() {
  interface InquiryWithProperty extends Inquiry {
    propertyTitle?: string;
  }

  const [inquiries, setInquiries] = useState<InquiryWithProperty[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedInquiry, setSelectedInquiry] = useState<Inquiry | null>(null);
  const [statusFilter, setStatusFilter] = useState<InquiryStatus | "ALL">(
    "ALL"
  );
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchInquiries();
  }, []);

  const fetchInquiries = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/agent/inquiries");
      if (response.ok) {
        const data = await response.json();
        setInquiries(data);
      }
    } catch (error) {
      console.error("Failed to fetch inquiries:", error);
      toast.error("Failed to load inquiries");
    } finally {
      setLoading(false);
    }
  };

  const filteredInquiries = inquiries.filter((inquiry) => {
    const matchesStatus =
      statusFilter === "ALL" || inquiry.status === statusFilter;
    const matchesSearch =
      inquiry.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inquiry.email.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this inquiry?")) return;

    try {
      const response = await fetch(`/api/agent/inquiries/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setInquiries(inquiries.filter((i) => i.id !== id));
        toast.success("Inquiry deleted successfully");
      } else {
        toast.error("Failed to delete inquiry");
      }
    } catch (error) {
      console.error("Failed to delete inquiry:", error);
      toast.error("Failed to delete inquiry");
    }
  };

  const handleStatusChange = async (id: string, status: InquiryStatus) => {
    try {
      const response = await fetch(`/api/agent/inquiries/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });

      if (response.ok) {
        setInquiries(
          inquiries.map((i) => (i.id === id ? { ...i, status } : i))
        );
        if (selectedInquiry && selectedInquiry.id === id) {
          setSelectedInquiry({ ...selectedInquiry, status });
        }
        toast.success("Status updated successfully");
      }
    } catch (error) {
      console.error("Failed to update status:", error);
      toast.error("Failed to update status");
    }
  };

  const handleNotesChange = async (notes: string) => {
    if (!selectedInquiry) return;

    try {
      const response = await fetch(`/api/agent/inquiries/${selectedInquiry.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ notes }),
      });

      if (response.ok) {
        setSelectedInquiry({ ...selectedInquiry, notes });
        setInquiries(
          inquiries.map((i) =>
            i.id === selectedInquiry.id ? { ...i, notes } : i
          )
        );
        toast.success("Notes saved successfully");
      }
    } catch (error) {
      console.error("Failed to save notes:", error);
      toast.error("Failed to save notes");
    }
  };

  const handleExportCSV = () => {
    const headers = ["Name", "Email", "Phone", "Message", "Status", "Date"];
    const rows = filteredInquiries.map((i) => [
      i.name,
      i.email,
      i.phone || "",
      i.message.replace(/,/g, ";"),
      i.status,
      new Date(i.createdAt).toLocaleDateString(),
    ]);

    const csv =
      [headers, ...rows]
        .map((row) =>
          row.map((cell) => `"${cell}"`).join(",")
        )
        .join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `inquiries-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            Inquiries & Leads
          </h1>
          <p className="text-muted-foreground mt-2">
            Manage inquiries received on your properties
          </p>
        </div>
        <Button variant="outline" onClick={handleExportCSV}>
          <Download className="w-4 h-4 mr-2" />
          Export CSV
        </Button>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <input
            type="text"
            placeholder="Search by name or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 px-4 py-2 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as InquiryStatus | "ALL")}
            className="px-4 py-2 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="ALL">All Status</option>
            <option value="NEW">New</option>
            <option value="CONTACTED">Contacted</option>
            <option value="CONVERTED">Converted</option>
            <option value="LOST">Lost</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div className="bg-white rounded-lg shadow-md p-6 text-center">
          <p className="text-muted-foreground">Loading inquiries...</p>
        </div>
      ) : filteredInquiries.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-6 text-center">
          <p className="text-muted-foreground">
            {inquiries.length === 0
              ? "No inquiries yet"
              : "No inquiries match your search"}
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-foreground">
                    Visitor
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-foreground">
                    Phone
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-foreground">
                    Property
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-foreground">
                    Message
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-foreground">
                    Status
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-foreground">
                    Date
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-foreground">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredInquiries.map((inquiry) => (
                  <InquiryRow
                    key={inquiry.id}
                    inquiry={inquiry}
                    onViewDetails={setSelectedInquiry}
                    onStatusChange={handleStatusChange}
                    onDelete={handleDelete}
                  />
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <InquiryModal
        inquiry={selectedInquiry}
        onClose={() => setSelectedInquiry(null)}
        onStatusChange={(status) => {
          if (selectedInquiry) {
            handleStatusChange(selectedInquiry.id, status);
          }
        }}
        onNotesChange={handleNotesChange}
      />
    </div>
  );
}
