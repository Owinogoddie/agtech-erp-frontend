/* eslint-disable @typescript-eslint/no-explicit-any */
// components/crops/crop-modal.tsx
"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { CropForm } from "./crop-form";

interface CropModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
  initialData?: any;
  farmers: Array<{ id: string; firstName: string; lastName: string }>;
  isLoading?: boolean;
}

export function CropModal({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  farmers,
  isLoading,
}: CropModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>
            {initialData ? "Edit Crop" : "Add New Crop"}
          </DialogTitle>
        </DialogHeader>
        <ScrollArea className="max-h-[600px] pr-4">
          <CropForm
            initialData={initialData}
            farmers={farmers}
            onSubmit={onSubmit}
            isLoading={isLoading}
          />
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
