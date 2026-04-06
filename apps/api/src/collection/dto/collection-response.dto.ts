import { CollectionResponseSchema } from '@repo/schemas';
import { createZodDto } from 'nestjs-zod';

export class CollectionResponseDto extends createZodDto(
  CollectionResponseSchema,
) {}
