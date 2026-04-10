import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { deleteCollectionService } from "@/services/collection-service";
import { useAuthStore } from "@/store/auth-store";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { MessageSquareWarningIcon } from "lucide-react";

type DeleteCollectionDialogProps = {
  collectionId: string;
  bookmarkCount: number;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function DeleteCollectionDialog({
  collectionId,
  bookmarkCount,
  open,
  onOpenChange,
}: DeleteCollectionDialogProps) {
  const user = useAuthStore((s) => s.user);
  const queryClient = useQueryClient();

  const { mutate: deleteCollection, isPending } = useMutation({
    mutationFn: () =>
      deleteCollectionService(user?.accessToken ?? "", collectionId),
    onSuccess: async () => {
      onOpenChange(false);
      await queryClient.invalidateQueries();
    },
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="sm:max-w-md rounded mx-auto -mt-20 gap-1"
        autoFocus={false}
      >
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold">
            Delete collection
          </DialogTitle>
        </DialogHeader>
        <DialogDescription>
          <p>Are you sure you want to delete the collection?</p>
          <p className="flex items-center gap-1 font-medium">
            <MessageSquareWarningIcon className="size-4 text-red-500" />
            {bookmarkCount} {bookmarkCount > 1 ? "bookmarks" : "bookmark"} in
            this collection will also be deleted.
          </p>
        </DialogDescription>
        <DialogFooter className="mt-5">
          <DialogClose>
            <Button
              variant="outline"
              className="rounded cursor-pointer"
              disabled={isPending}
            >
              Cancel
            </Button>
          </DialogClose>
          <Button
            variant="destructive"
            className="rounded cursor-pointer px-5"
            disabled={isPending}
            onClick={() => deleteCollection()}
          >
            {isPending ? "Deleting..." : "Delete"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
