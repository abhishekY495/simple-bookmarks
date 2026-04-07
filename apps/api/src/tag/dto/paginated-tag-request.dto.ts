import { PaginatedTagRequestSchema } from '@repo/schemas';
import { createZodDto } from 'nestjs-zod';

export class PaginatedTagRequestDto extends createZodDto(
  PaginatedTagRequestSchema,
) {}
