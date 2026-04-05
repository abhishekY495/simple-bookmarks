import { z } from "zod";
import {
  DEFAULT_PAGINATION_TAKE,
  MAX_PAGINATION_TAKE,
  MIN_PAGINATION_TAKE,
} from "./constants";

// Collection schema
export const CollectionSchema = z.object({
  id: z.string(),
  name: z
    .string()
    .min(1, "Name is required")
    .max(100, "Name must be less than 100 characters"),
  isPublic: z.boolean().default(false),
  cover: z
    .httpUrl({
      error: "Invalid URL",
    })
    .nullable(),
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
export const UpdateCollectionSchema = CollectionSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
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
});
export type CollectionResponse = z.infer<typeof CollectionResponseSchema>;

//
//
//
//
//
// paginated collections query schema
export const PaginatedCollectionsRequestSchema = z.object({
  cursor: z.uuid().optional(),
  take: z.coerce
    .number()
    .int()
    .min(MIN_PAGINATION_TAKE)
    .max(MAX_PAGINATION_TAKE)
    .default(DEFAULT_PAGINATION_TAKE),
});
export type PaginatedCollectionsRequest = z.infer<
  typeof PaginatedCollectionsRequestSchema
>;

//
//
//
//
//
// paginated collections response schema
export const PaginatedCollectionsResponseSchema = z.object({
  data: z.array(CollectionResponseSchema),
  nextCursor: z.uuid().nullable(),
  hasNextPage: z.boolean(),
});
export type PaginatedCollectionsResponse = z.infer<
  typeof PaginatedCollectionsResponseSchema
>;
