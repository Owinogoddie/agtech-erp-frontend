/* eslint-disable @typescript-eslint/no-explicit-any */
// components/farmers/farmer-modal.tsx
"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { FarmerForm } from "./farmer-form";

interface FarmerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
  initialData?: any;
  isLoading?: boolean;
}

export function FarmerModal({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  isLoading,
}: FarmerModalProps) {
  const isEditing = Boolean(initialData?.id);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[700px] h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "Edit Farmer" : "Add New Farmer"}
          </DialogTitle>
        </DialogHeader>
        <ScrollArea className="flex-1 pr-4 min-h-0">
          <FarmerForm
            initialData={initialData}
            onSubmit={onSubmit}
            isLoading={isLoading}
            isEditing={isEditing}
          />
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
