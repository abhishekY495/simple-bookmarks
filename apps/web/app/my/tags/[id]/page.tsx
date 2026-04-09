"use client";

import { getTagByIdService } from "@/services/tag-service";
import { useAuthStore } from "@/store/auth-store";
import { QUERY_KEYS } from "@/utils/constants";
import { useQuery } from "@tanstack/react-query";
import { redirect, useParams } from "next/navigation";

export default function TagPage() {
  const { id } = useParams<{ id: string }>();
  const user = useAuthStore((s) => s.user);

  if (!user) {
    redirect("/login");
  }

  const { data: tag } = useQuery({
    queryKey: [QUERY_KEYS.getTagById, id],
    queryFn: () => getTagByIdService(user.accessToken ?? "", id),
  });

  return <div>{tag?.name}</div>;
}
