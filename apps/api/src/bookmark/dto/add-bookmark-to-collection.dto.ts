import { AddBookmarkToCollectionSchema } from '@repo/schemas';
import { createZodDto } from 'nestjs-zod';

export class AddBookmarkToCollectionDto extends createZodDto(
  AddBookmarkToCollectionSchema,
) {}
