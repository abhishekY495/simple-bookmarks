import { TagResponseSchema } from '@repo/schemas';
import { createZodDto } from 'nestjs-zod';

export class TagResponseDto extends createZodDto(TagResponseSchema) {}
