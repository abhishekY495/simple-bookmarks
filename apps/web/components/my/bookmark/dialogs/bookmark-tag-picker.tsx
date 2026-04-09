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
import { Spinner } from "@/components/ui/spinner";
import { getTagsService } from "@/services/tag-service";
import { useAuthStore } from "@/store/auth-store";
import { QUERY_KEYS } from "@/utils/constants";
import { BookmarkResponse } from "@repo/schemas";
import { useQuery } from "@tanstack/react-query";
import { HashIcon } from "lucide-react";
import { useMemo } from "react";

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

  const tagsByName = useMemo(
    () => new Map((allTags?.data ?? []).map((tag) => [tag.name, tag])),
    [allTags?.data],
  );

  const selectedTagNames = value.map((tag) => tag.name);
  const availableTagNames = (allTags?.data ?? []).map((tag) => tag.name);

  const handleValueChange = (selectedNames: string[]) => {
    const selectedTags = selectedNames
      .map((tagName) => tagsByName.get(tagName))
      .filter((tag) => !!tag);

    onError("");
    onChange(selectedTags);
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
