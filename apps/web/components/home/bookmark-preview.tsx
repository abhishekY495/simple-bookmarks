import { Marquee } from "../ui/marquee";
import Image from "next/image";
import { RICH_PREVIEW_BOOKMARKS } from "@/utils/constants";
import Link from "next/link";
import { HashIcon } from "lucide-react";

const Bookmark = ({
  url,
  domain,
  title,
  cover,
  tags,
}: {
  url: string;
  domain: string;
  title: string;
  cover: string;
  tags?: string[];
}) => {
  return (
    <Link
      href={url}
      target="_blank"
      className="h-full w-[270px] flex flex-col bg-neutral-100 dark:bg-neutral-100 border dark:border-neutral-200 rounded-t pb-2"
    >
      <Image
        src={cover}
        alt={title}
        loading="eager"
        width={500}
        height={500}
        className="object-cover rounded w-full aspect-video"
      />
      <div className="p-2.5 py-2 border-t flex flex-col gap-0.5">
        <p className="font-semibold leading-5 text-[15px] text-black">
          {title}
        </p>
        <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
          <p>{domain}</p>
        </div>
        {tags && (
          <div className="flex gap-2 flex-wrap mt-0.5">
            {tags.map((tag) => (
              <div
                key={tag}
                className="flex items-center bg-yellow-100 text-yellow-800 border border-yellow-200 w-fit pb-0.5 px-1.5 rounded"
              >
                <HashIcon className="size-3" />
                <p className="text-xs">{tag}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </Link>
  );
};

export function BookmarkPreview() {
  return (
    <div className="relative flex w-full flex-col items-center justify-center overflow-hidden">
      <Marquee pauseOnHover className="[--duration:60s]" reverse>
        {RICH_PREVIEW_BOOKMARKS.map((bookmark) => (
          <Bookmark key={bookmark.url} {...bookmark} />
        ))}
      </Marquee>
      <div className="from-[#fcfcfc] pointer-events-none absolute inset-y-0 left-0 w-1/4 bg-linear-to-r"></div>
      <div className="from-[#fcfcfc] pointer-events-none absolute inset-y-0 right-0 w-1/4 bg-linear-to-l"></div>
    </div>
  );
}
