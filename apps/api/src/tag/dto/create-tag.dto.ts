import { CreateTagSchema } from '@repo/schemas';
import { createZodDto } from 'nestjs-zod';

export class CreateTagDto extends createZodDto(CreateTagSchema) {}
