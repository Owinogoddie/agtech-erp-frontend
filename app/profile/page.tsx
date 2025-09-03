/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState, useCallback } from "react";
import { useAuth } from "@/lib/auth";
import { useRouter } from "next/navigation";
import { farmersApi } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import {
  User,
  Phone,
  MapPin,
  Mail,
  Calendar,
  Wheat,
  Lock,
  Hash,
  MapPinIcon,
  IdCard,
} from "lucide-react";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

export default function ProfilePage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [profile, setProfile] = useState<any>(null);
  const [loadingData, setLoadingData] = useState(true);
  const [editing, setEditing] = useState(false);
  const [changingPassword, setChangingPassword] = useState(false);
  const [crops, setCrops] = useState<any[]>([]);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    address: "",
    dateOfBirth: "",
    nationalId: "",
    farmSize: 0,
    farmLocation: "",
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const loadProfile = useCallback(async () => {
    try {
      if (user?.farmer?.id) {
        const data = await farmersApi.getOne(user.farmer.id);
        setProfile(data);
        setFormData({
          firstName: data.firstName || "",
          lastName: data.lastName || "",
          phone: data.phone || "",
          address: data.address || "",
          dateOfBirth: data.dateOfBirth ? data.dateOfBirth.split("T")[0] : "",
          nationalId: data.nationalId || "",
          farmSize: data.farmSize || 0,
          farmLocation: data.farmLocation || "",
        });
        setCrops(data.crops || []);
      }
    } catch (error) {
      console.error("Error loading profile:", error);
      toast.error("Failed to load profile");
    } finally {
      setLoadingData(false);
    }
  }, [user?.farmer?.id]);

  useEffect(() => {
    if (!loading) {
      if (!user || user.role !== "FARMER") {
        router.push("/dashboard");
        return;
      }
      loadProfile();
    }
  }, [user, loading, router, loadProfile]);

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (user?.farmer?.id) {
        // Filter out empty values for optional fields
        const updateData = {
          firstName: formData.firstName,
          lastName: formData.lastName,
          ...(formData.phone && { phone: formData.phone }),
          ...(formData.address && { address: formData.address }),
          ...(formData.dateOfBirth && { dateOfBirth: formData.dateOfBirth }),
          ...(formData.nationalId && { nationalId: formData.nationalId }),
          ...(formData.farmSize > 0 && { farmSize: formData.farmSize }),
          ...(formData.farmLocation && { farmLocation: formData.farmLocation }),
        };

        await farmersApi.update(user.farmer.id, updateData);
        await loadProfile();
        setEditing(false);
        toast.success("Profile updated successfully");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Failed to update profile");
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error("New passwords do not match");
      return;
    }

    if (passwordData.newPassword.length < 6) {
      toast.error("New password must be at least 6 characters");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_URL}/auth/change-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to change password");
      }

      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      setChangingPassword(false);
      toast.success("Password changed successfully");
    } catch (error: any) {
      console.error("Error changing password:", error);
      toast.error(error.message || "Failed to change password");
    }
  };

  if (loading || loadingData) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">My Profile</h1>
        <p className="text-gray-600 mt-2">
          Manage your personal information, contact details, and account
          security
        </p>
      </div>

      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="crops">Crops</TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-2">
            {/* Personal Info Card */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-6">
                <CardTitle className="text-xl">Personal Information</CardTitle>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setEditing(!editing)}
                >
                  {editing ? "Cancel" : "Edit"}
                </Button>
              </CardHeader>
              <CardContent>
                {editing ? (
                  <form onSubmit={handleProfileSubmit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="firstName">First Name *</Label>
                        <Input
                          id="firstName"
                          value={formData.firstName}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              firstName: e.target.value,
                            })
                          }
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="lastName">Last Name *</Label>
                        <Input
                          id="lastName"
                          value={formData.lastName}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              lastName: e.target.value,
                            })
                          }
                          required
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="phone">Phone Number</Label>
                        <Input
                          id="phone"
                          value={formData.phone}
                          onChange={(e) =>
                            setFormData({ ...formData, phone: e.target.value })
                          }
                          placeholder="+1234567890"
                        />
                      </div>
                      <div>
                        <Label htmlFor="nationalId">National ID</Label>
                        <Input
                          id="nationalId"
                          value={formData.nationalId}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              nationalId: e.target.value,
                            })
                          }
                          placeholder="ID123456789"
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="dateOfBirth">Date of Birth</Label>
                      <Input
                        id="dateOfBirth"
                        type="date"
                        value={formData.dateOfBirth}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            dateOfBirth: e.target.value,
                          })
                        }
                      />
                    </div>

                    <div>
                      <Label htmlFor="address">Address</Label>
                      <Textarea
                        id="address"
                        value={formData.address}
                        onChange={(e) =>
                          setFormData({ ...formData, address: e.target.value })
                        }
                        placeholder="Your farm address"
                        className="resize-none"
                        rows={3}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="farmSize">Farm Size (acres)</Label>
                        <Input
                          id="farmSize"
                          type="number"
                          min="0"
                          step="0.1"
                          value={formData.farmSize || ""}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              farmSize: Number(e.target.value),
                            })
                          }
                          placeholder="25.5"
                        />
                      </div>
                      <div>
                        <Label htmlFor="farmLocation">Farm Location</Label>
                        <Input
                          id="farmLocation"
                          value={formData.farmLocation}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              farmLocation: e.target.value,
                            })
                          }
                          placeholder="North Valley District"
                        />
                      </div>
                    </div>

                    <Button type="submit" className="w-full">
                      Update Profile
                    </Button>
                  </form>
                ) : (
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <User className="h-5 w-5 text-green-600" />
                      <div>
                        <p className="font-medium">
                          {profile?.firstName} {profile?.lastName}
                        </p>
                        <p className="text-sm text-gray-600">Full Name</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <Mail className="h-5 w-5 text-green-600" />
                      <div>
                        <p className="font-medium">{user?.email}</p>
                        <p className="text-sm text-gray-600">Email Address</p>
                      </div>
                    </div>

                    {profile?.phone && (
                      <div className="flex items-center gap-3">
                        <Phone className="h-5 w-5 text-green-600" />
                        <div>
                          <p className="font-medium">{profile.phone}</p>
                          <p className="text-sm text-gray-600">Phone Number</p>
                        </div>
                      </div>
                    )}

                    {profile?.nationalId && (
                      <div className="flex items-center gap-3">
                        <IdCard className="h-5 w-5 text-green-600" />
                        <div>
                          <p className="font-medium">{profile.nationalId}</p>
                          <p className="text-sm text-gray-600">National ID</p>
                        </div>
                      </div>
                    )}

                    {profile?.dateOfBirth && (
                      <div className="flex items-center gap-3">
                        <Calendar className="h-5 w-5 text-green-600" />
                        <div>
                          <p className="font-medium">
                            {new Date(profile.dateOfBirth).toLocaleDateString()}
                          </p>
                          <p className="text-sm text-gray-600">Date of Birth</p>
                        </div>
                      </div>
                    )}

                    {profile?.address && (
                      <div className="flex items-start gap-3">
                        <MapPin className="h-5 w-5 text-green-600 mt-0.5" />
                        <div>
                          <p className="font-medium">{profile.address}</p>
                          <p className="text-sm text-gray-600">Address</p>
                        </div>
                      </div>
                    )}

                    {profile?.farmSize && (
                      <div className="flex items-center gap-3">
                        <Hash className="h-5 w-5 text-green-600" />
                        <div>
                          <p className="font-medium">
                            {profile.farmSize} acres
                          </p>
                          <p className="text-sm text-gray-600">Farm Size</p>
                        </div>
                      </div>
                    )}

                    {profile?.farmLocation && (
                      <div className="flex items-center gap-3">
                        <MapPinIcon className="h-5 w-5 text-green-600" />
                        <div>
                          <p className="font-medium">{profile.farmLocation}</p>
                          <p className="text-sm text-gray-600">Farm Location</p>
                        </div>
                      </div>
                    )}

                    <div className="flex items-center gap-3 pt-2 border-t">
                      <Calendar className="h-5 w-5 text-green-600" />
                      <div>
                        <p className="font-medium">
                          {profile &&
                            new Date(profile.createdAt).toLocaleDateString()}
                        </p>
                        <p className="text-sm text-gray-600">Member Since</p>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Crop Summary Card */}
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">Farm Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="text-center p-6 bg-green-50 rounded-lg">
                    <Wheat className="h-12 w-12 text-green-600 mx-auto mb-2" />
                    <p className="text-2xl font-bold text-green-900">
                      {crops.length}
                    </p>
                    <p className="text-green-700">Total Crops Registered</p>
                  </div>

                  {crops.length > 0 && (
                    <div className="space-y-2">
                      <p className="font-medium text-gray-900">Recent Crops:</p>
                      {crops.slice(0, 3).map((crop: any) => (
                        <div
                          key={crop.id}
                          className="flex justify-between items-center p-3 bg-gray-50 rounded-lg"
                        >
                          <div>
                            <p className="font-medium">{crop.name}</p>
                            <p className="text-sm text-gray-600 capitalize">
                              {crop.type.toLowerCase().replace("_", " ")}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="font-medium">
                              {crop.quantity} {crop.unit}
                            </p>
                          </div>
                        </div>
                      ))}
                      {crops.length > 3 && (
                        <p className="text-sm text-gray-500 text-center pt-2">
                          And {crops.length - 3} more crops...
                        </p>
                      )}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="security" className="space-y-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-6">
              <div>
                <CardTitle className="text-xl">Password & Security</CardTitle>
                <p className="text-sm text-gray-600 mt-1">
                  Keep your account secure by using a strong password
                </p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setChangingPassword(!changingPassword)}
              >
                {changingPassword ? "Cancel" : "Change Password"}
              </Button>
            </CardHeader>
            <CardContent>
              {changingPassword ? (
                <form onSubmit={handlePasswordSubmit} className="space-y-4">
                  <div>
                    <Label htmlFor="currentPassword">Current Password</Label>
                    <Input
                      id="currentPassword"
                      type="password"
                      value={passwordData.currentPassword}
                      onChange={(e) =>
                        setPasswordData({
                          ...passwordData,
                          currentPassword: e.target.value,
                        })
                      }
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="newPassword">New Password</Label>
                    <Input
                      id="newPassword"
                      type="password"
                      value={passwordData.newPassword}
                      onChange={(e) =>
                        setPasswordData({
                          ...passwordData,
                          newPassword: e.target.value,
                        })
                      }
                      placeholder="Minimum 6 characters"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="confirmPassword">
                      Confirm New Password
                    </Label>
                    <Input
                      id="confirmPassword"
                      type="password"
                      value={passwordData.confirmPassword}
                      onChange={(e) =>
                        setPasswordData({
                          ...passwordData,
                          confirmPassword: e.target.value,
                        })
                      }
                      required
                    />
                  </div>
                  <Button type="submit" className="w-full">
                    Update Password
                  </Button>
                </form>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Lock className="h-5 w-5 text-green-600" />
                    <div>
                      <p className="font-medium">Password</p>
                      <p className="text-sm text-gray-600">
                        Last updated: Never shown for security
                      </p>
                    </div>
                  </div>
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <p className="text-sm text-blue-800">
                      <strong>Security Tip:</strong> Use a strong password with
                      at least 6 characters, including letters, numbers, and
                      special characters.
                    </p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="crops" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">My Crops</CardTitle>
            </CardHeader>
            <CardContent>
              {crops.length > 0 ? (
                <div className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {crops.map((crop: any) => (
                      <div
                        key={crop.id}
                        className="p-4 border rounded-lg hover:shadow-md transition-shadow"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="font-semibold text-lg">{crop.name}</h3>
                          <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
                            {crop.type.toLowerCase().replace("_", " ")}
                          </span>
                        </div>
                        <div className="space-y-1 text-sm text-gray-600">
                          <p>
                            <span className="font-medium">Quantity:</span>{" "}
                            {crop.quantity} {crop.unit}
                          </p>
                          <p>
                            <span className="font-medium">Added:</span>{" "}
                            {new Date(crop.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="text-center pt-4">
                    <Button
                      variant="outline"
                      onClick={() => router.push("/crops")}
                    >
                      Manage All Crops
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <Wheat className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    No crops registered yet
                  </h3>
                  <p className="text-gray-600 mb-4">
                    Start by adding your first crop to track your farm
                    production.
                  </p>
                  <Button onClick={() => router.push("/crops")}>
                    Add Your First Crop
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
