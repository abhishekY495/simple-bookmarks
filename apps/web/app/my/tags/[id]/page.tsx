"use client";

import { useMemo, useState } from "react";
import { Bookmark } from "@/components/my/bookmark/bookmark";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { getTagByIdService } from "@/services/tag-service";
import { useAuthStore } from "@/store/auth-store";
import { QUERY_KEYS } from "@/utils/constants";
import { useQuery } from "@tanstack/react-query";
import { HashIcon } from "lucide-react";
import Image from "next/image";
import { redirect, useParams } from "next/navigation";
import { EditTagDialog } from "@/components/my/tag/dialogs/edit-tag-dialog";

export default function TagPage() {
  const { id } = useParams<{ id: string }>();
  const user = useAuthStore((s) => s.user);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  if (!user) {
    redirect("/login");
  }

  const {
    data: tag,
    isLoading,
    error,
  } = useQuery({
    queryKey: [QUERY_KEYS.getTagById, id],
    queryFn: () => getTagByIdService(user.accessToken ?? "", id),
  });

  const bookmarks = useMemo(
    () =>
      tag?.bookmarks?.map((bookmark) => ({
        ...bookmark,
        tags: bookmark.tags.map((t) => ({
          ...t,
          bookmarksCount: 0,
        })),
      })) ?? [],
    [tag],
  );

  if (isLoading) {
    return (
      <div className="flex justify-center mt-8">
        <Spinner className="size-8 text-muted-foreground" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center gap-2 text-center mt-10">
        <Image src="/not-found-icon.png" alt="Error" width={62} height={62} />
        <p className="font-semibold">Tag not found</p>
        <p className="text-sm text-muted-foreground">
          The tag you are looking for does not exist.
        </p>
      </div>
    );
  }

  if (!tag) {
    return (
      <div className="flex flex-col items-center justify-center gap-2 text-center mt-10">
        <Image src="/not-found-icon.png" alt="Error" width={62} height={62} />
        <p className="font-semibold">Tag not found</p>
        <p className="text-sm text-muted-foreground">
          The tag you are looking for does not exist.
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="flex flex-col pb-40">
        <div className="sticky top-[49px] z-10 flex flex-col items-center justify-center border-b py-6 pt-5 bg-background">
          <div className="flex flex-col items-center justify-center gap-1">
            <p className="font-semibold flex items-center text-4xl">
              <HashIcon className="size-7.5 text-muted-foreground" />
              <span>{tag?.name}</span>
            </p>
          </div>
          <div className="flex gap-2 text-muted-foreground text-[15px]">
            <p>
              {tag?.bookmarksCount}{" "}
              {tag?.bookmarksCount && tag?.bookmarksCount > 1
                ? "bookmarks"
                : "bookmark"}
            </p>
          </div>
          <Button
            variant="outline"
            className="absolute bottom-5 right-5 rounded px-4 cursor-pointer"
            onClick={() => setIsEditDialogOpen(true)}
          >
            Edit
          </Button>
        </div>
        <div className="p-6">
          {bookmarks.length > 0 ? (
            <div className="grid gap-5 grid-cols-2 sm:grid-cols-3">
              {bookmarks.map((bookmark) => (
                <Bookmark key={bookmark.id} bookmark={bookmark} />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center gap-2 text-center mt-10">
              <Image
                src="/empty-inbox-icon.png"
                alt="No bookmarks"
                width={62}
                height={62}
              />
              <p className="font-semibold">No bookmarks</p>
            </div>
          )}
        </div>
      </div>
      <EditTagDialog
        tag={tag}
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
      />
    </>
  );
}
