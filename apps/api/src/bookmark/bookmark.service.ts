import type { BookmarkResponse } from '@repo/schemas';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateBookmarkDto } from './dto/create-bookmark.dto';
import { UpdateBookmarkDto } from './dto/update-bookmark.dto';

@Injectable()
export class BookmarkService {
  constructor(private readonly prisma: PrismaService) {}

  async getAllBookmarksByUserId(userId: string): Promise<BookmarkResponse[]> {
    try {
      const bookmarks = await this.prisma.bookmark.findMany({
        where: { userId },
      });
      if (!bookmarks) {
        throw new NotFoundException('Bookmarks not found');
      }
      return bookmarks.map((bookmark) => ({
        ...bookmark,
        createdAt: bookmark.createdAt.toISOString(),
      }));
    } catch (error) {
      throw new BadRequestException(
        error instanceof Error ? error.message : 'Unknown error',
      );
    }
  }

  async createBookmark(
    userId: string,
    createBookmarkDto: CreateBookmarkDto,
  ): Promise<BookmarkResponse> {
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

  async updateBookmarkById(
    userId: string,
    bookmarkId: string,
    updateBookmarkDto: UpdateBookmarkDto,
  ): Promise<BookmarkResponse> {
    try {
      const existingBookmark = await this.prisma.bookmark.findFirst({
        where: {
          id: bookmarkId,
          userId,
        },
      });

      if (!existingBookmark) {
        throw new NotFoundException('Bookmark not found');
      }

      const updatedBookmark = await this.prisma.bookmark.update({
        where: {
          id: bookmarkId,
        },
        data: updateBookmarkDto,
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
        ...updatedBookmark,
        createdAt: updatedBookmark.createdAt.toISOString(),
      };
    } catch (error) {
      throw new BadRequestException(
        error instanceof Error ? error.message : 'Unknown error',
      );
    }
  }

  async getBookmarkById(
    userId: string,
    bookmarkId: string,
  ): Promise<BookmarkResponse> {
    try {
      const bookmark = await this.prisma.bookmark.findUnique({
        where: { id: bookmarkId, userId },
      });
      if (!bookmark) {
        throw new NotFoundException('Bookmark not found');
      }
      return {
        ...bookmark,
        createdAt: bookmark.createdAt.toISOString(),
      };
    } catch (error) {
      throw new BadRequestException(
        error instanceof Error ? error.message : 'Unknown error',
      );
    }
  }
}
