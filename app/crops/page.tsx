"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/lib/auth";
import { useRouter } from "next/navigation";
import { cropsApi, farmersApi } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Plus, Edit, Trash2, Wheat } from "lucide-react";
import { CropModal } from "@/components/crops/crop-modal";
import { DeleteCropDialog } from "@/components/crops/delete-crop-dialog";
import { toast } from "sonner";

interface Crop {
  id: string;
  name: string;
  type: string;
  quantity: number;
  unit: string;
  farmer: {
    id: string;
    firstName: string;
    lastName: string;
  };
  createdAt: string;
}

interface Farmer {
  id: string;
  firstName: string;
  lastName: string;
}

export default function CropsPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [crops, setCrops] = useState<Crop[]>([]);
  const [farmers, setFarmers] = useState<Farmer[]>([]);
  const [loadingData, setLoadingData] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedCrop, setSelectedCrop] = useState<Crop | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!loading) {
      if (!user || user.role !== "ADMIN") {
        router.push("/dashboard");
        return;
      }
      loadData();
    }
  }, [user, loading, router]);

  const loadData = async () => {
    try {
      const [cropsData, farmersData] = await Promise.all([
        cropsApi.getAll(),
        farmersApi.getAll(),
      ]);
      setCrops(cropsData);
      setFarmers(farmersData);
    } catch (error) {
      console.error("Error loading data:", error);
      toast.error("Failed to load data");
    } finally {
      setLoadingData(false);
    }
  };

  const handleAddCrop = () => {
    setSelectedCrop(null);
    setIsModalOpen(true);
  };

  const handleEditCrop = (crop: Crop) => {
    setSelectedCrop(crop);
    setIsModalOpen(true);
  };

  const handleDeleteClick = (crop: Crop) => {
    setSelectedCrop(crop);
    setIsDeleteDialogOpen(true);
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleSubmit = async (data: any) => {
    setIsSubmitting(true);
    try {
      if (selectedCrop) {
        // Update existing crop
        await cropsApi.update(selectedCrop.id, data);
        toast.success("Crop updated successfully");
      } else {
        // Create new crop
        await cropsApi.create(data);
        toast.success("Crop added successfully");
      }
      setIsModalOpen(false);
      await loadData(); // Refresh data
    } catch (error) {
      console.error("Error saving crop:", error);
      toast.error("Failed to save crop");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedCrop) return;

    setIsSubmitting(true);
    try {
      await cropsApi.delete(selectedCrop.id);
      toast.success("Crop deleted successfully");
      setIsDeleteDialogOpen(false);
      setSelectedCrop(null);
      await loadData(); // Refresh data
    } catch (error) {
      console.error("Error deleting crop:", error);
      toast.error("Failed to delete crop");
    } finally {
      setIsSubmitting(false);
    }
  };

  const getCropTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      CEREALS: "bg-yellow-100 text-yellow-800",
      VEGETABLES: "bg-green-100 text-green-800",
      FRUITS: "bg-red-100 text-red-800",
      LEGUMES: "bg-purple-100 text-purple-800",
      CASH_CROPS: "bg-blue-100 text-blue-800",
      OTHER: "bg-gray-100 text-gray-800",
    };
    return colors[type] || colors.OTHER;
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
          <h1 className="text-3xl font-bold text-gray-900">Crop Management</h1>
          <p className="text-gray-600 mt-2">
            View and manage all crops across your cooperative
          </p>
        </div>
        <Button onClick={handleAddCrop} className="gap-2">
          <Plus className="h-4 w-4" />
          Add Crop
        </Button>
      </div>

      <ScrollArea className="h-[calc(100vh-200px)]">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 pr-4">
          {crops.map((crop) => (
            <Card
              key={crop.id}
              className="transition-all duration-200 hover:shadow-md"
            >
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-green-100 rounded-full">
                    <Wheat className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">{crop.name}</CardTitle>
                    <p className="text-sm text-gray-600">
                      by {crop.farmer.firstName} {crop.farmer.lastName}
                    </p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleEditCrop(crop)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDeleteClick(crop)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <Badge className={getCropTypeColor(crop.type)}>
                    {crop.type.replace("_", " ")}
                  </Badge>
                  <span className="text-sm font-medium">
                    {crop.quantity} {crop.unit}
                  </span>
                </div>
                <div className="text-xs text-gray-500">
                  Added {new Date(crop.createdAt).toLocaleDateString()}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </ScrollArea>

      {crops.length === 0 && (
        <div className="text-center py-12">
          <Wheat className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900">
            No crops registered
          </h3>
          <p className="text-gray-600 mt-2">
            Farmers haven&apos;t added any crops to the system yet.
          </p>
        </div>
      )}

      <CropModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSubmit}
        initialData={selectedCrop}
        farmers={farmers}
        isLoading={isSubmitting}
      />

      <DeleteCropDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={handleDelete}
        cropName={selectedCrop?.name}
        isLoading={isSubmitting}
      />
    </div>
  );
}
