"use client";

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { CreateCollection, CreateCollectionSchema } from "@repo/schemas";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuthStore } from "@/store/auth-store";
import { QUERY_KEYS } from "@/utils/constants";
import { addCollectionService } from "@/services/collection-service";

type AddCollectionDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function AddCollectionDialog({
  open,
  onOpenChange,
}: AddCollectionDialogProps) {
  const [name, setName] = useState("");
  const [validationError, setValidationError] = useState("");
  const user = useAuthStore((s) => s.user);
  const queryClient = useQueryClient();

  const { mutate: addCollection, isPending } = useMutation({
    mutationFn: (createCollection: CreateCollection) =>
      addCollectionService(user?.accessToken ?? "", createCollection),
    onSuccess: async () => {
      handleClose();
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: QUERY_KEYS.getCount,
        }),
        queryClient.invalidateQueries({
          queryKey: QUERY_KEYS.getCollections,
        }),
      ]);
    },
    onError: (error) => {
      setValidationError(error.message);
    },
  });

  const handleClose = () => {
    setName("");
    setValidationError("");
    onOpenChange(false);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setValidationError("");

    const result = CreateCollectionSchema.safeParse({
      name,
    });
    if (!result.success) {
      const firstError =
        result.error.issues[0]?.message ?? "Something went wrong";
      setValidationError(firstError);
      return;
    }

    addCollection(result.data);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md rounded mx-auto -mt-20">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold">
            Add collection
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label htmlFor="name" className="text-sm font-medium">
              Name
            </label>
            <input
              id="name"
              type="text"
              placeholder="My Collection"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="border rounded px-3 h-9 text-sm bg-background outline-none focus-visible:ring-2 focus-visible:ring-ring"
            />
          </div>

          {validationError && (
            <p className="text-sm text-destructive">{validationError}</p>
          )}

          <DialogFooter>
            <DialogClose>
              <Button variant="outline" className="rounded cursor-pointer">
                Cancel
              </Button>
            </DialogClose>
            <Button
              disabled={isPending}
              type="submit"
              className="rounded cursor-pointer px-5"
            >
              {isPending ? "Adding..." : "Add"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
