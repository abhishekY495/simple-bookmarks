import { SearchCollectionsRequestSchema } from '@repo/schemas';
import { createZodDto } from 'nestjs-zod';

export class SearchCollectionRequestDto extends createZodDto(
  SearchCollectionsRequestSchema,
) {}
