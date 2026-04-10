import { DetailedCollectionResponseSchema } from '@repo/schemas';
import { createZodDto } from 'nestjs-zod';

export class DetailedCollectionResponseDto extends createZodDto(
  DetailedCollectionResponseSchema,
) {}
