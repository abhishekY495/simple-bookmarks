import { CreateBookmarkSchema } from '@repo/schemas';
import { createZodDto } from 'nestjs-zod';

export class CreateBookmarkDto extends createZodDto(CreateBookmarkSchema) {}
