import { getDefaultCoverImage } from "@/utils/get-default-cover-image";
import { BookmarkResponse } from "@repo/schemas";
import Link from "next/link";
import Image from "next/image";
import { formatDate } from "@/utils/format-date";
import { DeleteBookmarkDialog } from "@/components/my/bookmark/dialogs/delete-bookmark-dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { EllipsisIcon, FolderIcon, HashIcon, HeartIcon } from "lucide-react";
import { ComponentProps, Fragment, useState } from "react";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuGroup,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import { EditBookmarkDialog } from "./dialogs/edit-bookmark-dialog";
import { usePathname } from "next/navigation";

export function Bookmark({ bookmark }: { bookmark: BookmarkResponse }) {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const pathname = usePathname();

  const contextMenuItems: Array<{
    label: string;
    variant?: ComponentProps<typeof ContextMenuItem>["variant"];
    onClick: () => void;
    separator?: boolean;
  }> = [
    {
      label: "Open in new tab",
      variant: "default",
      onClick: () => {
        window.open(bookmark.url, "_blank");
      },
      separator: false,
    },
    {
      label: "Copy to clipboard",
      variant: "default",
      onClick: () => {
        navigator.clipboard.writeText(bookmark.url);
      },
      separator: true,
    },
    {
      label: "Edit",
      variant: "default",
      onClick: () => setIsEditDialogOpen(true),
      separator: false,
    },
    {
      label: "Delete",
      variant: "destructive",
      onClick: () => setIsDeleteDialogOpen(true),
      separator: false,
    },
  ];

  const renderCollection = () => {
    if (!bookmark.collection) return null;
    if (
      pathname.includes("/my/all") ||
      pathname.includes("/my/favorites") ||
      pathname.includes("/my/tags")
    ) {
      return (
        <div className="flex gap-1.5 items-center">
          <FolderIcon className="size-3.5 text-muted-foreground fill-current" />
          <p className="text-muted-foreground text-sm">
            {bookmark.collection.name}
          </p>
        </div>
      );
    }
  };

  const renderTags = () => {
    return (
      <div className="flex gap-2 flex-wrap mt-0.5">
        {bookmark.tags.map((tag) => (
          <Link
            href={`/my/tags/${tag.id}`}
            key={tag.id}
            className="flex items-center bg-yellow-100 text-yellow-700 dark:bg-yellow-800 dark:text-yellow-300 border border-yellow-200 dark:border-yellow-800 w-fit pb-0.5 px-1.5 rounded hover:underline underline-offset-2 decoration-yellow-400"
          >
            <HashIcon className="size-3" />
            <p className="text-xs">{tag.name}</p>
          </Link>
        ))}
      </div>
    );
  };

  return (
    <>
      <div key={bookmark.id} className="group relative">
        <DropdownMenu modal={false}>
          <DropdownMenuTrigger
            asChild
            className="absolute top-2 right-2 rounded bg-white dark:bg-black"
          >
            <Button
              variant="outline"
              className="h-5 w-7 rounded cursor-pointer opacity-0 pointer-events-none transition-opacity group-hover:opacity-100 group-hover:pointer-events-auto group-focus-within:opacity-100 group-focus-within:pointer-events-auto data-[state=open]:opacity-100 data-[state=open]:pointer-events-auto"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
              }}
            >
              <EllipsisIcon className="size-4 dark:text-white" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="rounded">
            <DropdownMenuItem
              className="cursor-pointer rounded border-b"
              onSelect={() => setIsEditDialogOpen(true)}
            >
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem
              className="cursor-pointer rounded"
              variant="destructive"
              onSelect={() => setIsDeleteDialogOpen(true)}
            >
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <ContextMenu modal={false}>
          <ContextMenuTrigger className="w-full h-full">
            <Link
              href={bookmark.url}
              target="_blank"
              className="h-full w-full flex flex-col bg-muted border rounded-t"
            >
              <Image
                src={bookmark.cover ?? getDefaultCoverImage(bookmark.url)}
                alt={bookmark.title ?? "cover image"}
                loading="eager"
                width={300}
                height={200}
                className="object-cover rounded-t w-full aspect-video"
              />
              <div className="p-2.5 border-t flex flex-col gap-0.5">
                <p className="font-semibold leading-5 text-[15px]">
                  {bookmark.title ?? bookmark.domain}
                </p>
                <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                  {bookmark.isFavorite && (
                    <HeartIcon
                      className="size-3 text-red-500"
                      fill="currentColor"
                    />
                  )}
                  <p>{bookmark.domain}</p>
                  <span className="text-muted-foreground/50">•</span>
                  <p className="text-xs">{formatDate(bookmark.createdAt)}</p>
                </div>
                {renderCollection()}
                {renderTags()}
              </div>
            </Link>
            <ContextMenuContent className="rounded">
              <ContextMenuGroup className="rounded">
                {contextMenuItems.map((item) => (
                  <Fragment key={item.label}>
                    <ContextMenuItem
                      className="rounded cursor-pointer"
                      variant={item.variant}
                      onClick={item.onClick}
                    >
                      {item.label}
                    </ContextMenuItem>
                    {item.separator && <ContextMenuSeparator />}
                  </Fragment>
                ))}
              </ContextMenuGroup>
            </ContextMenuContent>
          </ContextMenuTrigger>
        </ContextMenu>
      </div>
      <DeleteBookmarkDialog
        bookmarkId={bookmark.id}
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
      />
      <EditBookmarkDialog
        key={`${bookmark.id}-${bookmark.title ?? bookmark.url}-${bookmark.isFavorite}`}
        bookmark={bookmark}
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
      />
    </>
  );
}
