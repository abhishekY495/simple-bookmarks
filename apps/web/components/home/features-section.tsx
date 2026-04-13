import Image from "next/image";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { FEATURES } from "@/utils/constants";
import { BookmarkPreview } from "./bookmark-preview";

export function FeaturesSection() {
  return (
    <section className="flex flex-col items-center gap-12 mt-5">
      <div className="flex flex-col items-center gap-4">
        <h2 className="text-4xl font-bold text-black">✨ Features</h2>
        <p className="text-neutral-500 text-center dark:text-neutral-500">
          Simple Bookmarks is packed with amazing features that enable you to
          better organize your bookmarks. <br className="hidden md:block" /> A
          complete bookmark manager with all the features you need.
        </p>
      </div>
      <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10">
        {FEATURES.map((feature) => (
          <Card
            key={feature.name}
            className={cn(
              "rounded border dark:border-neutral-200 gap-0 bg-neutral-50/50 dark:bg-neutral-50/50 shadow-none px-2 pb-8",
              feature.fullWidth && "md:col-span-2 col-span-1",
            )}
          >
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-black">
                {feature.name}
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-2">
              <p
                className="text-neutral-500 dark:text-neutral-500"
                dangerouslySetInnerHTML={{ __html: feature.description }}
              />
              {feature.imagePath && (
                <Image
                  src={feature.imagePath}
                  alt={feature.name}
                  width={1000}
                  height={1000}
                  loading="eager"
                  className="w-full h-full object-cover rounded"
                />
              )}
              {feature.name.includes("Preview") && <BookmarkPreview />}
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}
