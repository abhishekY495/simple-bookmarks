import { PaginatedTagResponseSchema } from '@repo/schemas';
import { createZodDto } from 'nestjs-zod';

export class PaginatedTagResponseDto extends createZodDto(
  PaginatedTagResponseSchema,
) {}
