import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { updateBookmarkService } from "@/services/bookmark-service";
import { useAuthStore } from "@/store/auth-store";
import {
  BookmarkResponse,
  UpdateBookmark,
  UpdateBookmarkSchema,
} from "@repo/schemas";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { HeartIcon } from "lucide-react";
import { useState } from "react";
import { redirect } from "next/navigation";
import { BookmarkCollectionPicker } from "./bookmark-collection-picker";
import { BookmarkTagPicker } from "./bookmark-tag-picker";

type EditBookmarkDialogProps = {
  bookmark: BookmarkResponse;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function EditBookmarkDialog({
  bookmark,
  open,
  onOpenChange,
}: EditBookmarkDialogProps) {
  const user = useAuthStore((s) => s.user);
  const queryClient = useQueryClient();
  const [title, setTitle] = useState(bookmark.title ?? "");
  const [tags, setTags] = useState(bookmark.tags);
  const [collection, setCollection] = useState(bookmark.collection ?? null);
  const [isFavorite, setIsFavorite] = useState(bookmark.isFavorite);
  const [validationError, setValidationError] = useState("");

  if (!user) {
    redirect("/login");
  }

  const handleClose = () => {
    setTitle(bookmark.title ?? "");
    setTags(bookmark.tags);
    setCollection(bookmark.collection ?? null);
    setIsFavorite(bookmark.isFavorite);
    setValidationError("");
    onOpenChange(false);
  };

  const { mutate: updateBookmark, isPending } = useMutation({
    mutationFn: (payload: UpdateBookmark) =>
      updateBookmarkService(user?.accessToken ?? "", bookmark.id, payload),
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

    const trimmedTitle = title.trim();

    if (trimmedTitle.length === 0) {
      setValidationError("Title is required");
      return;
    }
    const result = UpdateBookmarkSchema.safeParse({
      title: trimmedTitle,
      isFavorite,
      tagIds: tags.map((tag) => tag.id),
      collectionId: collection ? collection.id : null,
    });

    if (!result.success) {
      const firstError =
        result.error.issues[0]?.message ?? "Failed to update bookmark";
      setValidationError(firstError);
      return;
    }

    updateBookmark(result.data);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent
        className="sm:max-w-md rounded mx-auto -mt-10 gap-1"
        autoFocus={false}
      >
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold">
            Edit bookmark
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="mt-5 flex flex-col gap-5">
          <div className="flex flex-col gap-1.5">
            <label htmlFor="bookmark-title" className="text-sm font-medium">
              Title
            </label>
            <Input
              id="bookmark-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder={bookmark.domain}
              disabled={isPending}
              className="rounded"
            />
          </div>
          <BookmarkTagPicker
            open={open}
            value={tags}
            onChange={setTags}
            onError={setValidationError}
          />
          <BookmarkCollectionPicker
            open={open}
            value={collection}
            onChange={setCollection}
            onError={setValidationError}
          />

          <button
            type="button"
            aria-pressed={isFavorite}
            onClick={() => setIsFavorite((prev) => !prev)}
            disabled={isPending}
            className="flex  items-center gap-1.5 w-fit cursor-pointer rounded transition-opacity disabled:cursor-not-allowed disabled:opacity-50"
          >
            <HeartIcon
              className={`size-5 p-[2px] rounded ${isFavorite ? "text-red-500 bg-red-100 border border-red-200" : "text-muted-foreground bg-muted border border-border"}`}
              fill={isFavorite ? "currentColor" : "none"}
            />
            <p className="text-[15px] font-medium">Mark as favorite</p>
          </button>

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
