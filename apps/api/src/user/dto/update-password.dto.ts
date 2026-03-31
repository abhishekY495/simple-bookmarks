import { UpdateUserPasswordSchema } from '@repo/schemas';
import { createZodDto } from 'nestjs-zod';

export class UpdateUserPasswordDto extends createZodDto(
  UpdateUserPasswordSchema,
) {}
