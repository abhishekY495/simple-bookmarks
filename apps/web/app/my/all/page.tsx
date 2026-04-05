"use client";

import { Bookmark } from "@/components/my/bookmark/bookmark";
import { Spinner } from "@/components/ui/spinner";
import { getBookmarksService } from "@/services/bookmark-service";
import { useAuthStore } from "@/store/auth-store";
import { QUERY_KEYS, TAKE_VALUE } from "@/utils/constants";
import { useInfiniteQuery } from "@tanstack/react-query";
import Image from "next/image";
import { redirect } from "next/navigation";
import { useEffect, useMemo, useRef } from "react";

export default function AllPage() {
  const user = useAuthStore((s) => s.user);
  const loadMoreRef = useRef<HTMLDivElement | null>(null);

  if (!user) {
    redirect("/login");
  }

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } =
    useInfiniteQuery({
      queryKey: QUERY_KEYS.getAllBookmarks,
      queryFn: ({ pageParam }) =>
        getBookmarksService(user.accessToken ?? "", {
          take: TAKE_VALUE,
          type: "all",
          ...(pageParam ? { cursor: pageParam } : {}),
        }),
      initialPageParam: null as string | null,
      getNextPageParam: (lastPage) =>
        lastPage.hasNextPage ? lastPage.nextCursor : undefined,
    });

  const bookmarks = useMemo(
    () => data?.pages.flatMap((page) => page.data) ?? [],
    [data],
  );

  useEffect(() => {
    const loadMoreTrigger = loadMoreRef.current;

    if (!loadMoreTrigger || !hasNextPage) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];

        if (entry?.isIntersecting && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      {
        rootMargin: "220px 0px",
      },
    );

    observer.observe(loadMoreTrigger);

    return () => {
      observer.unobserve(loadMoreTrigger);
      observer.disconnect();
    };
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  return (
    <>
      {bookmarks.length > 0 ? (
        <div className="grid gap-5 grid-cols-2 sm:grid-cols-3">
          {bookmarks.map((bookmark) => (
            <Bookmark key={bookmark.id} bookmark={bookmark} />
          ))}
        </div>
      ) : !isLoading ? (
        <div className="flex flex-col items-center justify-center gap-2 text-center mt-10">
          <Image
            src="/empty-inbox-icon.png"
            alt="No bookmarks"
            width={62}
            height={62}
          />
          <p className="font-semibold">No bookmarks</p>
        </div>
      ) : null}
      <div ref={loadMoreRef} className="flex justify-center py-6 pb-40">
        {isLoading && <Spinner className="size-8 text-muted-foreground" />}
        {!isLoading && isFetchingNextPage && (
          <Spinner className="size-8 text-muted-foreground mt-10" />
        )}
      </div>
    </>
  );
}
