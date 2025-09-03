/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/lib/auth";
import { useRouter } from "next/navigation";
import { farmersApi } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, Edit, Trash2, User, Phone, MapPin } from "lucide-react";

export default function FarmersPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [farmers, setFarmers] = useState([]);
  const [loadingData, setLoadingData] = useState(true);

  useEffect(() => {
    if (!loading) {
      if (!user || user.role !== "ADMIN") {
        router.push("/dashboard");
        return;
      }
      loadFarmers();
    }
  }, [user, loading, router]);

  const loadFarmers = async () => {
    try {
      const data = await farmersApi.getAll();
      setFarmers(data);
    } catch (error) {
      console.error("Error loading farmers:", error);
    } finally {
      setLoadingData(false);
    }
  };

  const handleDelete = async (farmerId: string) => {
    if (confirm("Are you sure you want to delete this farmer?")) {
      try {
        await farmersApi.delete(farmerId);
        await loadFarmers();
      } catch (error) {
        console.error("Error deleting farmer:", error);
      }
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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Farmers Management
          </h1>
          <p className="text-gray-600 mt-2">
            Manage all registered farmers in your cooperative
          </p>
        </div>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          Add Farmer
        </Button>
      </div>

      <div className="grid gap-6 lg:grid-cols-2 xl:grid-cols-3">
        {farmers.map((farmer: any) => (
          <Card
            key={farmer.id}
            className="transition-all duration-200 hover:shadow-md"
          >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-100 rounded-full">
                  <User className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <CardTitle className="text-lg">
                    {farmer.firstName} {farmer.lastName}
                  </CardTitle>
                  <p className="text-sm text-gray-600">{farmer.user.email}</p>
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="ghost" size="sm">
                  <Edit className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDelete(farmer.id)}
                  className="text-red-600 hover:text-red-700"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {farmer.phone && (
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Phone className="h-4 w-4" />
                  {farmer.phone}
                </div>
              )}
              {farmer.address && (
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <MapPin className="h-4 w-4" />
                  {farmer.address}
                </div>
              )}
              <div className="flex items-center justify-between pt-2">
                <Badge variant="secondary">{farmer._count.crops} crops</Badge>
                <Badge variant="outline" className="text-green-700">
                  Active
                </Badge>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {farmers.length === 0 && (
        <div className="text-center py-12">
          <User className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900">
            No farmers registered
          </h3>
          <p className="text-gray-600 mt-2">
            Get started by adding your first farmer to the system.
          </p>
        </div>
      )}
    </div>
  );
}
