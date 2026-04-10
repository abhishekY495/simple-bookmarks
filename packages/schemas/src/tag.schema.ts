import { z } from "zod";
import {
  DEFAULT_PAGINATION_TAKE,
  MAX_PAGINATION_TAKE,
  MIN_PAGINATION_TAKE,
} from "./constants";

// Tag schema
export const TagSchema = z.object({
  id: z.uuid(),
  userId: z.uuid(),
  name: z
    .string({ error: "Name is required" })
    .min(1, "Name is required")
    .max(100, "Name must be less than 100 characters")
    .regex(
      /^[a-z0-9-]+$/,
      "Only lowercase letters, numbers, and hyphens are allowed",
    )
    .toLowerCase(),
  createdAt: z.iso.datetime(),
  updatedAt: z.iso.datetime(),
});
export type Tag = z.infer<typeof TagSchema>;

//
//
//
//
//
// create tag schema
export const CreateTagSchema = TagSchema.omit({
  id: true,
  userId: true,
  createdAt: true,
  updatedAt: true,
});
export type CreateTag = z.infer<typeof CreateTagSchema>;

//
//
//
//
//
// update tag schema
export const UpdateTagSchema = TagSchema.omit({
  id: true,
  userId: true,
  createdAt: true,
  updatedAt: true,
});
export type UpdateTag = z.infer<typeof UpdateTagSchema>;

// bookmark response schema for tag
const TagBookmarkResponseSchema = z.object({
  id: z.uuid(),
  url: z.httpUrl({
    error: "Invalid URL",
  }),
  domain: z
    .hostname({ error: "Invalid domain" })
    .refine((value) => value.includes("."), {
      message: "Domain must include a TLD",
    }),
  title: z.string().nullable(),
  cover: z
    .httpUrl({
      error: "Invalid URL",
    })
    .nullable(),
  parsingStatus: z
    .enum(["processing", "success", "failed"], {
      error: "Invalid parsing status",
    })
    .default("processing"),
  isFavorite: z.boolean().default(false),
  createdAt: z.iso.datetime(),
});
//

//
//
//
//
//
// tag response schema
export const TagResponseSchema = TagSchema.omit({
  userId: true,
  createdAt: true,
  updatedAt: true,
}).extend({
  bookmarksCount: z.number().default(0),
  bookmarks: z.array(TagBookmarkResponseSchema).optional(),
});
export type TagResponse = z.infer<typeof TagResponseSchema>;

// detailed tag response schema
export const DetailedTagResponseSchema = TagSchema.omit({
  userId: true,
  createdAt: true,
  updatedAt: true,
}).extend({
  bookmarksCount: z.number().default(0),
  bookmarks: z
    .array(
      TagBookmarkResponseSchema.extend({
        collection: z
          .object({
            id: z.uuid(),
            name: z.string(),
          })
          .nullable(),
        tags: z
          .array(
            TagSchema.omit({ userId: true, createdAt: true, updatedAt: true }),
          )
          .default([]),
      }),
    )
    .optional(),
});
export type DetailedTagResponse = z.infer<typeof DetailedTagResponseSchema>;

//
//
//
//
//
// paginated tags query schema
export const PaginatedTagRequestSchema = z.object({
  cursor: z.uuid().optional(),
  take: z.coerce
    .number()
    .int()
    .min(MIN_PAGINATION_TAKE)
    .max(MAX_PAGINATION_TAKE)
    .default(DEFAULT_PAGINATION_TAKE),
});
export type PaginatedTagRequest = z.infer<typeof PaginatedTagRequestSchema>;

//
//
//
//
//
// paginated tags response schema
export const PaginatedTagResponseSchema = z.object({
  data: z.array(TagResponseSchema),
  nextCursor: z.uuid().nullable(),
  hasNextPage: z.boolean(),
});
export type PaginatedTagResponse = z.infer<typeof PaginatedTagResponseSchema>;

//
//
//
//
//
// search tags query schema
export const SearchTagsRequestSchema = z.object({
  query: z.string().min(1, "Query is required"),
});
export type SearchTagsRequest = z.infer<typeof SearchTagsRequestSchema>;

//
//
//
//
//
// search tags response schema
export const SearchTagsResponseSchema = z.array(TagResponseSchema);
export type SearchTagsResponse = z.infer<typeof SearchTagsResponseSchema>;
