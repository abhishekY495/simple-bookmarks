import { SearchTagsResponseSchema } from '@repo/schemas';
import { createZodDto } from 'nestjs-zod';

export class SearchTagResponseDto extends createZodDto(
  SearchTagsResponseSchema,
) {}
