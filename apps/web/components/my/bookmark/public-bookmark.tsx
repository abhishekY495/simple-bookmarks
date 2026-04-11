import { getDefaultCoverImage } from "@/utils/get-default-cover-image";
import { BookmarkResponse } from "@repo/schemas";
import Image from "next/image";
import Link from "next/link";

type PublicBookmarkProps = {
  bookmark: BookmarkResponse;
};

export function PublicBookmark({ bookmark }: PublicBookmarkProps) {
  return (
    <Link
      href={bookmark.url}
      target="_blank"
      className="h-full w-full flex flex-col bg-muted border rounded-t"
    >
      <Image
        src={bookmark.cover ?? getDefaultCoverImage(bookmark.url)}
        alt={bookmark.title ?? "cover image"}
        loading="eager"
        width={500}
        height={500}
        className="object-cover rounded-t w-full aspect-video"
      />
      <div className="p-2.5 py-2 border-t flex flex-col gap-0.5">
        <p className="font-semibold leading-5 text-[15px]">
          {bookmark.title ?? bookmark.domain}
        </p>
        <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
          <p>{bookmark.domain}</p>
        </div>
      </div>
    </Link>
  );
}
