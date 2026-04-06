import type { BookmarkType } from '@repo/schemas';
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

  async getAllBookmarksByUserId(
    userId: string,
    type: BookmarkType,
    cursor?: string,
    take: number = 20,
  ) {
    try {
      const where = {
        userId,
        ...(type === 'unsorted' && { collectionId: null }),
        ...(type === 'favorites' && { isFavorite: true }),
      };

      const results = await this.prisma.bookmark.findMany({
        where,
        include: {
          tags: {
            select: {
              tag: {
                select: {
                  id: true,
                  name: true,
                },
              },
            },
          },
        },
        take: take + 1,
        ...(cursor && {
          skip: 1,
          cursor: { id: cursor },
        }),
        orderBy: { createdAt: 'desc' },
      });

      const hasNextPage = results.length > take;
      const data = hasNextPage ? results.slice(0, take) : results;
      const nextCursor = hasNextPage ? data[data.length - 1].id : null;

      return {
        data: data.map((bookmark) => ({
          ...bookmark,
          tags: bookmark.tags.map((tag) => tag.tag),
          createdAt: bookmark.createdAt.toISOString(),
        })),
        nextCursor,
        hasNextPage,
      };
    } catch (error) {
      throw new BadRequestException(
        error instanceof Error ? error.message : 'Unknown error',
      );
    }
  }

  async createBookmark(userId: string, createBookmarkDto: CreateBookmarkDto) {
    try {
      const createdBookmark = await this.prisma.bookmark.create({
        data: {
          userId,
          ...createBookmarkDto,
          title: null,
        },
        include: {
          tags: {
            select: {
              tag: {
                select: {
                  id: true,
                  name: true,
                },
              },
            },
          },
        },
      });
      return {
        ...createdBookmark,
        tags: createdBookmark.tags.map((tag) => tag.tag),
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
  ) {
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
        include: {
          tags: {
            select: {
              tag: {
                select: {
                  id: true,
                  name: true,
                },
              },
            },
          },
        },
        data: updateBookmarkDto,
      });

      return {
        ...updatedBookmark,
        createdAt: updatedBookmark.createdAt.toISOString(),
        tags: updatedBookmark.tags.map((tag) => tag.tag),
      };
    } catch (error) {
      throw new BadRequestException(
        error instanceof Error ? error.message : 'Unknown error',
      );
    }
  }

  async getBookmarkById(userId: string, bookmarkId: string) {
    try {
      const bookmark = await this.prisma.bookmark.findUnique({
        where: { id: bookmarkId, userId },
        include: {
          tags: {
            select: {
              tag: {
                select: {
                  id: true,
                  name: true,
                },
              },
            },
          },
        },
      });
      if (!bookmark) {
        throw new NotFoundException('Bookmark not found');
      }
      return {
        ...bookmark,
        createdAt: bookmark.createdAt.toISOString(),
        tags: bookmark.tags.map((tag) => tag.tag),
      };
    } catch (error) {
      throw new BadRequestException(
        error instanceof Error ? error.message : 'Unknown error',
      );
    }
  }

  async deleteBookmarkById(userId: string, bookmarkId: string) {
    try {
      const existingBookmark = await this.prisma.bookmark.findFirst({
        where: { id: bookmarkId, userId },
      });
      if (!existingBookmark) {
        throw new NotFoundException('Bookmark not found');
      }
      await this.prisma.bookmark.delete({
        where: { id: bookmarkId, userId },
      });
    } catch (error) {
      throw new BadRequestException(
        error instanceof Error ? error.message : 'Unknown error',
      );
    }
  }
}
