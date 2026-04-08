import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { TagResponse } from "@repo/schemas";
import { EllipsisIcon, HashIcon, PencilIcon, TrashIcon } from "lucide-react";
import Link from "next/link";
import { DeleteTagDialog } from "../dialogs/delete-tag-dialog";

export const Tag = ({ tag }: { tag: TagResponse }) => {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  return (
    <>
      <div key={tag.id} className="group relative">
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
        <Link
          href={`/my/tags/${tag.id}`}
          className="h-full flex flex-col bg-muted border rounded"
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
      </div>
      <DeleteTagDialog
        tagId={tag.id}
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
      />
    </>
  );
};
