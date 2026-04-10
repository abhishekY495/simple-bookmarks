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

type DeleteCollectionDialogProps = {
  collectionId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function DeleteCollectionDialog({
  collectionId,
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
          Are you sure you want to delete the collection?
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
