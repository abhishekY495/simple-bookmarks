"use client";

import { Bookmark } from "@/components/my/bookmark/bookmark";
import { Spinner } from "@/components/ui/spinner";
import { getCollectionByIdService } from "@/services/collection-service";
import { useAuthStore } from "@/store/auth-store";
import { QUERY_KEYS } from "@/utils/constants";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import { redirect, useParams } from "next/navigation";

export default function CollectionPage() {
  const { id } = useParams<{ id: string }>();
  const user = useAuthStore((s) => s.user);

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
      <div className="flex justify-center py-6 pb-40">
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

  return (
    <>
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
    </>
  );
}
