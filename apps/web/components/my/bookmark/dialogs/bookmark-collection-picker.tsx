"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import {
  addCollectionService,
  getCollectionsService,
} from "@/services/collection-service";
import { useAuthStore } from "@/store/auth-store";
import { QUERY_KEYS } from "@/utils/constants";
import {
  BookmarkResponse,
  CreateCollection,
  CreateCollectionSchema,
} from "@repo/schemas";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { LayoutDashboardIcon, SearchIcon } from "lucide-react";

type BookmarkCollectionPickerProps = {
  open: boolean;
  value: BookmarkResponse["collection"];
  onChange: (collection: BookmarkResponse["collection"]) => void;
  onError: (message: string) => void;
};

export function BookmarkCollectionPicker({
  open,
  value,
  onChange,
  onError,
}: BookmarkCollectionPickerProps) {
  const user = useAuthStore((s) => s.user);
  const queryClient = useQueryClient();
  const [collectionSearch, setCollectionSearch] = useState("");

  const { mutate: addCollection, isPending: isAddingCollection } = useMutation({
    mutationFn: (payload: CreateCollection) =>
      addCollectionService(user?.accessToken ?? "", payload),
    onSuccess: async (newCollection) => {
      onChange(newCollection);
      setCollectionSearch("");
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: QUERY_KEYS.getCount,
        }),
        queryClient.invalidateQueries({
          queryKey: QUERY_KEYS.getCollections,
        }),
      ]);
    },
    onError: (error) => {
      onError(error.message);
    },
  });

  const {
    data: allCollections,
    isLoading,
    error,
  } = useQuery({
    queryKey: [...QUERY_KEYS.getCollections, "picker"],
    queryFn: () =>
      getCollectionsService(user?.accessToken ?? "", {
        take: 100,
      }),
    enabled: open && !!user,
  });

  const filteredCollections =
    allCollections?.data.filter((collectionItem) =>
      collectionItem.name
        .toLowerCase()
        .includes(collectionSearch.trim().toLowerCase()),
    ) ?? [];

  const handleAddCollection = () => {
    const name = collectionSearch.trim();
    const result = CreateCollectionSchema.safeParse({ name, isPublic: false });

    if (!result.success) {
      const firstError =
        result.error.issues[0]?.message ?? "Failed to add collection";
      onError(firstError);
      return;
    }

    onError("");
    addCollection(result.data);
  };

  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor="bookmark-collection" className="text-sm font-medium">
        Collection
      </label>
      <div className="flex flex-col gap-1">
        <div className="rounded border px-2.5 py-1.5 bg-muted">
          {value?.name ?? (
            <div className="flex items-center gap-1">
              <LayoutDashboardIcon className="size-4 text-muted-foreground" />
              <p>Unsorted</p>
            </div>
          )}
        </div>
        <div className="flex flex-col border rounded h-48">
          {isLoading && (
            <Spinner className="size-5 text-muted-foreground m-auto" />
          )}
          {error && (
            <p className="text-sm text-destructive m-auto">
              Something went wrong
            </p>
          )}
          {allCollections?.data && (
            <>
              <div className="relative">
                <SearchIcon className="size-5 text-muted-foreground/50 absolute top-1.5 left-1.5" />
                <Input
                  value={collectionSearch}
                  onChange={(e) => setCollectionSearch(e.target.value)}
                  placeholder="Search collections"
                  className="rounded-none h-8 pl-8 border-t-0 border-x-0 border-b focus-visible:ring-0 focus-visible:border-0 focus:border-0 focus:ring-0"
                />
              </div>
              <div className="overflow-y-auto minimal-scrollbar">
                <p
                  className={`${value === null ? "font-semibold bg-muted" : "bg-muted/30"} px-3 py-1.5 cursor-pointer hover:bg-muted flex items-center gap-1`}
                  onClick={() => onChange(null)}
                >
                  <LayoutDashboardIcon className="size-4 text-muted-foreground" />
                  <span>Unsorted</span>
                </p>
                {filteredCollections.map((collectionItem) => (
                  <p
                    key={collectionItem.id}
                    className={`${collectionItem.id === value?.id ? "font-semibold bg-muted" : "bg-muted/30"} px-3 py-1.5 cursor-pointer hover:bg-muted`}
                    onClick={() => onChange(collectionItem)}
                  >
                    {collectionItem.name}
                  </p>
                ))}
                {filteredCollections.length === 0 &&
                  collectionSearch.trim().length > 0 && (
                    <div className="px-3 py-1.5 bg-muted/30 flex items-center justify-between gap-2">
                      <p className="text-sm truncate">
                        {collectionSearch.trim()}
                      </p>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="h-7 rounded cursor-pointer"
                        onClick={handleAddCollection}
                        disabled={isAddingCollection}
                      >
                        {isAddingCollection ? "Adding..." : "Add"}
                      </Button>
                    </div>
                  )}
                {filteredCollections.length === 0 &&
                  collectionSearch.trim().length === 0 && (
                    <p className="px-3 py-1.5 text-sm text-muted-foreground">
                      No collections found
                    </p>
                  )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
