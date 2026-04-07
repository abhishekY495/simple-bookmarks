import { UpdateTagSchema } from '@repo/schemas';
import { createZodDto } from 'nestjs-zod';

export class UpdateTagDto extends createZodDto(UpdateTagSchema) {}
