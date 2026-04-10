import { type ComponentProps, Fragment, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { CollectionResponse } from "@repo/schemas";
import { EllipsisIcon } from "lucide-react";
import Link from "next/link";
import { DeleteCollectionDialog } from "./dialogs/delete-collection-dialog";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuGroup,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";

export function Collection({ collection }: { collection: CollectionResponse }) {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

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
        window.open(`/my/collections/${collection.id}`, "_blank");
      },
      separator: false,
    },
    {
      label: "Copy to clipboard",
      variant: "default",
      onClick: () => {
        navigator.clipboard.writeText(
          `${window.location.origin}/my/collections/${collection.id}`,
        );
      },
      separator: true,
    },
    {
      label: "Edit",
      variant: "default",
      onClick: () => {},
      separator: false,
    },
    {
      label: "Delete",
      variant: "destructive",
      onClick: () => setIsDeleteDialogOpen(true),
      separator: false,
    },
  ];

  return (
    <>
      <div key={collection.id} className="group relative">
        <DropdownMenu>
          <DropdownMenuTrigger
            asChild
            className="absolute top-2 right-2 rounded"
          >
            <Button
              variant="outline"
              className="h-5 w-7 rounded cursor-pointer opacity-0 pointer-events-none transition-opacity group-hover:opacity-100 group-hover:pointer-events-auto group-focus-within:opacity-100 group-focus-within:pointer-events-auto data-[state=open]:opacity-100 data-[state=open]:pointer-events-auto"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
              }}
            >
              <EllipsisIcon />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="rounded">
            <DropdownMenuItem className="cursor-pointer rounded border-b">
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
              href={`/my/collections/${collection.id}`}
              className="h-full flex flex-col bg-muted border rounded-t"
            >
              <div className="p-2.5 px-2 flex flex-col gap-1">
                <span className="rounded text-4xl">{collection.emoji}</span>
                <div className="flex flex-col px-2">
                  <p className="font-semibold text-lg">{collection.name}</p>
                  <div className="flex items-center gap-1.5 text-[15px] text-muted-foreground">
                    <p>{collection.bookmarksCount} bookmarks</p>
                    {collection.isPublic && (
                      <>
                        <span>•</span>
                        <p>Public</p>
                      </>
                    )}
                  </div>
                </div>
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
      <DeleteCollectionDialog
        collectionId={collection.id}
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
      />
    </>
  );
}
