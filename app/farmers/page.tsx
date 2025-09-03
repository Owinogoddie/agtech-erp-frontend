/* eslint-disable @typescript-eslint/no-explicit-any */
// app/farmers/page.tsx (or your farmers page)
"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/lib/auth";
import { useRouter } from "next/navigation";
import { farmersApi } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Plus,
  Edit,
  Trash2,
  User,
  Phone,
  MapPin,
  Calendar,
  Hash,
  MapPinIcon,
} from "lucide-react";
import { FarmerModal } from "@/components/farmers/farmer-modal";
import { DeleteFarmerDialog } from "@/components/farmers/delete-farmer-dialog";
import { toast } from "sonner";

interface Farmer {
  id: string;
  firstName: string;
  lastName: string;
  phone?: string;
  address?: string;
  dateOfBirth?: string;
  nationalId?: string;
  farmSize?: number;
  farmLocation?: string;
  user: {
    email: string;
  };
  _count: {
    crops: number;
  };
  createdAt: string;
}

export default function FarmersPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [farmers, setFarmers] = useState<Farmer[]>([]);
  const [loadingData, setLoadingData] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedFarmer, setSelectedFarmer] = useState<Farmer | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

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
      toast.error("Failed to load farmers");
    } finally {
      setLoadingData(false);
    }
  };

  const handleAddFarmer = () => {
    setSelectedFarmer(null);
    setIsModalOpen(true);
  };

  const handleEditFarmer = (farmer: Farmer) => {
    // Prepare data for the form
    const farmerData = {
      id: farmer.id,
      firstName: farmer.firstName,
      lastName: farmer.lastName,
      email: farmer.user.email,
      phone: farmer.phone || "",
      address: farmer.address || "",
      dateOfBirth: farmer.dateOfBirth || "",
      nationalId: farmer.nationalId || "",
      farmSize: farmer.farmSize || 0,
      farmLocation: farmer.farmLocation || "",
    };
    setSelectedFarmer(farmerData as any);
    setIsModalOpen(true);
  };

  const handleDeleteClick = (farmer: Farmer) => {
    setSelectedFarmer(farmer);
    setIsDeleteDialogOpen(true);
  };

  const handleSubmit = async (data: any) => {
    setIsSubmitting(true);
    try {
      if (selectedFarmer?.id) {
        // Update existing farmer
        await farmersApi.update(selectedFarmer.id, data);
        toast.success("Farmer updated successfully");
      } else {
        // Create new farmer
        await farmersApi.create(data);
        toast.success("Farmer added successfully");
      }
      setIsModalOpen(false);
      await loadFarmers(); // Refresh data
    } catch (error) {
      console.error("Error saving farmer:", error);
      toast.error("Failed to save farmer");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedFarmer) return;

    setIsSubmitting(true);
    try {
      await farmersApi.delete(selectedFarmer.id);
      toast.success("Farmer deleted successfully");
      setIsDeleteDialogOpen(false);
      setSelectedFarmer(null);
      await loadFarmers(); // Refresh data
    } catch (error) {
      console.error("Error deleting farmer:", error);
      toast.error("Failed to delete farmer");
    } finally {
      setIsSubmitting(false);
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
        <Button onClick={handleAddFarmer} className="gap-2">
          <Plus className="h-4 w-4" />
          Add Farmer
        </Button>
      </div>

      <ScrollArea className="h-[calc(100vh-200px)]">
        <div className="grid gap-6 lg:grid-cols-2 xl:grid-cols-3 pr-4">
          {farmers.map((farmer) => (
            <Card
              key={farmer.id}
              className="transition-all duration-200 hover:shadow-md"
            >
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-green-100 rounded-full">
                    <User className="h-5 w-5 text-green-600" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <CardTitle className="text-lg truncate">
                      {farmer.firstName} {farmer.lastName}
                    </CardTitle>
                    <p className="text-sm text-gray-600 truncate">
                      {farmer.user.email}
                    </p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleEditFarmer(farmer)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDeleteClick(farmer)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {farmer.phone && (
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Phone className="h-4 w-4 flex-shrink-0" />
                    <span className="truncate">{farmer.phone}</span>
                  </div>
                )}
                {farmer.address && (
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <MapPin className="h-4 w-4 flex-shrink-0" />
                    <span className="truncate">{farmer.address}</span>
                  </div>
                )}
                {farmer.farmSize && (
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Hash className="h-4 w-4 flex-shrink-0" />
                    <span>{farmer.farmSize} acres</span>
                  </div>
                )}
                {farmer.farmLocation && (
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <MapPinIcon className="h-4 w-4 flex-shrink-0" />
                    <span className="truncate">{farmer.farmLocation}</span>
                  </div>
                )}
                {farmer.dateOfBirth && (
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Calendar className="h-4 w-4 flex-shrink-0" />
                    <span>
                      {new Date(farmer.dateOfBirth).toLocaleDateString()}
                    </span>
                  </div>
                )}
                <div className="flex items-center justify-between pt-2">
                  <Badge variant="secondary">{farmer._count.crops} crops</Badge>
                  <Badge variant="outline" className="text-green-700">
                    Active
                  </Badge>
                </div>
                <div className="text-xs text-gray-500">
                  Joined {new Date(farmer.createdAt).toLocaleDateString()}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </ScrollArea>

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

      <FarmerModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSubmit}
        initialData={selectedFarmer}
        isLoading={isSubmitting}
      />

      <DeleteFarmerDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={handleDelete}
        farmerName={
          selectedFarmer
            ? `${selectedFarmer.firstName} ${selectedFarmer.lastName}`
            : ""
        }
        isLoading={isSubmitting}
      />
    </div>
  );
}
