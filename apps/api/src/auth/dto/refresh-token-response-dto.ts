import { RefreshTokenResponseSchema } from '@repo/schemas';
import { createZodDto } from 'nestjs-zod';

export class RefreshTokenResponseDto extends createZodDto(
  RefreshTokenResponseSchema,
) {}
