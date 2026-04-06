import { UpdateCollectionSchema } from '@repo/schemas';
import { createZodDto } from 'nestjs-zod';

export class UpdateCollectionDto extends createZodDto(UpdateCollectionSchema) {}
