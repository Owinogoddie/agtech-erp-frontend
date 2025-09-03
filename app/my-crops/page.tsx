/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/lib/auth";
import { useRouter } from "next/navigation";
import { cropsApi } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, Edit, Trash2, Wheat, Loader2 } from "lucide-react";

const CROP_TYPES = [
  { value: "CEREALS", label: "Cereals" },
  { value: "VEGETABLES", label: "Vegetables" },
  { value: "FRUITS", label: "Fruits" },
  { value: "LEGUMES", label: "Legumes" },
  { value: "CASH_CROPS", label: "Cash Crops" },
  { value: "OTHER", label: "Other" },
];

export default function MyCropsPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [crops, setCrops] = useState([]);
  const [loadingData, setLoadingData] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingCrop, setEditingCrop] = useState<any>(null);
  const [formData, setFormData] = useState({
    name: "",
    type: "",
    quantity: "",
    unit: "kg",
  });

  useEffect(() => {
    if (!loading) {
      if (!user || user.role !== "FARMER") {
        router.push("/dashboard");
        return;
      }
      loadCrops();
    }
  }, [user, loading, router]);

  const loadCrops = async () => {
    try {
      const data = await cropsApi.getAll();
      setCrops(data);
    } catch (error) {
      console.error("Error loading crops:", error);
    } finally {
      setLoadingData(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const cropData = {
        ...formData,
        quantity: parseFloat(formData.quantity),
        farmerId: user?.farmer?.id,
      };

      if (editingCrop) {
        await cropsApi.update(editingCrop.id, cropData);
      } else {
        await cropsApi.create(cropData);
      }

      setDialogOpen(false);
      setEditingCrop(null);
      setFormData({ name: "", type: "", quantity: "", unit: "kg" });
      await loadCrops();
    } catch (error) {
      console.error("Error saving crop:", error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (crop: any) => {
    setEditingCrop(crop);
    setFormData({
      name: crop.name,
      type: crop.type,
      quantity: crop.quantity.toString(),
      unit: crop.unit,
    });
    setDialogOpen(true);
  };

  const handleDelete = async (cropId: string) => {
    setDeleting(cropId);
    try {
      await cropsApi.delete(cropId);
      await loadCrops();
    } catch (error) {
      console.error("Error deleting crop:", error);
    } finally {
      setDeleting(null);
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
          <h1 className="text-3xl font-bold text-gray-900">My Crops</h1>
          <p className="text-gray-600 mt-2">
            Manage your crop inventory and production
          </p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button
              className="gap-2"
              onClick={() => {
                setEditingCrop(null);
                setFormData({ name: "", type: "", quantity: "", unit: "kg" });
              }}
            >
              <Plus className="h-4 w-4" />
              Add Crop
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingCrop ? "Edit Crop" : "Add New Crop"}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="name">Crop Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  placeholder="e.g., Corn, Tomatoes"
                  required
                  disabled={submitting}
                />
              </div>
              <div>
                <Label htmlFor="type">Crop Type</Label>
                <Select
                  value={formData.type}
                  onValueChange={(value) =>
                    setFormData({ ...formData, type: value })
                  }
                  disabled={submitting}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select crop type" />
                  </SelectTrigger>
                  <SelectContent>
                    {CROP_TYPES.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="quantity">Quantity</Label>
                  <Input
                    id="quantity"
                    type="number"
                    step="0.1"
                    value={formData.quantity}
                    onChange={(e) =>
                      setFormData({ ...formData, quantity: e.target.value })
                    }
                    placeholder="0.0"
                    required
                    disabled={submitting}
                  />
                </div>
                <div>
                  <Label htmlFor="unit">Unit</Label>
                  <Input
                    id="unit"
                    value={formData.unit}
                    onChange={(e) =>
                      setFormData({ ...formData, unit: e.target.value })
                    }
                    placeholder="kg"
                    required
                    disabled={submitting}
                  />
                </div>
              </div>
              <div className="flex gap-2 pt-4">
                <Button type="submit" className="flex-1" disabled={submitting}>
                  {submitting ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      {editingCrop ? "Updating..." : "Adding..."}
                    </>
                  ) : editingCrop ? (
                    "Update Crop"
                  ) : (
                    "Add Crop"
                  )}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setDialogOpen(false)}
                  disabled={submitting}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {crops.map((crop: any) => (
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
                    {crop.quantity} {crop.unit}
                  </p>
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleEdit(crop)}
                  disabled={deleting === crop.id}
                >
                  <Edit className="h-4 w-4" />
                </Button>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-red-600 hover:text-red-700"
                      disabled={deleting === crop.id}
                    >
                      {deleting === crop.id ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Trash2 className="h-4 w-4" />
                      )}
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Delete Crop</AlertDialogTitle>
                      <AlertDialogDescription>
                        Are you sure you want to delete{" "}
                        <strong>{crop.name}</strong>? This action cannot be
                        undone and will permanently remove this crop from your
                        inventory.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel disabled={deleting === crop.id}>
                        Cancel
                      </AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => handleDelete(crop.id)}
                        className="bg-red-600 hover:bg-red-700"
                        disabled={deleting === crop.id}
                      >
                        {deleting === crop.id ? (
                          <>
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                            Deleting...
                          </>
                        ) : (
                          "Delete"
                        )}
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <Badge className={getCropTypeColor(crop.type)}>
                {crop.type.replace("_", " ")}
              </Badge>
              <div className="text-xs text-gray-500">
                Added {new Date(crop.createdAt).toLocaleDateString()}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {crops.length === 0 && (
        <div className="text-center py-12">
          <Wheat className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900">No crops added</h3>
          <p className="text-gray-600 mt-2">
            Start by adding your first crop to track your production.
          </p>
        </div>
      )}
    </div>
  );
}
