import { getDefaultCoverImage } from "@/utils/get-default-cover-image";
import { BookmarkResponse } from "@repo/schemas";
import Link from "next/link";
import Image from "next/image";
import { formatDate } from "@/utils/format-date";
import { DeleteBookmarkDialog } from "@/components/my/dialogs/delete-bookmark-dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { EllipsisIcon, PencilIcon, TrashIcon } from "lucide-react";
import { useState } from "react";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuGroup,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";

export function Bookmark({ bookmark }: { bookmark: BookmarkResponse }) {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const handleCopyToClipboard = () => {
    navigator.clipboard.writeText(bookmark.url);
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
            <DropdownMenuItem className="rounded border-b">
              <PencilIcon />
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem
              className="rounded"
              variant="destructive"
              onSelect={() => setIsDeleteDialogOpen(true)}
            >
              <TrashIcon />
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
                  <p>{bookmark.domain}</p>
                  <span>•</span>
                  <p className="text-xs">{formatDate(bookmark.createdAt)}</p>
                </div>
              </div>
            </Link>
            <ContextMenuContent className="rounded">
              <ContextMenuGroup className="rounded">
                <ContextMenuItem className="rounded cursor-pointer">
                  <Link href={bookmark.url} target="_blank">
                    Open in new tab
                  </Link>
                </ContextMenuItem>
                <ContextMenuItem
                  className="rounded cursor-pointer"
                  onSelect={handleCopyToClipboard}
                >
                  Copy to clipboard
                </ContextMenuItem>
                <ContextMenuSeparator />
                <ContextMenuItem className="rounded cursor-pointer">
                  Edit
                </ContextMenuItem>
                <ContextMenuItem
                  className="rounded cursor-pointer"
                  variant="destructive"
                  onSelect={() => setIsDeleteDialogOpen(true)}
                >
                  Delete
                </ContextMenuItem>
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
    </>
  );
}
