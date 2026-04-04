import { getDefaultCoverImage } from "@/utils/get-default-cover-image";
import { BookmarkResponse } from "@repo/schemas";
import Link from "next/link";
import Image from "next/image";

export function Bookmark({ bookmark }: { bookmark: BookmarkResponse }) {
  return (
    <div key={bookmark.id} className="flex flex-col">
      <Link href={bookmark.url} target="_blank">
        <Image
          src={bookmark.cover ?? getDefaultCoverImage(bookmark.url)}
          alt={bookmark.title ?? "cover image"}
          loading="eager"
          width={100}
          height={100}
          className="w-full h-32 object-cover rounded-t"
        />
      </Link>
      <p className="bg-muted p-1.5 px-2 border-x border-b border-border">
        {bookmark.domain}
      </p>
    </div>
  );
}
