import { UserPasswordSchema } from '@repo/schemas';
import { createZodDto } from 'nestjs-zod';

export class UserPasswordDto extends createZodDto(UserPasswordSchema) {}
