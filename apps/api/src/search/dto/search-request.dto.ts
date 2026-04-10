import { SearchRequestSchema } from '@repo/schemas';
import { createZodDto } from 'nestjs-zod';

export class SearchRequestDto extends createZodDto(SearchRequestSchema) {}
