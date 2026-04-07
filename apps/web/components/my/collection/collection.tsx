import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { getDefaultCoverImage } from "@/utils/get-default-cover-image";
import { CollectionResponse } from "@repo/schemas";
import { EllipsisIcon, PencilIcon, TrashIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { DeleteCollectionDialog } from "../dialogs/delete-collection-dialog";

export function Collection({ collection }: { collection: CollectionResponse }) {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  return (
    <>
      <div
        key={collection.id}
        className="group relative flex flex-col bg-muted border rounded-t"
      >
        {" "}
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
        <Link href={`/my/collections/${collection.id}`}>
          <Image
            src={collection.cover ?? getDefaultCoverImage(collection.name)}
            alt={collection.name ?? "cover image"}
            loading="eager"
            width={300}
            height={200}
            className="object-cover rounded-t w-full aspect-video"
          />
          <div className="p-2.5">
            <p className="font-semibold leading-5 text-[15px]">
              {collection.name}
            </p>
            <div className="flex items-center gap-1.5">
              <p className="text-sm text-muted-foreground">
                {collection.isPublic ? "Public" : "Private"}
              </p>
            </div>
          </div>
        </Link>
      </div>
      <DeleteCollectionDialog
        collectionId={collection.id}
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
      />
    </>
  );
}
