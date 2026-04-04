import { z } from "zod";
import {
  DEFAULT_PAGINATION_TAKE,
  MAX_PAGINATION_TAKE,
  MIN_PAGINATION_TAKE,
} from "./constants";

export const BookmarkParsingStatus = {
  processing: "processing",
  success: "success",
  failed: "failed",
} as const;
export type BookmarkParsingStatus =
  (typeof BookmarkParsingStatus)[keyof typeof BookmarkParsingStatus];

export const BookmarkSchema = z.object({
  id: z.uuid(),
  userId: z.uuid(),
  url: z.httpUrl({
    error: "Invalid URL",
  }),
  domain: z
    .hostname({ error: "Invalid domain" })
    .refine((value) => value.includes("."), {
      message: "Domain must include a TLD",
    }),
  title: z.string().nullable(),
  cover: z.string().nullable(),
  parsingStatus: z
    .enum(BookmarkParsingStatus, {
      error: "Invalid parsing status",
    })
    .default(BookmarkParsingStatus.processing),
  isFavorite: z.boolean().default(false),
  createdAt: z.iso.datetime(),
  updatedAt: z.iso.datetime(),
});
export type Bookmark = z.infer<typeof BookmarkSchema>;

// create bookmark schema
export const CreateBookmarkSchema = BookmarkSchema.omit({
  id: true,
  userId: true,
  title: true,
  cover: true,
  parsingStatus: true,
  isFavorite: true,
  createdAt: true,
  updatedAt: true,
});
export type CreateBookmark = z.infer<typeof CreateBookmarkSchema>;

// update bookmark schema
export const UpdateBookmarkSchema = z
  .object({
    title: z.string().nullable().optional(),
    cover: z.string().nullable().optional(),
    parsingStatus: z.enum(BookmarkParsingStatus).optional(),
    isFavorite: z.boolean().optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message:
      "At least one field (title, cover, parsingStatus, isFavorite) is required",
  });
export type UpdateBookmark = z.infer<typeof UpdateBookmarkSchema>;

// bookmark response schema
export const BookmarkResponseSchema = BookmarkSchema.omit({
  userId: true,
  updatedAt: true,
});
export type BookmarkResponse = z.infer<typeof BookmarkResponseSchema>;

// paginated bookmarks query schema
export const PaginatedBookmarkRequestSchema = z.object({
  cursor: z.uuid().optional(),
  take: z.coerce
    .number()
    .int()
    .min(MIN_PAGINATION_TAKE)
    .max(MAX_PAGINATION_TAKE)
    .default(DEFAULT_PAGINATION_TAKE),
});
export type PaginatedBookmarkRequest = z.infer<
  typeof PaginatedBookmarkRequestSchema
>;

// paginated bookmarks response schema
export const PaginatedBookmarkResponseSchema = z.object({
  data: z.array(BookmarkResponseSchema),
  nextCursor: z.string().nullable(),
  hasNextPage: z.boolean(),
});
export type PaginatedBookmarkResponse = z.infer<
  typeof PaginatedBookmarkResponseSchema
>;
