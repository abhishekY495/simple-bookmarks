import { BadRequestException, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { createZodValidationPipe, ZodSerializerInterceptor } from 'nestjs-zod';
import { ZodError } from 'zod';
import { APP_INTERCEPTOR, APP_PIPE } from '@nestjs/core';
import { BookmarkModule } from './bookmark/bookmark.module';
import { CollectionModule } from './collection/collection.module';
import { BullModule } from '@nestjs/bullmq';
import { DEFFAULT_JOB_OPTIONS } from './utils/constants';
import { TagModule } from './tag/tag.module';
import { SearchModule } from './search/search.module';

const CustomZodValidationPipe = createZodValidationPipe({
  createValidationException: (error: unknown) => {
    const firstErrorMessage =
      error instanceof ZodError
        ? (error.issues[0]?.message ?? 'Validation failed')
        : 'Validation failed';
    return new BadRequestException(firstErrorMessage);
  },
});

@Module({
  imports: [
    ConfigModule.forRoot(),
    PrismaModule,
    AuthModule,
    UserModule,
    BookmarkModule,
    CollectionModule,
    TagModule,
    SearchModule,
    BullModule.forRoot({
      connection: {
        host: process.env.REDIS_HOST,
        port: parseInt(process.env.REDIS_PORT ?? '6379'),
        password: process.env.REDIS_PASSWORD,
      },
      defaultJobOptions: {
        attempts: DEFFAULT_JOB_OPTIONS.attempts,
        removeOnComplete: DEFFAULT_JOB_OPTIONS.removeOnComplete,
        removeOnFail: DEFFAULT_JOB_OPTIONS.removeOnFail,
      },
    }),
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_PIPE,
      useClass: CustomZodValidationPipe,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: ZodSerializerInterceptor,
    },
  ],
})
export class AppModule {}
