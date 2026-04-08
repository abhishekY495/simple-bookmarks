import { type ComponentProps, Fragment, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { getDefaultCoverImage } from "@/utils/get-default-cover-image";
import { CollectionResponse } from "@repo/schemas";
import { EllipsisIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { DeleteCollectionDialog } from "../dialogs/delete-collection-dialog";
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
        <DropdownMenu modal={false}>
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
              <Image
                src={collection.cover ?? getDefaultCoverImage(collection.name)}
                alt={collection.name ?? "cover image"}
                loading="eager"
                width={300}
                height={200}
                className="object-cover rounded-t w-full aspect-video"
              />
              <div className="p-2.5 border-t">
                <p className="font-semibold leading-5 text-[15px]">
                  {collection.name}
                </p>
                <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                  <p>{collection.bookmarksCount} bookmarks</p>
                  <span>•</span>
                  <p>{collection.isPublic ? "Public" : "Private"}</p>
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
