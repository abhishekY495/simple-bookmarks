import { ComponentProps, Fragment, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { TagResponse } from "@repo/schemas";
import { EllipsisIcon, HashIcon } from "lucide-react";
import Link from "next/link";
import { DeleteTagDialog } from "./dialogs/delete-tag-dialog";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuGroup,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";

export const Tag = ({ tag }: { tag: TagResponse }) => {
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
      <div key={tag.id} className="group relative">
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
            <DropdownMenuItem className="rounded border-b">
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem
              className="rounded"
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
              href={`/my/tags/${tag.id}`}
              className="h-full w-full flex flex-col bg-muted border rounded-t"
            >
              <div className="p-2.5 px-3">
                <p className="font-semibold flex items-center">
                  <HashIcon className="size-4 text-muted-foreground" />
                  <span className="text-lg">{tag.name}</span>
                </p>
                <p className="text-sm text-muted-foreground">
                  {tag.bookmarksCount} bookmarks
                </p>
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
      <DeleteTagDialog
        tagId={tag.id}
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
      />
    </>
  );
};
