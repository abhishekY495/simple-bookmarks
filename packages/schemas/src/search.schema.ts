import { z } from "zod";
import { BookmarkResponseSchema } from "./bookmark.schema";
import { CollectionResponseSchema } from "./collection.schema";
import { TagResponseSchema } from "./tag.schema";

export const SearchRequestSchema = z.object({
  query: z
    .string({ error: "query is required" })
    .min(2, "query must be at least 2 characters long"),
});
export type SearchRequest = z.infer<typeof SearchRequestSchema>;

export const SearchResponseSchema = z.object({
  bookmarks: z.array(BookmarkResponseSchema),
  collections: z.array(CollectionResponseSchema),
  tags: z.array(TagResponseSchema),
});
export type SearchResponse = z.infer<typeof SearchResponseSchema>;
