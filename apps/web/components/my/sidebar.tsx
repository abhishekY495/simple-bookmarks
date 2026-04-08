"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { NAV_ITEMS, QUERY_KEYS } from "@/utils/constants";
import { Button } from "../ui/button";
import { PlusIcon } from "lucide-react";
import { AddBookmarkDialog } from "./bookmark/add-bookmark-dialog";
import { AddCollectionDialog } from "./collection/add-collection-dialog";
import { useQuery } from "@tanstack/react-query";
import { getCountService } from "@/services/user-services";
import { useAuthStore } from "@/store/auth-store";
import { Count } from "@repo/schemas";
import { Skeleton } from "../ui/skeleton";

export function Sidebar() {
  const pathname = usePathname();
  const [isAddBookmarkDialogOpen, setIsAddBookmarkDialogOpen] = useState(false);
  const [isAddCollectionDialogOpen, setIsAddCollectionDialogOpen] =
    useState(false);
  const user = useAuthStore((s) => s.user);

  const isActive = (href: string) => pathname === href;
  const isCollectionsTab = pathname === "/my/collections";

  const handleAddClick = () => {
    if (isCollectionsTab) {
      setIsAddCollectionDialogOpen(true);
      return;
    }

    setIsAddBookmarkDialogOpen(true);
  };

  const {
    data: count,
    isLoading,
    error,
  } = useQuery({
    queryKey: QUERY_KEYS.getCount,
    queryFn: () => getCountService(user?.accessToken ?? ""),
  });

  return (
    <>
      <div className="w-72 h-screen sticky top-0 pl-4">
        <div className="flex items-center gap-1.5 cursor-pointer border-b p-2 py-3">
          <Image src="/app-icon.png" alt="logo" width={20} height={20} />
          <p className="font-semibold">Simple Bookmarks</p>
        </div>
        <div className="flex flex-col justify-between mt-2 pr-3">
          <div className="flex flex-col gap-1">
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex justify-between gap-2 items-center p-2 px-3",
                  isActive(item.href) && "font-semibold bg-muted rounded",
                )}
              >
                <div className="flex items-center justify-between gap-2">
                  <item.icon
                    className="size-4"
                    strokeWidth={isActive(item.href) ? 2.5 : 2}
                  />
                  {item.label}
                </div>
                {isLoading && (
                  <div className="text-sm text-muted-foreground">
                    <Skeleton className="size-5 rounded" />
                  </div>
                )}
                {!error && !isLoading && (
                  <div className="text-sm text-muted-foreground">
                    {count?.[item.label.toLowerCase() as keyof Count]}
                  </div>
                )}
              </Link>
            ))}
          </div>
          <div className="flex flex-col gap-2 border-t pt-3 mt-3">
            <Button className="rounded cursor-pointer" onClick={handleAddClick}>
              <PlusIcon className="size-4" /> Add
            </Button>
          </div>
        </div>
      </div>

      <AddBookmarkDialog
        open={isAddBookmarkDialogOpen}
        onOpenChange={setIsAddBookmarkDialogOpen}
      />
      <AddCollectionDialog
        open={isAddCollectionDialogOpen}
        onOpenChange={setIsAddCollectionDialogOpen}
      />
    </>
  );
}
