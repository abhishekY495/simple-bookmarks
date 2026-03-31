import { UpdateUserEmailSchema } from '@repo/schemas';
import { createZodDto } from 'nestjs-zod';

export class UpdateUserEmailDto extends createZodDto(UpdateUserEmailSchema) {}
