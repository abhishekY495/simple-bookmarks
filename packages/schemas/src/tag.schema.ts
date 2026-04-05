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
    .string()
    .min(1, "Name is required")
    .max(100, "Name must be less than 100 characters"),
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
});
export type TagResponse = z.infer<typeof TagResponseSchema>;

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
