import { Module } from '@nestjs/common';
import { BookmarkController } from './bookmark.controller';
import { BookmarkService } from './bookmark.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { JwtModule } from '@nestjs/jwt';
import { BullModule } from '@nestjs/bullmq';
import { BOOKMARK_PARSING_QUEUE_NAME } from 'src/utils/constants';
import { BookmarkWorker } from './bookmark.worker';

@Module({
  imports: [
    PrismaModule,
    JwtModule,
    BullModule.registerQueue({
      name: BOOKMARK_PARSING_QUEUE_NAME,
    }),
  ],
  controllers: [BookmarkController],
  providers: [BookmarkService, BookmarkWorker],
})
export class BookmarkModule {}
