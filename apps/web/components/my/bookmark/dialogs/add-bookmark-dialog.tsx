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
import { useEffect, useRef, useState } from "react";
import {
  addBookmarkService,
  getBookmarkByIdService,
} from "@/services/bookmark-service";
import { CreateBookmark, CreateBookmarkSchema } from "@repo/schemas";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuthStore } from "@/store/auth-store";
import { getDomainFromUrl } from "@/utils/get-domain-fom-url";
import { BOOKMARK_PARSING_INTERVAL, QUERY_KEYS } from "@/utils/constants";

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
  const pollingTimeoutRef = useRef<number | null>(null);
  const user = useAuthStore((s) => s.user);
  const queryClient = useQueryClient();

  const stopPolling = () => {
    if (pollingTimeoutRef.current) {
      window.clearTimeout(pollingTimeoutRef.current);
      pollingTimeoutRef.current = null;
    }
  };

  const invalidateBookmarkQueries = async () => {
    await Promise.all([
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.getCount }),
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.getAllBookmarks }),
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.getFavoritesBookmarks,
      }),
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.getUnsortedBookmarks,
      }),
    ]);
  };

  const pollBookmarkUntilParsed = async (bookmarkId: string) => {
    if (!user?.accessToken) return;

    try {
      const bookmark = await getBookmarkByIdService(
        user.accessToken,
        bookmarkId,
      );
      await invalidateBookmarkQueries();

      if (bookmark.parsingStatus !== "processing") {
        stopPolling();
        return;
      }

      pollingTimeoutRef.current = window.setTimeout(() => {
        void pollBookmarkUntilParsed(bookmarkId);
      }, BOOKMARK_PARSING_INTERVAL);
    } catch {
      stopPolling();
    }
  };

  const { mutate: addBookmark, isPending } = useMutation({
    mutationFn: (createBookmark: CreateBookmark) =>
      addBookmarkService(user?.accessToken ?? "", createBookmark),
    onSuccess: async (bookmark) => {
      handleClose();

      stopPolling();
      await invalidateBookmarkQueries();

      if (bookmark.parsingStatus === "processing") {
        pollingTimeoutRef.current = window.setTimeout(() => {
          void pollBookmarkUntilParsed(bookmark.id);
        }, BOOKMARK_PARSING_INTERVAL);
      }
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

  useEffect(() => {
    return () => {
      stopPolling();
    };
  }, []);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setValidationError("");
    let domain = "";

    try {
      domain = getDomainFromUrl(url);
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
