import type { SearchResponse } from '@repo/schemas';
import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class SearchService {
  constructor(private readonly prisma: PrismaService) {}

  async searchBookmarksCollectionsAndTags(
    userId: string,
    query: string,
  ): Promise<SearchResponse> {
    try {
      const bookmarks = await this.prisma.bookmark.findMany({
        where: { userId, title: { contains: query, mode: 'insensitive' } },
        include: {
          tags: {
            select: {
              tag: {
                select: {
                  id: true,
                  name: true,
                  _count: {
                    select: {
                      bookmarks: true,
                    },
                  },
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
      const collections = await this.prisma.collection.findMany({
        where: { userId, name: { contains: query, mode: 'insensitive' } },
        include: {
          _count: {
            select: {
              bookmarks: true,
            },
          },
        },
      });
      const tags = await this.prisma.tag.findMany({
        where: { userId, name: { contains: query, mode: 'insensitive' } },
        include: {
          _count: {
            select: {
              bookmarks: true,
            },
          },
        },
      });
      return {
        bookmarks: bookmarks.map((bookmark) => ({
          id: bookmark.id,
          url: bookmark.url,
          domain: bookmark.domain,
          title: bookmark.title,
          cover: bookmark.cover,
          parsingStatus: bookmark.parsingStatus,
          isFavorite: bookmark.isFavorite,
          createdAt: bookmark.createdAt.toISOString(),
          collection: bookmark.collection
            ? {
                id: bookmark.collection.id,
                name: bookmark.collection.name,
                emoji: bookmark.collection.emoji ?? undefined,
              }
            : null,
          tags: bookmark.tags.map(({ tag }) => ({
            id: tag.id,
            name: tag.name,
            bookmarksCount: tag._count.bookmarks,
          })),
        })),
        collections: collections.map((collection) => ({
          id: collection.id,
          name: collection.name,
          isPublic: collection.isPublic,
          emoji: collection.emoji ?? undefined,
          bookmarksCount: collection._count.bookmarks,
        })),
        tags: tags.map((tag) => ({
          id: tag.id,
          name: tag.name,
          bookmarksCount: tag._count.bookmarks,
        })),
      };
    } catch (error) {
      throw new BadRequestException(
        error instanceof Error ? error.message : 'Unknown error',
      );
    }
  }
}
