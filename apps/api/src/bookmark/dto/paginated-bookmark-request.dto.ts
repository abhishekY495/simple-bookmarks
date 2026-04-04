import { createZodDto } from 'nestjs-zod';
import { PaginatedBookmarkRequestSchema } from '@repo/schemas';

export class PaginatedBookmarkRequestDto extends createZodDto(
  PaginatedBookmarkRequestSchema,
) {}
