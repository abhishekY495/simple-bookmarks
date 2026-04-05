"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { NAV_ITEMS } from "@/utils/constants";
import { Button } from "../ui/button";
import { PlusIcon } from "lucide-react";
import { AddBookmarkDialog } from "./dialogs/add-bookmark-dialog";

export function Sidebar() {
  const pathname = usePathname();
  const [isAddBookmarkDialogOpen, setIsAddBookmarkDialogOpen] = useState(false);

  const isActive = (href: string) => pathname === href;

  return (
    <>
      <div className="w-72 h-screen sticky top-0 pl-4">
        <div className="flex items-center gap-1.5 cursor-pointer border-b p-2 py-3">
          <Image src="/app-icon.png" alt="logo" width={20} height={20} />
          <p className="font-semibold">Simple Bookmarks</p>
        </div>
        <div className="flex flex-col justify-between mt-2 pr-4">
          <div className="flex flex-col gap-1">
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex gap-2 items-center p-2",
                  isActive(item.href) && "font-semibold bg-muted rounded",
                )}
              >
                <item.icon
                  className="size-4"
                  strokeWidth={isActive(item.href) ? 2.5 : 2}
                />
                {item.label}
              </Link>
            ))}
          </div>
          <div className="flex flex-col gap-2 border-t pt-3 mt-3">
            <Button
              className="rounded cursor-pointer"
              onClick={() => setIsAddBookmarkDialogOpen(true)}
            >
              <PlusIcon className="size-4" /> Add
            </Button>
          </div>
        </div>
      </div>

      <AddBookmarkDialog
        open={isAddBookmarkDialogOpen}
        onOpenChange={setIsAddBookmarkDialogOpen}
      />
    </>
  );
}
