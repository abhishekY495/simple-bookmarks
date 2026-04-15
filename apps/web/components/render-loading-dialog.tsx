"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { Light } from "./light";
import { healthService } from "@/services/health-service";
import {
  HEALTH_CHECK_INTERVAL,
  QUERY_KEYS,
  SERVER_LIVE_SESSION_KEY,
} from "@/utils/constants";

export function RenderLoadingDialog({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isHomepage = pathname === "/";
  const [storedServerLive] = useState(
    () =>
      typeof window !== "undefined" &&
      window.sessionStorage.getItem(SERVER_LIVE_SESSION_KEY) === "true",
  );
  const [isDialogOpen, setIsDialogOpen] = useState(() => !storedServerLive);

  const { isSuccess } = useQuery({
    queryKey: QUERY_KEYS.serverHealthCheck,
    queryFn: async () => {
      const data = await healthService();
      window.sessionStorage.setItem(SERVER_LIVE_SESSION_KEY, "true");
      return data;
    },
    enabled: !storedServerLive && !isHomepage,
    retry: false,
    refetchOnWindowFocus: false,
    refetchInterval: (query) =>
      query.state.status === "success" ? false : HEALTH_CHECK_INTERVAL,
  });

  const isServerLive = isHomepage || storedServerLive || isSuccess;

  return (
    <>
      {isServerLive ? children : null}

      <Dialog open={!storedServerLive && isDialogOpen && !isHomepage}>
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
            <Button
              disabled={!isSuccess}
              className="rounded px-5 enabled:cursor-pointer disabled:pointer-events-auto disabled:cursor-not-allowed"
              onClick={() => setIsDialogOpen(false)}
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
