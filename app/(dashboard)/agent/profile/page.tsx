"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/Button";
import { User } from "@/lib/types";
import toast from "react-hot-toast";

const profileSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email"),
  phone: z.string().optional(),
  bio: z.string().optional(),
  agency: z.string().optional(),
  licenseNumber: z.string().optional(),
  yearsOfExp: z.number().optional(),
  visible: z.boolean().optional(),
});

type ProfileFormData = z.infer<typeof profileSchema>;

export default function ProfilePage() {
  const [profile, setProfile] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
  });

  useEffect(() => {
    const initProfile = async () => {
      await fetchProfile();
    };
    initProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await fetch("/api/agent/profile");
      if (response.ok) {
        const data = await response.json();
        setProfile(data);
        reset(data);
      }
    } catch (error) {
      console.error("Failed to fetch profile:", error);
      toast.error("Failed to load profile");
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (data: ProfileFormData) => {
    try {
      const response = await fetch("/api/agent/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        const updatedProfile = await response.json();
        setProfile(updatedProfile);
        setIsEditing(false);
        toast.success("Profile updated successfully");
      } else {
        toast.error("Failed to update profile");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Failed to update profile");
    }
  };

  if (loading) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">Loading profile...</p>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground">Agent Profile</h1>
        <p className="text-muted-foreground mt-2">
          Manage your professional information
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4">
            Profile Picture
          </h3>
          <div className="flex flex-col items-center">
            {profile?.image ? (
              <div className="w-32 h-32 rounded-full bg-gray-200 flex items-center justify-center mb-4">
                <span className="text-4xl">📷</span>
              </div>
            ) : (
              <div className="w-32 h-32 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <span className="text-primary text-4xl">👤</span>
              </div>
            )}
            <input
              type="file"
              accept="image/*"
              disabled
              className="opacity-50 cursor-not-allowed"
            />
            <p className="text-xs text-muted-foreground mt-2">
              Image upload coming soon
            </p>
          </div>
        </div>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="lg:col-span-2 bg-white rounded-lg shadow-md p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-foreground">
              {isEditing ? "Edit Profile" : "Profile Information"}
            </h3>
            {!isEditing && (
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsEditing(true)}
              >
                Edit
              </Button>
            )}
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Full Name
                </label>
                {isEditing ? (
                  <>
                    <input
                      type="text"
                      {...register("name")}
                      className="w-full px-4 py-2 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                    {errors.name && (
                      <p className="text-red-600 text-sm mt-1">
                        {errors.name.message}
                      </p>
                    )}
                  </>
                ) : (
                  <p className="text-foreground">{profile?.name}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Email
                </label>
                {isEditing ? (
                  <>
                    <input
                      type="email"
                      {...register("email")}
                      className="w-full px-4 py-2 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                    {errors.email && (
                      <p className="text-red-600 text-sm mt-1">
                        {errors.email.message}
                      </p>
                    )}
                  </>
                ) : (
                  <p className="text-foreground">{profile?.email}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Phone
                </label>
                {isEditing ? (
                  <input
                    type="tel"
                    {...register("phone")}
                    className="w-full px-4 py-2 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                ) : (
                  <p className="text-foreground">{profile?.phone || "N/A"}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  License Number
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    {...register("licenseNumber")}
                    className="w-full px-4 py-2 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                ) : (
                  <p className="text-foreground">
                    {profile?.licenseNumber || "N/A"}
                  </p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Agency/Company
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    {...register("agency")}
                    className="w-full px-4 py-2 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                ) : (
                  <p className="text-foreground">{profile?.agency || "N/A"}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Years of Experience
                </label>
                {isEditing ? (
                  <input
                    type="number"
                    {...register("yearsOfExp", { valueAsNumber: true })}
                    className="w-full px-4 py-2 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                ) : (
                  <p className="text-foreground">
                    {profile?.yearsOfExp || "N/A"}
                  </p>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Bio
              </label>
              {isEditing ? (
                <textarea
                  {...register("bio")}
                  rows={3}
                  className="w-full px-4 py-2 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
              ) : (
                <p className="text-foreground">{profile?.bio || "N/A"}</p>
              )}
            </div>

            {isEditing && (
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  {...register("visible")}
                  id="visible"
                  className="w-4 h-4 rounded"
                />
                <label htmlFor="visible" className="text-sm font-medium text-foreground">
                  Show profile on agents page
                </label>
              </div>
            )}
          </div>

          {isEditing && (
            <div className="flex gap-4 mt-6">
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Saving..." : "Save Changes"}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setIsEditing(false);
                  reset(profile as ProfileFormData);
                }}
              >
                Cancel
              </Button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
