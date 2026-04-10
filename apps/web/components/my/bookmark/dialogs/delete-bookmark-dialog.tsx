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
import { deleteBookmarkService } from "@/services/bookmark-service";
import { useAuthStore } from "@/store/auth-store";
import { useMutation, useQueryClient } from "@tanstack/react-query";

type DeleteBookmarkDialogProps = {
  bookmarkId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function DeleteBookmarkDialog({
  bookmarkId,
  open,
  onOpenChange,
}: DeleteBookmarkDialogProps) {
  const user = useAuthStore((s) => s.user);
  const queryClient = useQueryClient();

  const { mutate: deleteBookmark, isPending } = useMutation({
    mutationFn: () =>
      deleteBookmarkService(user?.accessToken ?? "", bookmarkId),
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
            Delete bookmark
          </DialogTitle>
        </DialogHeader>
        <DialogDescription>
          Are you sure you want to delete the bookmark?
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
            onClick={() => deleteBookmark()}
          >
            {isPending ? "Deleting..." : "Delete"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
