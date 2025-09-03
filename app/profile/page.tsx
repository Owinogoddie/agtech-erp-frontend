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
import { User, Phone, MapPin, Mail, Calendar, Wheat } from "lucide-react";

export default function ProfilePage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [profile, setProfile] = useState<any>(null);
  const [loadingData, setLoadingData] = useState(true);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    address: "",
  });
  const [crops, setCrops] = useState<any[]>([]); // ✅ define crops state

  // ✅ Wrap loadProfile in useCallback so it's stable
  const loadProfile = useCallback(async () => {
    try {
      if (user?.farmer?.id) {
        const data = await farmersApi.getOne(user.farmer.id);
        setProfile(data);
        setFormData({
          firstName: data.firstName,
          lastName: data.lastName,
          phone: data.phone || "",
          address: data.address || "",
        });
        setCrops(data.crops || []); // ✅ assuming backend returns crops
      }
    } catch (error) {
      console.error("Error loading profile:", error);
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (user?.farmer?.id) {
        await farmersApi.update(user.farmer.id, formData);
        await loadProfile();
        setEditing(false);
      }
    } catch (error) {
      console.error("Error updating profile:", error);
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
          Manage your personal information and contact details
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Personal Info */}
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
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="firstName">First Name</Label>
                    <Input
                      id="firstName"
                      value={formData.firstName}
                      onChange={(e) =>
                        setFormData({ ...formData, firstName: e.target.value })
                      }
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input
                      id="lastName"
                      value={formData.lastName}
                      onChange={(e) =>
                        setFormData({ ...formData, lastName: e.target.value })
                      }
                      required
                    />
                  </div>
                </div>
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
                  <Label htmlFor="address">Address</Label>
                  <Input
                    id="address"
                    value={formData.address}
                    onChange={(e) =>
                      setFormData({ ...formData, address: e.target.value })
                    }
                    placeholder="Your farm address"
                  />
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

                {profile?.address && (
                  <div className="flex items-center gap-3">
                    <MapPin className="h-5 w-5 text-green-600" />
                    <div>
                      <p className="font-medium">{profile.address}</p>
                      <p className="text-sm text-gray-600">Farm Address</p>
                    </div>
                  </div>
                )}

                <div className="flex items-center gap-3">
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

        {/* Crop Summary */}
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">Crop Summary</CardTitle>
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
                      className="flex justify-between items-center p-2 bg-gray-50 rounded"
                    >
                      <span className="font-medium">{crop.name}</span>
                      <span className="text-sm text-gray-600">
                        {crop.quantity} {crop.unit}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
