import { UserResponseSchema } from '@repo/schemas';
import { createZodDto } from 'nestjs-zod';

export class UserResponseDto extends createZodDto(UserResponseSchema) {}
