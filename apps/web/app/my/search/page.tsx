"use client";

import { useEffect, useState } from "react";
import { Bookmark } from "@/components/my/bookmark/bookmark";
import { Collection } from "@/components/my/collection/collection";
import { Tag } from "@/components/my/tag/tag";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { searchService } from "@/services/search-service";
import { useAuthStore } from "@/store/auth-store";
import { DEBOUNCE_TIME, QUERY_KEYS } from "@/utils/constants";
import { useQuery } from "@tanstack/react-query";
import { XIcon } from "lucide-react";
import Image from "next/image";

export default function SearchPage() {
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const user = useAuthStore((s) => s.user);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setDebouncedQuery(query);
    }, DEBOUNCE_TIME);

    return () => clearTimeout(timeout);
  }, [query]);

  const { data, isLoading } = useQuery({
    queryKey: [QUERY_KEYS.search, debouncedQuery],
    queryFn: () => searchService(user?.accessToken ?? "", debouncedQuery),
    enabled: !!user?.accessToken && debouncedQuery.trim().length >= 3,
  });

  const bookmarks = data?.bookmarks ?? [];
  const collections = data?.collections ?? [];
  const tags = data?.tags ?? [];
  const hasSearchTerm = debouncedQuery.trim().length >= 3;

  return (
    <div className="flex flex-col gap-3 p-5">
      <div className="relative">
        <Input
          placeholder="Search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full rounded"
        />
        <XIcon
          className="size-5 text-muted-foreground/80 absolute top-2 right-2 cursor-pointer"
          onClick={() => setQuery("")}
        />
      </div>

      <Tabs defaultValue="bookmarks" className="w-full rounded space-y-1">
        <TabsList className="rounded w-full">
          <TabsTrigger value="bookmarks" className="rounded border-x">
            Bookmarks ({bookmarks.length})
          </TabsTrigger>
          <TabsTrigger value="collections" className="rounded border-x">
            Collections ({collections.length})
          </TabsTrigger>
          <TabsTrigger value="tags" className="rounded border-x">
            Tags ({tags.length})
          </TabsTrigger>
        </TabsList>

        {!hasSearchTerm && (
          <p className="text-sm text-muted-foreground text-center mt-10">
            Type at least 2 characters to search
          </p>
        )}
        {hasSearchTerm && isLoading && (
          <Spinner className="size-6 text-muted-foreground m-auto mt-10" />
        )}
        {hasSearchTerm && !isLoading && (
          <>
            <TabsContent value="bookmarks" className="space-y-2">
              {bookmarks.length === 0 ? (
                <div className="flex flex-col items-center justify-center gap-2 mt-14">
                  <Image
                    src="/app-icon.png"
                    alt="No bookmarks"
                    width={48}
                    height={48}
                    loading="eager"
                  />
                  <p className="font-semibold">No bookmarks found</p>
                </div>
              ) : (
                <div className="grid gap-5 grid-cols-2 sm:grid-cols-3">
                  {bookmarks.map((bookmark) => (
                    <Bookmark key={bookmark.id} bookmark={bookmark} />
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="collections" className="space-y-2">
              {collections.length === 0 ? (
                <div className="flex flex-col items-center justify-center gap-2 mt-14">
                  <Image
                    src="/folder-icon.png"
                    alt="No collections"
                    width={48}
                    height={48}
                    loading="eager"
                  />
                  <p className="font-semibold">No collections found</p>
                </div>
              ) : (
                <div className="grid gap-5 grid-cols-2 sm:grid-cols-3">
                  {collections.map((collection) => (
                    <Collection key={collection.id} collection={collection} />
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="tags" className="space-y-2">
              {tags.length === 0 ? (
                <div className="flex flex-col items-center justify-center gap-2 mt-14">
                  <Image
                    src="/hashtag-icon.png"
                    alt="No tags"
                    width={44}
                    height={44}
                    loading="eager"
                  />
                  <p className="font-semibold">No tags found</p>
                </div>
              ) : (
                <div className="grid gap-5 grid-cols-2 sm:grid-cols-3">
                  {tags.map((tag) => (
                    <Tag key={tag.id} tag={tag} />
                  ))}
                </div>
              )}
            </TabsContent>
          </>
        )}
      </Tabs>
    </div>
  );
}
