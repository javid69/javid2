"use client";

import { Input } from "@/components/admin/common";

export interface SettingsFormValues {
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

interface AdminUserSummary {
  id: string;
  name: string;
  email: string;
}

interface SettingsFormProps {
  values: SettingsFormValues;
  adminUsers: AdminUserSummary[];
  saving: boolean;
  onChange: (values: SettingsFormValues) => void;
  onRemoveAdmin: (adminId: string) => void;
  onSubmit: () => void;
}

export function SettingsForm({ values, adminUsers, saving, onChange, onRemoveAdmin, onSubmit }: SettingsFormProps) {
  const updateField = <K extends keyof SettingsFormValues>(key: K, value: SettingsFormValues[K]) => {
    onChange({ ...values, [key]: value });
  };

  return (
    <form
      className="space-y-6"
      onSubmit={(event) => {
        event.preventDefault();
        onSubmit();
      }}
    >
      <section className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold text-foreground mb-4">Platform Settings</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Platform Name</label>
            <Input
              type="text"
              value={values.platformName}
              onChange={(event) => updateField("platformName", event.target.value)}
              className="w-full"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Tagline</label>
            <Input
              type="text"
              value={values.platformTagline}
              onChange={(event) => updateField("platformTagline", event.target.value)}
              className="w-full"
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Company Email</label>
              <Input
                type="email"
                value={values.companyEmail}
                onChange={(event) => updateField("companyEmail", event.target.value)}
                className="w-full"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Company Phone</label>
              <Input
                type="tel"
                value={values.companyPhone}
                onChange={(event) => updateField("companyPhone", event.target.value)}
                className="w-full"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Company Address</label>
            <Input
              type="text"
              value={values.companyAddress}
              onChange={(event) => updateField("companyAddress", event.target.value)}
              className="w-full"
            />
          </div>
        </div>
      </section>

      <section className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold text-foreground mb-4">Feature Toggles</h2>
        <div className="space-y-4">
          {[{
            label: "Enable User Registrations",
            description: "Allow new users to register on the platform",
            key: "enableRegistrations" as const,
          },
          {
            label: "Enable Property Creation",
            description: "Allow agents to create new property listings",
            key: "enablePropertyCreation" as const,
          },
          {
            label: "Enable Inquiries",
            description: "Allow visitors to submit inquiries",
            key: "enableInquiries" as const,
          }].map((toggle) => (
            <div key={toggle.key} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <p className="font-medium text-foreground">{toggle.label}</p>
                <p className="text-sm text-muted-foreground">{toggle.description}</p>
              </div>
              <input
                type="checkbox"
                checked={values[toggle.key]}
                onChange={(event) => updateField(toggle.key, event.target.checked)}
                className="w-5 h-5 text-primary bg-gray-100 border-gray-300 rounded focus:ring-primary focus:ring-2"
              />
            </div>
          ))}
        </div>
      </section>

      <section className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold text-foreground mb-4">Email Settings</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Support Email</label>
            <Input
              type="email"
              value={values.supportEmail}
              onChange={(event) => updateField("supportEmail", event.target.value)}
              className="w-full"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">No-Reply Email</label>
            <Input
              type="email"
              value={values.noReplyEmail}
              onChange={(event) => updateField("noReplyEmail", event.target.value)}
              className="w-full"
            />
          </div>
        </div>
      </section>

      <section className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold text-foreground mb-4">Verification Settings</h2>
        <div className="space-y-4">
          {[{
            label: "Require Email Verification",
            description: "Users must verify their email before accessing the platform",
            key: "requireEmailVerification" as const,
          },
          {
            label: "Require Phone Verification",
            description: "Users must verify their phone number",
            key: "requirePhoneVerification" as const,
          }].map((toggle) => (
            <div key={toggle.key} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <p className="font-medium text-foreground">{toggle.label}</p>
                <p className="text-sm text-muted-foreground">{toggle.description}</p>
              </div>
              <input
                type="checkbox"
                checked={values[toggle.key]}
                onChange={(event) => updateField(toggle.key, event.target.checked)}
                className="w-5 h-5 text-primary bg-gray-100 border-gray-300 rounded focus:ring-primary focus:ring-2"
              />
            </div>
          ))}
        </div>
      </section>

      <section className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold text-foreground mb-4">Admin Users</h2>
        <div className="space-y-3">
          {adminUsers.length === 0 ? (
            <p className="text-sm text-muted-foreground">No admin users found.</p>
          ) : (
            adminUsers.map((admin) => (
              <div key={admin.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-foreground">{admin.name}</p>
                  <p className="text-sm text-muted-foreground">{admin.email}</p>
                </div>
                <button
                  type="button"
                  onClick={() => onRemoveAdmin(admin.id)}
                  className="px-3 py-1 text-sm text-red-600 border border-red-600 rounded hover:bg-red-50"
                >
                  Remove Admin
                </button>
              </div>
            ))
          )}
        </div>
      </section>

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={saving}
          className="px-6 py-3 bg-primary text-white rounded-lg font-semibold hover:bg-primary/90 disabled:opacity-50"
        >
          {saving ? "Saving..." : "Save Settings"}
        </button>
      </div>
    </form>
  );
}
