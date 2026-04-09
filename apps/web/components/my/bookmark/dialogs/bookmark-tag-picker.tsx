"use client";

import {
  Combobox,
  ComboboxChip,
  ComboboxChips,
  ComboboxChipsInput,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxItem,
  ComboboxList,
  ComboboxValue,
  useComboboxAnchor,
} from "@/components/ui/combobox";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { addTagService, getTagsService } from "@/services/tag-service";
import { useAuthStore } from "@/store/auth-store";
import { QUERY_KEYS } from "@/utils/constants";
import { BookmarkResponse, CreateTag, CreateTagSchema } from "@repo/schemas";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { HashIcon } from "lucide-react";
import { useMemo, useState } from "react";

type BookmarkTagPickerProps = {
  open: boolean;
  value: BookmarkResponse["tags"];
  onChange: (tags: BookmarkResponse["tags"]) => void;
  onError: (message: string) => void;
};

export function BookmarkTagPicker({
  open,
  value,
  onChange,
  onError,
}: BookmarkTagPickerProps) {
  const anchor = useComboboxAnchor();
  const user = useAuthStore((s) => s.user);
  const queryClient = useQueryClient();
  const [tagSearch, setTagSearch] = useState("");

  const {
    data: allTags,
    isLoading,
    error,
  } = useQuery({
    queryKey: [...QUERY_KEYS.getTags, "picker"],
    queryFn: () =>
      getTagsService(user?.accessToken ?? "", {
        take: 100,
      }),
    enabled: open && !!user,
  });

  const { mutate: addTag, isPending: isAddingTag } = useMutation({
    mutationFn: (payload: CreateTag) =>
      addTagService(user?.accessToken ?? "", payload),
    onSuccess: async (newTag) => {
      onError("");
      onChange(
        value.some((tag) => tag.id === newTag.id) ? value : [...value, newTag],
      );
      setTagSearch("");
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: QUERY_KEYS.getCount,
        }),
        await queryClient.invalidateQueries({
          queryKey: QUERY_KEYS.getTags,
        }),
      ]);
    },
    onError: (mutationError) => {
      onError(mutationError.message);
    },
  });

  const tagsByName = useMemo(
    () => new Map((allTags?.data ?? []).map((tag) => [tag.name, tag])),
    [allTags?.data],
  );

  const selectedTagNames = value.map((tag) => tag.name);
  const availableTagNames = (allTags?.data ?? []).map((tag) => tag.name);
  const trimmedSearch = tagSearch.trim();
  const normalizedSearch = trimmedSearch.toLowerCase();
  const hasSearchMatch = availableTagNames.some((tagName) =>
    tagName.toLowerCase().includes(normalizedSearch),
  );
  const canShowAddTag = normalizedSearch.length > 0 && !hasSearchMatch;

  const handleValueChange = (selectedNames: string[]) => {
    const selectedTags = selectedNames
      .map((tagName) => tagsByName.get(tagName))
      .filter((tag) => !!tag);

    onError("");
    onChange(selectedTags);
  };

  const handleAddTag = () => {
    const result = CreateTagSchema.safeParse({ name: trimmedSearch });

    if (!result.success) {
      const firstError = result.error.issues[0]?.message ?? "Failed to add tag";
      onError(firstError);
      return;
    }

    addTag(result.data);
  };

  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor="bookmark-tags" className="text-sm font-medium">
        Tags
      </label>
      <div className="relative">
        <Combobox
          multiple
          autoHighlight
          items={availableTagNames}
          value={selectedTagNames}
          onValueChange={handleValueChange}
        >
          <ComboboxChips
            id="bookmark-tags"
            ref={anchor}
            className="w-full bg-background rounded"
          >
            <ComboboxValue>
              {(values) => (
                <>
                  {values.map((tagName: string) => (
                    <ComboboxChip
                      key={tagName}
                      className="rounded gap-0.5 bg-yellow-100 text-yellow-700"
                    >
                      <HashIcon className="size-3" />
                      {tagName}
                    </ComboboxChip>
                  ))}
                  <ComboboxChipsInput
                    placeholder={
                      selectedTagNames.length > 0 ? "" : "Select tags"
                    }
                    className="rounded"
                    value={tagSearch}
                    onChange={(event) => setTagSearch(event.target.value)}
                  />
                </>
              )}
            </ComboboxValue>
          </ComboboxChips>
          <ComboboxContent anchor={anchor} className="rounded">
            <ComboboxEmpty>No tags found.</ComboboxEmpty>
            <ComboboxList className="rounded">
              {(item) => (
                <ComboboxItem
                  key={item}
                  value={item}
                  className="rounded gap-0.5"
                >
                  <HashIcon className="size-3" />
                  {item}
                </ComboboxItem>
              )}
            </ComboboxList>
            {canShowAddTag && (
              <div className="px-2 py-1.5 border-t flex items-center justify-between gap-2">
                <div className="text-sm truncate flex items-center gap-1 text-muted-foreground">
                  <HashIcon className="size-3" />
                  <span className="truncate">{trimmedSearch}</span>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="h-7 rounded cursor-pointer"
                  onClick={handleAddTag}
                  disabled={isAddingTag}
                >
                  {isAddingTag ? "Adding..." : "Add"}
                </Button>
              </div>
            )}
          </ComboboxContent>
        </Combobox>
        {isLoading && (
          <div className="absolute inset-y-0 right-2 flex items-center">
            <Spinner className="size-4 text-muted-foreground" />
          </div>
        )}
      </div>
      {error && (
        <p className="text-sm text-destructive">Failed to load tags.</p>
      )}
    </div>
  );
}
