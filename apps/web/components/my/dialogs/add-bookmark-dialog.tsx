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
import { addBookmarkService } from "@/services/bookmark-service";
import { CreateBookmark, CreateBookmarkSchema } from "@repo/schemas";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuthStore } from "@/store/auth-store";
import { QUERY_KEYS } from "@/utils/constants";

type AddBookmarkDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function AddBookmarkDialog({
  open,
  onOpenChange,
}: AddBookmarkDialogProps) {
  const [url, setUrl] = useState("");
  const [validationError, setValidationError] = useState("");
  const user = useAuthStore((s) => s.user);
  const queryClient = useQueryClient();

  const { mutate: addBookmark, isPending } = useMutation({
    mutationFn: (createBookmark: CreateBookmark) =>
      addBookmarkService(user?.accessToken ?? "", createBookmark),
    onSuccess: () => {
      handleClose();
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.getBookmarks });
    },
    onError: (error) => {
      setValidationError(error.message);
    },
  });

  const handleClose = () => {
    setUrl("");
    setValidationError("");
    onOpenChange(false);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setValidationError("");
    let domain = "";

    try {
      domain = new URL(url).hostname;
      if (!domain) {
        setValidationError("Invalid URL");
        return;
      }
    } catch {
      setValidationError("Invalid URL");
      return;
    }

    const result = CreateBookmarkSchema.safeParse({
      url,
      domain,
    });
    if (!result.success) {
      const firstError =
        result.error.issues[0]?.message ?? "Something went wrong";
      setValidationError(firstError);
      return;
    }

    addBookmark(result.data);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md rounded mx-auto -mt-20">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold">
            Add bookmark
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label htmlFor="url" className="text-sm font-medium">
              URL
            </label>
            <input
              id="url"
              type="text"
              placeholder="https://www.youtube.com/watch?v=dQw4w9WgXcQ"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              required
              className="border rounded px-3 h-9 text-sm bg-background outline-none focus-visible:ring-2 focus-visible:ring-ring"
            />
          </div>

          {validationError && (
            <p className="text-sm text-destructive">{validationError}</p>
          )}

          <DialogFooter>
            <DialogClose asChild>
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
