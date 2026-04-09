"use client";

import { Sidebar } from "@/components/my/sidebar";
import { ProtectedRoute } from "@/components/protected-route";
import { getCollectionByIdService } from "@/services/collection-service";
import { getTagByIdService } from "@/services/tag-service";
import { useAuthStore } from "@/store/auth-store";
import { NAV_ITEMS, QUERY_KEYS } from "@/utils/constants";
import { useQuery } from "@tanstack/react-query";
import { CollectionResponse, TagResponse } from "@repo/schemas";
import { ChevronRightIcon } from "lucide-react";
import { useParams, usePathname } from "next/navigation";
import { Skeleton } from "@/components/ui/skeleton";

export default function MyLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { id } = useParams<{ id?: string }>();
  const user = useAuthStore((s) => s.user);

  const headerTitle = NAV_ITEMS.find((item) =>
    pathname.includes(item.href),
  )?.label;
  const isCollectionDetailRoute = pathname.startsWith("/my/collections/");
  const isTagDetailRoute = pathname.startsWith("/my/tags/");

  const { data: collection, isLoading: isLoadingCollection } =
    useQuery<CollectionResponse>({
      queryKey: [QUERY_KEYS.getCollectionById, id],
      queryFn: () =>
        getCollectionByIdService(user?.accessToken ?? "", id ?? ""),
      enabled: false,
    });

  const { data: tag, isLoading: isLoadingTag } = useQuery<TagResponse>({
    queryKey: [QUERY_KEYS.getTagById, id],
    queryFn: () => getTagByIdService(user?.accessToken ?? "", id ?? ""),
    enabled: false,
  });

  const detailName =
    isCollectionDetailRoute && isLoadingCollection ? (
      <Skeleton className="w-24 h-6" />
    ) : isTagDetailRoute && isLoadingTag ? (
      <Skeleton className="w-24 h-6" />
    ) : isCollectionDetailRoute ? (
      collection?.name
    ) : isTagDetailRoute ? (
      tag?.name
    ) : null;

  return (
    <ProtectedRoute>
      <div className="max-w-6xl mx-auto flex">
        <Sidebar />
        <div className="w-full border-x">
          <div className="flex  items-center gap-1 border-b p-3 px-5 sticky top-0 bg-background/90 backdrop-blur-sm z-10 font-semibold">
            {headerTitle}
            {detailName ? (
              <>
                <ChevronRightIcon className="size-4.5 text-muted-foreground/80" />
                <span>{detailName}</span>
              </>
            ) : null}
          </div>
          <div className="p-5">{children}</div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
