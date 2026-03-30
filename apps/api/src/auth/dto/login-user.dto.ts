import { LoginUserSchema } from '@repo/schemas';
import { createZodDto } from 'nestjs-zod';

export class LoginUserDto extends createZodDto(LoginUserSchema) {}
