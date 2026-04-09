"use client";

import { getCollectionByIdService } from "@/services/collection-service";
import { useAuthStore } from "@/store/auth-store";
import { QUERY_KEYS } from "@/utils/constants";
import { useQuery } from "@tanstack/react-query";
import { redirect, useParams } from "next/navigation";

export default function CollectionPage() {
  const { id } = useParams<{ id: string }>();
  const user = useAuthStore((s) => s.user);

  if (!user) {
    redirect("/login");
  }

  const { data: collection } = useQuery({
    queryKey: [QUERY_KEYS.getCollectionById, id],
    queryFn: () => getCollectionByIdService(user.accessToken ?? "", id),
  });

  return <div>{collection?.name}</div>;
}
