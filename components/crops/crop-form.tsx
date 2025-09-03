// components/crops/crop-form.tsx
"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const cropSchema = z.object({
  name: z.string().min(1, "Name is required"),
  type: z.enum([
    "CEREALS",
    "VEGETABLES",
    "FRUITS",
    "LEGUMES",
    "CASH_CROPS",
    "OTHER",
  ]),
  quantity: z.number().min(0, "Quantity must be positive"),
  unit: z.string().min(1, "Unit is required"),
  farmerId: z.string().min(1, "Farmer is required"),
});

type CropFormData = z.infer<typeof cropSchema>;

interface CropFormProps {
  initialData?: Partial<CropFormData>;
  farmers: Array<{ id: string; firstName: string; lastName: string }>;
  onSubmit: (data: CropFormData) => void;
  isLoading?: boolean;
}

const cropTypes = [
  { value: "CEREALS", label: "Cereals" },
  { value: "VEGETABLES", label: "Vegetables" },
  { value: "FRUITS", label: "Fruits" },
  { value: "LEGUMES", label: "Legumes" },
  { value: "CASH_CROPS", label: "Cash Crops" },
  { value: "OTHER", label: "Other" },
];

export function CropForm({
  initialData,
  farmers,
  onSubmit,
  isLoading,
}: CropFormProps) {
  const form = useForm<CropFormData>({
    resolver: zodResolver(cropSchema),
    defaultValues: {
      name: initialData?.name || "",
      type: initialData?.type || "CEREALS",
      quantity: initialData?.quantity || undefined,
      unit: initialData?.unit || "kg",
      farmerId: initialData?.farmerId || "",
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Crop Name</FormLabel>
              <FormControl>
                <Input placeholder="Enter crop name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Crop Type</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select crop type" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {cropTypes.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="quantity"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Quantity</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="Enter quantity"
                    value={field.value === undefined ? "" : field.value}
                    onChange={(e) => {
                      const value = e.target.value;
                      if (value === "") {
                        field.onChange(undefined);
                      } else {
                        const numValue = Number(value);
                        if (!isNaN(numValue)) {
                          field.onChange(numValue);
                        }
                      }
                    }}
                    onBlur={field.onBlur}
                    name={field.name}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="unit"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Unit</FormLabel>
                <FormControl>
                  <Input placeholder="kg" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="farmerId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Farmer</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select farmer" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {farmers.map((farmer) => (
                    <SelectItem key={farmer.id} value={farmer.id}>
                      {farmer.firstName} {farmer.lastName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" disabled={isLoading} className="w-full">
          {isLoading ? "Saving..." : initialData ? "Update Crop" : "Add Crop"}
        </Button>
      </form>
    </Form>
  );
}
