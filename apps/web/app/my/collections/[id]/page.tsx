"use client";

import { Bookmark } from "@/components/my/bookmark/bookmark";
import { EditCollectionDialog } from "@/components/my/collection/dialogs/edit-colllection-dialog";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { getCollectionByIdService } from "@/services/collection-service";
import { useAuthStore } from "@/store/auth-store";
import { QUERY_KEYS } from "@/utils/constants";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import { redirect, useParams } from "next/navigation";
import { useState } from "react";

export default function CollectionPage() {
  const { id } = useParams<{ id: string }>();
  const user = useAuthStore((s) => s.user);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  if (!user) {
    redirect("/login");
  }

  const {
    data: collection,
    isLoading,
    error,
  } = useQuery({
    queryKey: [QUERY_KEYS.getCollectionById, id],
    queryFn: () => getCollectionByIdService(user.accessToken ?? "", id),
  });

  const bookmarks = collection?.bookmarks ?? [];

  if (isLoading) {
    return (
      <div className="flex justify-center mt-16">
        <Spinner className="size-8 text-muted-foreground" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center gap-2 text-center mt-10">
        <Image src="/not-found-icon.png" alt="Error" width={62} height={62} />
        <p className="font-semibold">Collection not found</p>
        <p className="text-sm text-muted-foreground">
          The collection you are looking <br /> for does not exist.
        </p>
      </div>
    );
  }

  if (!collection) {
    return (
      <div className="flex flex-col items-center justify-center gap-2 text-center mt-10">
        <Image src="/not-found-icon.png" alt="Error" width={62} height={62} />
        <p className="font-semibold">Collection not found</p>
        <p className="text-sm text-muted-foreground">
          The collection you are looking <br /> for does not exist.
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="flex flex-col pb-40">
        <div className="sticky top-[49px] z-10 flex flex-col items-center justify-center border-b py-5 pt-4 bg-background">
          <div className="flex flex-col items-center justify-center gap-1.5">
            <p className="text-8xl rounded-full">{collection?.emoji}</p>
            <p className="text-4xl font-semibold">{collection?.name}</p>
          </div>
          <div className="flex gap-2 text-muted-foreground text-[15px]">
            <p>
              {collection?.bookmarksCount}{" "}
              {collection?.bookmarksCount && collection?.bookmarksCount > 1
                ? "bookmarks"
                : "bookmark"}
            </p>
            {collection?.isPublic && (
              <>
                <span>•</span>
                <p>Public</p>
              </>
            )}
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
      <EditCollectionDialog
        collection={collection}
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
      />
    </>
  );
}
