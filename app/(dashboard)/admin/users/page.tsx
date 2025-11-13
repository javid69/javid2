"use client";

import { useEffect, useState } from "react";
import { UserRow } from "@/components/admin/UserRow";
import { UserModal, type UserModalData } from "@/components/admin/UserModal";
import { ConfirmDialog, Input, Select } from "@/components/admin/common";
import { UserRole, UserStatus } from "@/lib/types";
import { Search } from "lucide-react";
import toast from "react-hot-toast";

interface User {
  id: string;
  name: string;
  email: string;
  phone?: string | null;
  role: UserRole;
  status: UserStatus;
  propertiesCount: number;
  joinDate: string;
}

export default function UsersManagementPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedUsers, setSelectedUsers] = useState<Set<string>>(new Set());
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  const [showUserModal, setShowUserModal] = useState(false);
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
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await fetch("/api/admin/users");
      if (res.ok) {
        const data = await res.json();
        setUsers(data);
      } else {
        setUsers(generateMockUsers());
      }
    } catch (error) {
      console.error("Error fetching users:", error);
      setUsers(generateMockUsers());
    } finally {
      setLoading(false);
    }
  };

  const generateMockUsers = (): User[] => {
    return Array.from({ length: 25 }, (_, i) => ({
      id: `user-${i + 1}`,
      name: `User ${i + 1}`,
      email: `user${i + 1}@example.com`,
      phone: i % 2 === 0 ? `555-000${i.toString().padStart(2, "0")}` : null,
      role: [UserRole.USER, UserRole.AGENT, UserRole.ADMIN][i % 3],
      status: [UserStatus.ACTIVE, UserStatus.INACTIVE, UserStatus.BANNED][i % 3],
      propertiesCount: i % 3 === 1 ? Math.floor(Math.random() * 10) : 0,
      joinDate: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000).toISOString(),
    }));
  };

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = !roleFilter || user.role === roleFilter;
    const matchesStatus = !statusFilter || user.status === statusFilter;
    return matchesSearch && matchesRole && matchesStatus;
  });

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedUsers(new Set(filteredUsers.map((u) => u.id)));
    } else {
      setSelectedUsers(new Set());
    }
  };

  const handleSelectUser = (userId: string, checked: boolean) => {
    const newSelected = new Set(selectedUsers);
    if (checked) {
      newSelected.add(userId);
    } else {
      newSelected.delete(userId);
    }
    setSelectedUsers(newSelected);
  };

  const handleViewUser = (userId: string) => {
    setSelectedUser(userId);
    setShowUserModal(true);
  };

  const handleChangeRole = (userId: string) => {
    toast.success(`Role change dialog for user ${userId} (to be implemented)`);
  };

  const handleToggleBan = (userId: string, currentStatus: UserStatus) => {
    const newStatus = currentStatus === UserStatus.BANNED ? UserStatus.ACTIVE : UserStatus.BANNED;
    setConfirmDialog({
      isOpen: true,
      title: newStatus === UserStatus.BANNED ? "Ban User" : "Unban User",
      message: `Are you sure you want to ${newStatus === UserStatus.BANNED ? "ban" : "unban"} this user?`,
      onConfirm: async () => {
        try {
          const endpoint = newStatus === UserStatus.BANNED ? `/api/admin/users/${userId}/ban` : `/api/admin/users/${userId}/unban`;
          const res = await fetch(endpoint, { method: "POST" });
          if (res.ok) {
            toast.success(`User ${newStatus === UserStatus.BANNED ? "banned" : "unbanned"} successfully`);
            fetchUsers();
          } else {
            setUsers((prev) =>
              prev.map((u) => (u.id === userId ? { ...u, status: newStatus } : u))
            );
            toast.success(`User ${newStatus === UserStatus.BANNED ? "banned" : "unbanned"} (mock)`);
          }
        } catch (error) {
          toast.error("Failed to update user status");
        }
      },
      variant: newStatus === UserStatus.BANNED ? "danger" : "default",
    });
  };

  const handleDeleteUser = (userId: string) => {
    setConfirmDialog({
      isOpen: true,
      title: "Delete User",
      message: "Are you sure you want to delete this user? This action cannot be undone.",
      onConfirm: async () => {
        try {
          const res = await fetch(`/api/admin/users/${userId}`, { method: "DELETE" });
          if (res.ok) {
            toast.success("User deleted successfully");
            fetchUsers();
          } else {
            setUsers((prev) => prev.filter((u) => u.id !== userId));
            toast.success("User deleted (mock)");
          }
        } catch (error) {
          toast.error("Failed to delete user");
        }
      },
      variant: "danger",
    });
  };

  const handleBulkAction = (action: string) => {
    if (selectedUsers.size === 0) {
      toast.error("No users selected");
      return;
    }
    toast.info(`Bulk action "${action}" for ${selectedUsers.size} users (to be implemented)`);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p className="text-muted-foreground">Loading users...</p>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-foreground">Manage Users</h1>
        <p className="text-muted-foreground">View and manage all platform users</p>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex flex-col lg:flex-row gap-4 mb-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-full"
            />
          </div>
          <Select
            value={roleFilter}
            onChange={setRoleFilter}
            options={[
              { value: "", label: "All Roles" },
              { value: UserRole.USER, label: "User" },
              { value: UserRole.AGENT, label: "Agent" },
              { value: UserRole.ADMIN, label: "Admin" },
            ]}
            className="w-full lg:w-40"
          />
          <Select
            value={statusFilter}
            onChange={setStatusFilter}
            options={[
              { value: "", label: "All Status" },
              { value: UserStatus.ACTIVE, label: "Active" },
              { value: UserStatus.INACTIVE, label: "Inactive" },
              { value: UserStatus.BANNED, label: "Banned" },
            ]}
            className="w-full lg:w-40"
          />
        </div>

        {selectedUsers.size > 0 && (
          <div className="flex flex-wrap gap-3 mb-4 p-4 bg-gray-50 rounded-lg">
            <span className="text-sm font-medium text-foreground">{selectedUsers.size} selected</span>
            <button
              onClick={() => handleBulkAction("change-role")}
              className="text-sm text-primary hover:underline"
            >
              Change Role
            </button>
            <button
              onClick={() => handleBulkAction("ban")}
              className="text-sm text-secondary hover:underline"
            >
              Ban Users
            </button>
            <button
              onClick={() => handleBulkAction("delete")}
              className="text-sm text-red-600 hover:underline"
            >
              Delete Users
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
                    checked={selectedUsers.size === filteredUsers.length && filteredUsers.length > 0}
                    onChange={(e) => handleSelectAll(e.target.checked)}
                    className="w-4 h-4 text-primary bg-gray-100 border-gray-300 rounded focus:ring-primary focus:ring-2"
                  />
                </th>
                <th className="px-3 py-3">ID</th>
                <th className="px-3 py-3">Name & Email</th>
                <th className="px-3 py-3">Phone</th>
                <th className="px-3 py-3">Role</th>
                <th className="px-3 py-3">Status</th>
                <th className="px-3 py-3">Properties</th>
                <th className="px-3 py-3">Join Date</th>
                <th className="px-3 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={9} className="text-center py-8 text-muted-foreground">
                    No users found
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => (
                  <UserRow
                    key={user.id}
                    user={user}
                    selected={selectedUsers.has(user.id)}
                    onSelect={handleSelectUser}
                    onView={handleViewUser}
                    onChangeRole={handleChangeRole}
                    onToggleBan={handleToggleBan}
                    onDelete={handleDeleteUser}
                  />
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="mt-4 flex items-center justify-between text-sm text-muted-foreground">
          <p>Showing {filteredUsers.length} of {users.length} users</p>
          <div className="flex gap-2">
            <button className="px-3 py-1 border border-border rounded hover:bg-gray-50">Previous</button>
            <button className="px-3 py-1 border border-border rounded hover:bg-gray-50">Next</button>
          </div>
        </div>
      </div>

      {showUserModal && selectedUser && (() => {
        const user = users.find((u) => u.id === selectedUser);
        if (!user) return null;
        
        const modalData: UserModalData = {
          id: user.id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          role: user.role,
          status: user.status,
          joinDate: user.joinDate,
          lastActive: new Date().toISOString(),
          properties: [],
          inquiries: [],
        };

        return (
          <UserModal
            isOpen={showUserModal}
            onClose={() => {
              setShowUserModal(false);
              setSelectedUser(null);
            }}
            data={modalData}
            onBanToggle={(userId, status) => {
              handleToggleBan(userId, status);
              setShowUserModal(false);
            }}
            onRoleChange={(userId) => {
              handleChangeRole(userId);
              setShowUserModal(false);
            }}
            onDelete={(userId) => {
              handleDeleteUser(userId);
              setShowUserModal(false);
            }}
          />
        );
      })()}

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
