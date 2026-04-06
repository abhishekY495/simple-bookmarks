import { z } from "zod";
import {
  DEFAULT_PAGINATION_TAKE,
  MAX_PAGINATION_TAKE,
  MIN_PAGINATION_TAKE,
} from "./constants";
import { TagResponseSchema } from "./tag.schema";

// Bookmark parsing status schema
export const BookmarkParsingStatus = {
  processing: "processing",
  success: "success",
  failed: "failed",
} as const;
export type BookmarkParsingStatus =
  (typeof BookmarkParsingStatus)[keyof typeof BookmarkParsingStatus];

//
//
//
//
//
// Bookmark schema
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
  cover: z
    .httpUrl({
      error: "Invalid URL",
    })
    .nullable(),
  parsingStatus: z
    .enum(BookmarkParsingStatus, {
      error: "Invalid parsing status",
    })
    .default(BookmarkParsingStatus.processing),
  isFavorite: z.boolean().default(false),
  collectionId: z.uuid().optional().nullable(),
  createdAt: z.iso.datetime(),
  updatedAt: z.iso.datetime(),
});
export type Bookmark = z.infer<typeof BookmarkSchema>;

//
//
//
//
//
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

//
//
//
//
//
// update bookmark schema
export const UpdateBookmarkSchema = z
  .object({
    title: z.string().nullable().optional(),
    cover: z
      .httpUrl({
        error: "Invalid URL",
      })
      .nullable()
      .optional(),
    parsingStatus: z.enum(BookmarkParsingStatus).optional(),
    isFavorite: z.boolean().optional(),
    collectionId: z.uuid().optional().nullable(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message:
      "At least one field (title, cover, parsingStatus, isFavorite, collectionId) is required",
  });
export type UpdateBookmark = z.infer<typeof UpdateBookmarkSchema>;

//
//
//
//
//
// bookmark response schema
export const BookmarkResponseSchema = BookmarkSchema.omit({
  userId: true,
  updatedAt: true,
}).extend({
  tags: z.array(TagResponseSchema).default([]),
});
export type BookmarkResponse = z.infer<typeof BookmarkResponseSchema>;

//
//
//
//
//
// type schema
export const BookmarkType = {
  all: "all",
  favorites: "favorites",
  unsorted: "unsorted",
} as const;
export type BookmarkType = (typeof BookmarkType)[keyof typeof BookmarkType];

// paginated bookmarks query schema
export const PaginatedBookmarkRequestSchema = z.object({
  cursor: z.uuid().optional(),
  take: z.coerce
    .number()
    .int()
    .min(MIN_PAGINATION_TAKE)
    .max(MAX_PAGINATION_TAKE)
    .default(DEFAULT_PAGINATION_TAKE),
  type: z
    .string({ error: "Type is required" })
    .refine(
      (value): value is BookmarkType =>
        Object.values(BookmarkType).includes(value as BookmarkType),
      {
        message: "Type must be - all, favorites or unsorted",
      },
    ),
});
export type PaginatedBookmarkRequest = z.infer<
  typeof PaginatedBookmarkRequestSchema
>;

//
//
//
//
//
// paginated bookmarks response schema
export const PaginatedBookmarkResponseSchema = z.object({
  data: z.array(BookmarkResponseSchema),
  nextCursor: z.string().nullable(),
  hasNextPage: z.boolean(),
});
export type PaginatedBookmarkResponse = z.infer<
  typeof PaginatedBookmarkResponseSchema
>;

//
//
//
//
//
// add bookmark to collection schema
export const AddBookmarkToCollectionSchema = z.object({
  collectionId: z.uuid({ error: "Collection ID is required" }),
});
export type AddBookmarkToCollection = z.infer<
  typeof AddBookmarkToCollectionSchema
>;
