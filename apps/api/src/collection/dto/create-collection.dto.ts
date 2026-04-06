import { CreateCollectionSchema } from '@repo/schemas';
import { createZodDto } from 'nestjs-zod';

export class CreateCollectionDto extends createZodDto(CreateCollectionSchema) {}
