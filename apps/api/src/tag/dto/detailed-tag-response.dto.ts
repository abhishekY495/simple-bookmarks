import { DetailedTagResponseSchema } from '@repo/schemas';
import { createZodDto } from 'nestjs-zod';

export class DetailedTagResponseDto extends createZodDto(
  DetailedTagResponseSchema,
) {}
