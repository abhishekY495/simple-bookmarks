import { SearchCollectionsResponseSchema } from '@repo/schemas';
import { createZodDto } from 'nestjs-zod';

export class SearchCollectionResponseDto extends createZodDto(
  SearchCollectionsResponseSchema,
) {}
