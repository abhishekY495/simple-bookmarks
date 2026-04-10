import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { updateTagService } from "@/services/tag-service";
import { useAuthStore } from "@/store/auth-store";
import { TagResponse, UpdateTag, UpdateTagSchema } from "@repo/schemas";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

type EditTagDialogProps = {
  tag: TagResponse;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function EditTagDialog({ tag, open, onOpenChange }: EditTagDialogProps) {
  const user = useAuthStore((s) => s.user);
  const queryClient = useQueryClient();
  const [name, setName] = useState(tag.name ?? "");
  const [validationError, setValidationError] = useState("");

  const handleClose = () => {
    setName(tag.name ?? "");
    setValidationError("");
    onOpenChange(false);
  };

  const { mutate: updateTag, isPending } = useMutation({
    mutationFn: (payload: UpdateTag) =>
      updateTagService(user?.accessToken ?? "", tag.id, payload),
    onSuccess: async () => {
      handleClose();
      await queryClient.invalidateQueries();
    },
    onError: (error) => {
      setValidationError(error.message);
    },
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setValidationError("");

    const result = UpdateTagSchema.safeParse({
      name,
    });

    if (!result.success) {
      const firstError =
        result.error.issues[0]?.message ?? "Failed to update tag";
      setValidationError(firstError);
      return;
    }

    updateTag(result.data);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md rounded mx-auto -mt-20">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold">Edit tag</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div className="flex flex-col gap-1.5">
            <label htmlFor="tag-name" className="text-sm font-medium">
              Name
            </label>
            <Input
              id="tag-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="My Tag"
              disabled={isPending}
              className="rounded"
            />
          </div>

          {validationError && (
            <p className="text-sm text-destructive">{validationError}</p>
          )}

          <DialogFooter className="mt-2">
            <Button
              type="button"
              variant="outline"
              className="rounded cursor-pointer"
              onClick={handleClose}
              disabled={isPending}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="rounded cursor-pointer px-5"
              disabled={isPending}
            >
              {isPending ? "Saving..." : "Save"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
