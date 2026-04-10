import type { BookmarkType } from '@repo/schemas';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateBookmarkDto } from './dto/create-bookmark.dto';
import { UpdateBookmarkDto } from './dto/update-bookmark.dto';
import { AddBookmarkToCollectionDto } from './dto/add-bookmark-to-collection.dto';

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
          collection: {
            select: {
              id: true,
              name: true,
              emoji: true,
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
          collection: {
            select: {
              id: true,
              name: true,
              emoji: true,
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

      const { tagIds, ...bookmarkUpdateData } = updateBookmarkDto;
      const uniqueTagIds = tagIds ? [...new Set(tagIds)] : undefined;

      if (uniqueTagIds) {
        const tags = await this.prisma.tag.findMany({
          where: {
            userId,
            id: {
              in: uniqueTagIds,
            },
          },
          select: {
            id: true,
          },
        });

        if (tags.length !== uniqueTagIds.length) {
          throw new BadRequestException(
            'One or more selected tags are invalid',
          );
        }
      }

      const updatedBookmark = await this.prisma.$transaction(async (tx) => {
        if (uniqueTagIds) {
          await tx.bookmarkTag.deleteMany({
            where: {
              bookmarkId,
            },
          });

          if (uniqueTagIds.length > 0) {
            await tx.bookmarkTag.createMany({
              data: uniqueTagIds.map((tagId) => ({
                bookmarkId,
                tagId,
              })),
            });
          }
        }

        return tx.bookmark.update({
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
            collection: {
              select: {
                id: true,
                name: true,
                emoji: true,
              },
            },
          },
          data: bookmarkUpdateData,
        });
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
          collection: {
            select: {
              id: true,
              name: true,
              emoji: true,
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

  async addBookmarkToCollection(
    userId: string,
    bookmarkId: string,
    addBookmarkToCollectionDto: AddBookmarkToCollectionDto,
  ) {
    try {
      const existingBookmark = await this.prisma.bookmark.findFirst({
        where: { id: bookmarkId, userId },
      });
      if (!existingBookmark) {
        throw new NotFoundException('Bookmark not found');
      }

      const existingCollection = await this.prisma.collection.findFirst({
        where: { id: addBookmarkToCollectionDto.collectionId, userId },
      });
      if (!existingCollection) {
        throw new NotFoundException('Collection not found');
      }

      if (
        existingBookmark.collectionId ===
        addBookmarkToCollectionDto.collectionId
      ) {
        throw new BadRequestException('Bookmark already in collection');
      }

      const updatedBookmark = await this.prisma.bookmark.update({
        where: { id: bookmarkId, userId },
        data: {
          collectionId: addBookmarkToCollectionDto.collectionId,
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
          collection: {
            select: {
              id: true,
              name: true,
              emoji: true,
            },
          },
        },
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

  async removeBookmarkFromCollection(userId: string, bookmarkId: string) {
    try {
      const existingBookmark = await this.prisma.bookmark.findFirst({
        where: { id: bookmarkId, userId },
      });
      if (!existingBookmark) {
        throw new NotFoundException('Bookmark not found');
      }
      await this.prisma.bookmark.update({
        where: { id: bookmarkId, userId },
        data: { collectionId: null },
      });
      return {
        ...existingBookmark,
        createdAt: existingBookmark.createdAt.toISOString(),
      };
    } catch (error) {
      throw new BadRequestException(
        error instanceof Error ? error.message : 'Unknown error',
      );
    }
  }
}
