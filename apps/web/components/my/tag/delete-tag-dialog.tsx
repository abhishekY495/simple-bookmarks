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
import { deleteTagService } from "@/services/tag-service";
import { useAuthStore } from "@/store/auth-store";
import { QUERY_KEYS } from "@/utils/constants";
import { useMutation, useQueryClient } from "@tanstack/react-query";

type DeleteTagDialogProps = {
  tagId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function DeleteTagDialog({
  tagId,
  open,
  onOpenChange,
}: DeleteTagDialogProps) {
  const user = useAuthStore((s) => s.user);
  const queryClient = useQueryClient();

  const { mutate: deleteTag, isPending } = useMutation({
    mutationFn: () => deleteTagService(user?.accessToken ?? "", tagId),
    onSuccess: async () => {
      onOpenChange(false);
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: QUERY_KEYS.getCount,
        }),
        queryClient.invalidateQueries({
          queryKey: QUERY_KEYS.getTags,
        }),
      ]);
    },
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="sm:max-w-md rounded mx-auto -mt-20 gap-1"
        onOpenAutoFocus={(e) => e.preventDefault()}
      >
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold">
            Delete tag
          </DialogTitle>
        </DialogHeader>
        <DialogDescription>
          Are you sure you want to delete the tag?
        </DialogDescription>
        <DialogFooter className="mt-5">
          <DialogClose asChild>
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
            onClick={() => deleteTag()}
          >
            {isPending ? "Deleting..." : "Delete"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
