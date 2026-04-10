import { z } from "zod";
import {
  DEFAULT_PAGINATION_TAKE,
  MAX_PAGINATION_TAKE,
  MIN_PAGINATION_TAKE,
} from "./constants";
import { BookmarkResponseSchema } from "./bookmark.schema";

// Collection schema
export const CollectionSchema = z.object({
  id: z.string(),
  name: z
    .string({ error: "Name is required" })
    .min(1, "Name is required")
    .max(100, "Name must be less than 100 characters"),
  isPublic: z.boolean().default(false),
  cover: z
    .httpUrl({
      error: "Invalid URL",
    })
    .nullable()
    .optional(),
  createdAt: z.iso.datetime(),
  updatedAt: z.iso.datetime(),
});
export type Collection = z.infer<typeof CollectionSchema>;

//
//
//
//
//
// create collection schema
export const CreateCollectionSchema = CollectionSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});
export type CreateCollection = z.infer<typeof CreateCollectionSchema>;

//
//
//
//
//
// update collection schema
export const UpdateCollectionSchema = z
  .object({
    name: z
      .string()
      .min(1, "Name is required")
      .max(100, "Name must be less than 100 characters")
      .optional(),
    cover: z
      .httpUrl({
        error: "Invalid URL",
      })
      .nullable()
      .optional(),
    isPublic: z.boolean().optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: "At least one field (name, cover, isPublic) is required",
  });
export type UpdateCollection = z.infer<typeof UpdateCollectionSchema>;

//
//
//
//
//
// collection response schema
export const CollectionResponseSchema = CollectionSchema.omit({
  createdAt: true,
  updatedAt: true,
}).extend({
  bookmarksCount: z.number().default(0),
  bookmarks: z
    .array(BookmarkResponseSchema.omit({ collection: true }))
    .optional(),
});
export type CollectionResponse = z.infer<typeof CollectionResponseSchema>;

//
//
//
//
//
// detailed collection response schema
export const DetailedCollectionResponseSchema = CollectionSchema.omit({
  createdAt: true,
  updatedAt: true,
}).extend({
  bookmarksCount: z.number().default(0),
  bookmarks: z.array(BookmarkResponseSchema).optional(),
});
export type DetailedCollectionResponse = z.infer<
  typeof DetailedCollectionResponseSchema
>;

//
//
//
//
//
// paginated collections query schema
export const PaginatedCollectionRequestSchema = z.object({
  cursor: z.uuid().optional(),
  take: z.coerce
    .number()
    .int()
    .min(MIN_PAGINATION_TAKE)
    .max(MAX_PAGINATION_TAKE)
    .default(DEFAULT_PAGINATION_TAKE),
});
export type PaginatedCollectionRequest = z.infer<
  typeof PaginatedCollectionRequestSchema
>;

//
//
//
//
//
// paginated collections response schema
export const PaginatedCollectionResponseSchema = z.object({
  data: z.array(CollectionResponseSchema),
  nextCursor: z.uuid().nullable(),
  hasNextPage: z.boolean(),
});
export type PaginatedCollectionResponse = z.infer<
  typeof PaginatedCollectionResponseSchema
>;

//
//
//
//
//
// search collections query schema
export const SearchCollectionsRequestSchema = z.object({
  query: z.string().min(1, "Query is required"),
});
export type SearchCollectionsRequest = z.infer<
  typeof SearchCollectionsRequestSchema
>;

//
//
//
//
//
// search collections response schema
export const SearchCollectionsResponseSchema = z.array(
  CollectionResponseSchema,
);
export type SearchCollectionsResponse = z.infer<
  typeof SearchCollectionsResponseSchema
>;
