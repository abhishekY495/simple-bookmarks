"use client";

import { Bookmark } from "@/components/my/bookmark/bookmark";
import { Spinner } from "@/components/ui/spinner";
import { getBookmarksService } from "@/services/bookmark-service";
import { useAuthStore } from "@/store/auth-store";
import { TAKE_VALUE } from "@/utils/constants";
import { useInfiniteQuery } from "@tanstack/react-query";
import { redirect } from "next/navigation";
import { useEffect, useMemo, useRef } from "react";

export default function UnsortedPage() {
  const user = useAuthStore((s) => s.user);
  const loadMoreRef = useRef<HTMLDivElement | null>(null);

  if (!user) {
    redirect("/login");
  }

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } =
    useInfiniteQuery({
      queryKey: ["bookmarks", TAKE_VALUE, user.id],
      queryFn: ({ pageParam }) =>
        getBookmarksService(user.accessToken ?? "", {
          take: TAKE_VALUE,
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
      <div className="grid gap-5 sm:grid-cols-3 grid-cols-2">
        {bookmarks.map((bookmark) => (
          <Bookmark key={bookmark.id} bookmark={bookmark} />
        ))}
      </div>
      <div ref={loadMoreRef} className="flex justify-center py-6 pb-40">
        {isLoading && <Spinner className="size-8 text-muted-foreground" />}
        {!isLoading && isFetchingNextPage && (
          <Spinner className="size-8 text-muted-foreground mt-10" />
        )}
        {!isLoading && !hasNextPage && bookmarks.length > 0 && (
          <p className="text-muted-foreground py-10">
            You have reached the end.
          </p>
        )}
      </div>
    </>
  );
}
