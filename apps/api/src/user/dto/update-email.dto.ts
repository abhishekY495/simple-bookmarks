import { UserEmailSchema } from '@repo/schemas';
import { createZodDto } from 'nestjs-zod';

export class UserEmailDto extends createZodDto(UserEmailSchema) {}
