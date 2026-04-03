import { UpdateBookmarkSchema } from '@repo/schemas';
import { createZodDto } from 'nestjs-zod';

export class UpdateBookmarkDto extends createZodDto(UpdateBookmarkSchema) {}
