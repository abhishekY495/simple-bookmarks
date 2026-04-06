import { PaginatedCollectionRequestSchema } from '@repo/schemas';
import { createZodDto } from 'nestjs-zod';

export class PaginatedCollectionRequestDto extends createZodDto(
  PaginatedCollectionRequestSchema,
) {}
