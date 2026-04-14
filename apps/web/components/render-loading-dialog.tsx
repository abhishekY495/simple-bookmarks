"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { healthService } from "@/services/health-service";
import Link from "next/link";
import { Light } from "./light";
import { HEALTH_CHECK_INTERVAL, QUERY_KEYS } from "@/utils/constants";

export function RenderLoadingDialog({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isDialogOpen, setIsDialogOpen] = useState(true);

  const { isSuccess } = useQuery({
    queryKey: QUERY_KEYS.serverHealthCheck,
    queryFn: healthService,
    retry: false,
    refetchOnWindowFocus: false,
    refetchInterval: (query) =>
      query.state.status === "success" ? false : HEALTH_CHECK_INTERVAL,
  });

  const handleOpenChange = (open: boolean) => {
    if (open || isSuccess) {
      setIsDialogOpen(open);
    }
  };

  return (
    <>
      {isSuccess ? children : null}

      <Dialog open={isDialogOpen} onOpenChange={handleOpenChange}>
        <DialogContent
          className="sm:max-w-md rounded -mt-20 gap-1"
          initialFocus={false}
          showCloseButton={false}
        >
          <DialogHeader className="gap-3 border-b pb-0.5">
            <div className="flex items-center gap-2">
              <Light isServerLive={isSuccess} />
              <DialogTitle className="text-lg font-semibold">
                {isSuccess ? "Server is live" : "Server is starting"}
              </DialogTitle>
            </div>
          </DialogHeader>

          <DialogDescription>
            Server is hosted on{" "}
            <Link
              href="https://render.com"
              target="_blank"
              className="font-semibold text-blue-500 hover:underline"
            >
              Render
            </Link>
            , so it may take some time to start.
            <br />
            Please wait till the above <b>light</b> turns <b>green</b> and then
            you can close this message.
          </DialogDescription>

          <DialogFooter>
            <DialogClose
              render={
                <Button
                  disabled={!isSuccess}
                  className="rounded px-5 enabled:cursor-pointer disabled:pointer-events-auto disabled:cursor-not-allowed"
                />
              }
            >
              Close
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
