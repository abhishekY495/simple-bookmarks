import { CountSchema } from '@repo/schemas';
import { createZodDto } from 'nestjs-zod';

export class GetCountDto extends createZodDto(CountSchema) {}
