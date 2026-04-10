import { SearchResponseSchema } from '@repo/schemas';
import { createZodDto } from 'nestjs-zod';

export class SearchResponseDto extends createZodDto(SearchResponseSchema) {}
