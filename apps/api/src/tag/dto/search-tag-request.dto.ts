import { SearchTagsRequestSchema } from '@repo/schemas';
import { createZodDto } from 'nestjs-zod';

export class SearchTagRequestDto extends createZodDto(
  SearchTagsRequestSchema,
) {}
