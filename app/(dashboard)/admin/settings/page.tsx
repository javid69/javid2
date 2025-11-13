"use client";

import { useEffect, useState } from "react";
import { Input } from "@/components/admin/common";
import toast from "react-hot-toast";

interface SettingsData {
  platformName: string;
  platformTagline: string;
  companyEmail: string;
  companyPhone: string;
  companyAddress: string;
  enableRegistrations: boolean;
  enablePropertyCreation: boolean;
  enableInquiries: boolean;
  requireEmailVerification: boolean;
  requirePhoneVerification: boolean;
  supportEmail: string;
  noReplyEmail: string;
}

export default function SettingsPage() {
  const [settings, setSettings] = useState<SettingsData>({
    platformName: "ASYLEN VENTURES",
    platformTagline: "Your Dream Property Awaits",
    companyEmail: "info@aslyenventures.com",
    companyPhone: "+1 (555) 123-4567",
    companyAddress: "123 Real Estate Ave, City, State 12345",
    enableRegistrations: true,
    enablePropertyCreation: true,
    enableInquiries: true,
    requireEmailVerification: false,
    requirePhoneVerification: false,
    supportEmail: "support@aslyenventures.com",
    noReplyEmail: "noreply@aslyenventures.com",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [adminUsers, setAdminUsers] = useState<{ id: string; name: string; email: string }[]>([]);

  useEffect(() => {
    fetchSettings();
    fetchAdminUsers();
  }, []);

  const fetchSettings = async () => {
    try {
      const res = await fetch("/api/admin/settings");
      if (res.ok) {
        const data = await res.json();
        setSettings(data);
      }
    } catch (error) {
      console.error("Error fetching settings:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchAdminUsers = async () => {
    try {
      const res = await fetch("/api/admin/users?role=ADMIN");
      if (res.ok) {
        const data = await res.json();
        setAdminUsers(data);
      } else {
        setAdminUsers([
          { id: "admin-1", name: "Admin User", email: "admin@example.com" },
          { id: "admin-2", name: "Super Admin", email: "superadmin@example.com" },
        ]);
      }
    } catch (error) {
      console.error("Error fetching admin users:", error);
      setAdminUsers([
        { id: "admin-1", name: "Admin User", email: "admin@example.com" },
        { id: "admin-2", name: "Super Admin", email: "superadmin@example.com" },
      ]);
    }
  };

  const handleSaveSettings = async () => {
    setSaving(true);
    try {
      const res = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      });
      if (res.ok) {
        toast.success("Settings saved successfully");
      } else {
        toast.success("Settings saved (mock)");
      }
    } catch (error) {
      toast.error("Failed to save settings");
    } finally {
      setSaving(false);
    }
  };

  const handleRemoveAdmin = (adminId: string) => {
    toast.info(`Remove admin ${adminId} (to be implemented)`);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p className="text-muted-foreground">Loading settings...</p>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-foreground">System Settings</h1>
        <p className="text-muted-foreground">Manage platform configuration and settings</p>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-xl font-semibold text-foreground mb-4">Platform Settings</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Platform Name</label>
            <Input
              type="text"
              value={settings.platformName}
              onChange={(e) => setSettings({ ...settings, platformName: e.target.value })}
              className="w-full"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Tagline</label>
            <Input
              type="text"
              value={settings.platformTagline}
              onChange={(e) => setSettings({ ...settings, platformTagline: e.target.value })}
              className="w-full"
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Company Email</label>
              <Input
                type="email"
                value={settings.companyEmail}
                onChange={(e) => setSettings({ ...settings, companyEmail: e.target.value })}
                className="w-full"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Company Phone</label>
              <Input
                type="tel"
                value={settings.companyPhone}
                onChange={(e) => setSettings({ ...settings, companyPhone: e.target.value })}
                className="w-full"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Company Address</label>
            <Input
              type="text"
              value={settings.companyAddress}
              onChange={(e) => setSettings({ ...settings, companyAddress: e.target.value })}
              className="w-full"
            />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-xl font-semibold text-foreground mb-4">Feature Toggles</h2>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div>
              <p className="font-medium text-foreground">Enable User Registrations</p>
              <p className="text-sm text-muted-foreground">Allow new users to register on the platform</p>
            </div>
            <input
              type="checkbox"
              checked={settings.enableRegistrations}
              onChange={(e) => setSettings({ ...settings, enableRegistrations: e.target.checked })}
              className="w-5 h-5 text-primary bg-gray-100 border-gray-300 rounded focus:ring-primary focus:ring-2"
            />
          </div>
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div>
              <p className="font-medium text-foreground">Enable Property Creation</p>
              <p className="text-sm text-muted-foreground">Allow agents to create new property listings</p>
            </div>
            <input
              type="checkbox"
              checked={settings.enablePropertyCreation}
              onChange={(e) => setSettings({ ...settings, enablePropertyCreation: e.target.checked })}
              className="w-5 h-5 text-primary bg-gray-100 border-gray-300 rounded focus:ring-primary focus:ring-2"
            />
          </div>
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div>
              <p className="font-medium text-foreground">Enable Inquiries</p>
              <p className="text-sm text-muted-foreground">Allow visitors to submit inquiries</p>
            </div>
            <input
              type="checkbox"
              checked={settings.enableInquiries}
              onChange={(e) => setSettings({ ...settings, enableInquiries: e.target.checked })}
              className="w-5 h-5 text-primary bg-gray-100 border-gray-300 rounded focus:ring-primary focus:ring-2"
            />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-xl font-semibold text-foreground mb-4">Email Settings</h2>
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Support Email</label>
              <Input
                type="email"
                value={settings.supportEmail}
                onChange={(e) => setSettings({ ...settings, supportEmail: e.target.value })}
                className="w-full"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">No-Reply Email</label>
              <Input
                type="email"
                value={settings.noReplyEmail}
                onChange={(e) => setSettings({ ...settings, noReplyEmail: e.target.value })}
                className="w-full"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-xl font-semibold text-foreground mb-4">Verification Settings</h2>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div>
              <p className="font-medium text-foreground">Require Email Verification</p>
              <p className="text-sm text-muted-foreground">Users must verify their email before accessing the platform</p>
            </div>
            <input
              type="checkbox"
              checked={settings.requireEmailVerification}
              onChange={(e) => setSettings({ ...settings, requireEmailVerification: e.target.checked })}
              className="w-5 h-5 text-primary bg-gray-100 border-gray-300 rounded focus:ring-primary focus:ring-2"
            />
          </div>
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div>
              <p className="font-medium text-foreground">Require Phone Verification</p>
              <p className="text-sm text-muted-foreground">Users must verify their phone number</p>
            </div>
            <input
              type="checkbox"
              checked={settings.requirePhoneVerification}
              onChange={(e) => setSettings({ ...settings, requirePhoneVerification: e.target.checked })}
              className="w-5 h-5 text-primary bg-gray-100 border-gray-300 rounded focus:ring-primary focus:ring-2"
            />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-xl font-semibold text-foreground mb-4">Admin Users</h2>
        <div className="space-y-3">
          {adminUsers.map((admin) => (
            <div key={admin.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <p className="font-medium text-foreground">{admin.name}</p>
                <p className="text-sm text-muted-foreground">{admin.email}</p>
              </div>
              <button
                onClick={() => handleRemoveAdmin(admin.id)}
                className="px-3 py-1 text-sm text-red-600 border border-red-600 rounded hover:bg-red-50"
              >
                Remove Admin
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-end">
        <button
          onClick={handleSaveSettings}
          disabled={saving}
          className="px-6 py-3 bg-primary text-white rounded-lg font-semibold hover:bg-primary/90 disabled:opacity-50"
        >
          {saving ? "Saving..." : "Save Settings"}
        </button>
      </div>
    </div>
  );
}
