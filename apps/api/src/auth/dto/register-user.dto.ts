import { RegisterUserSchema } from '@repo/schemas';
import { createZodDto } from 'nestjs-zod';

export class RegisterUserDto extends createZodDto(RegisterUserSchema) {}
