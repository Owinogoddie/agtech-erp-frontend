// components/farmers/delete-farmer-dialog.tsx
"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface DeleteFarmerDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  farmerName?: string;
  isLoading?: boolean;
}

export function DeleteFarmerDialog({
  isOpen,
  onClose,
  onConfirm,
  farmerName,
  isLoading,
}: DeleteFarmerDialogProps) {
  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Farmer</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete &quot;{farmerName}&quot;? This will
            also delete all crops associated with this farmer. This action
            cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isLoading}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            disabled={isLoading}
            className="bg-red-600 hover:bg-red-700"
          >
            {isLoading ? "Deleting..." : "Delete"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
