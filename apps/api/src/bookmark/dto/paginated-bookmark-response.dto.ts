import { PaginatedBookmarkResponseSchema } from '@repo/schemas';
import { createZodDto } from 'nestjs-zod';

export class PaginatedBookmarkResponseDto extends createZodDto(
  PaginatedBookmarkResponseSchema,
) {}
