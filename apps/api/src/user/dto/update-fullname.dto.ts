import { UpdateUserFullNameSchema } from '@repo/schemas';
import { createZodDto } from 'nestjs-zod';

export class UpdateUserFullNameDto extends createZodDto(
  UpdateUserFullNameSchema,
) {}
