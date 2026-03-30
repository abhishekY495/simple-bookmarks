import { AuthUserResponseSchema } from '@repo/schemas';
import { createZodDto } from 'nestjs-zod';

export class AuthUserResponseDto extends createZodDto(AuthUserResponseSchema) {}
