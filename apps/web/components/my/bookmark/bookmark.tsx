import { getDefaultCoverImage } from "@/utils/get-default-cover-image";
import { BookmarkResponse } from "@repo/schemas";
import Link from "next/link";
import Image from "next/image";
import { formatDate } from "@/utils/format-date";

export function Bookmark({ bookmark }: { bookmark: BookmarkResponse }) {
  return (
    <Link
      key={bookmark.id}
      href={bookmark.url}
      target="_blank"
      className="flex flex-col bg-muted border rounded-t"
    >
      <div>
        <Image
          src={bookmark.cover ?? getDefaultCoverImage(bookmark.url)}
          alt={bookmark.title ?? "cover image"}
          loading="eager"
          width={300}
          height={200}
          className="object-cover rounded-t w-full aspect-video"
        />
        <div className="p-1.5 px-2">
          <p className="font-semibold leading-5">
            {bookmark.title ?? bookmark.domain}
          </p>
          <div className="flex items-center gap-1.5">
            <p className="text-sm text-muted-foreground">{bookmark.domain}</p>
            <span className="text-sm text-muted-foreground">•</span>
            <p className="text-xs text-muted-foreground">
              {formatDate(bookmark.createdAt)}
            </p>
          </div>
        </div>
      </div>
    </Link>
  );
}
