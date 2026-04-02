import { UserFullNameSchema } from '@repo/schemas';
import { createZodDto } from 'nestjs-zod';

export class UserFullNameDto extends createZodDto(UserFullNameSchema) {}
