import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateBookmarkDto } from './dto/create-bookmark.dto';

@Injectable()
export class BookmarkService {
  constructor(private readonly prisma: PrismaService) {}

  async createBookmark(userId: string, createBookmarkDto: CreateBookmarkDto) {
    try {
      const createdBookmark = await this.prisma.bookmark.create({
        data: {
          userId,
          ...createBookmarkDto,
          title: null,
        },
        select: {
          id: true,
          url: true,
          domain: true,
          title: true,
          cover: true,
          parsingStatus: true,
          isFavorite: true,
          createdAt: true,
        },
      });
      return {
        ...createdBookmark,
        createdAt: createdBookmark.createdAt.toISOString(),
      };
    } catch (error) {
      console.error(123123, error);
      throw new BadRequestException(
        error instanceof Error ? error.message : 'Unknown error',
      );
    }
  }
}
