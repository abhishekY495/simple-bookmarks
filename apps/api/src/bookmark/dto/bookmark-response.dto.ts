import { BookmarkResponseSchema } from '@repo/schemas';
import { createZodDto } from 'nestjs-zod';

export class BookmarkResponseDto extends createZodDto(BookmarkResponseSchema) {}
