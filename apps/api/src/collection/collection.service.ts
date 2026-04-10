import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateCollectionDto } from './dto/create-collection.dto';
import { UpdateCollectionDto } from './dto/update-collection.dto';

@Injectable()
export class CollectionService {
  constructor(private readonly prisma: PrismaService) {}

  async getAllCollectionsByUserId(
    userId: string,
    cursor?: string,
    take: number = 20,
  ) {
    try {
      const where = { userId };

      const results = await this.prisma.collection.findMany({
        where,
        include: {
          _count: {
            select: {
              bookmarks: true,
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
        data: data.map((collection) => {
          const { _count, ...collectionData } = collection;

          return {
            ...collectionData,
            emoji: collectionData.emoji ?? undefined,
            bookmarksCount: _count.bookmarks,
            createdAt: collection.createdAt.toISOString(),
          };
        }),
        nextCursor,
        hasNextPage,
      };
    } catch (error) {
      throw new BadRequestException(
        error instanceof Error ? error.message : 'Unknown error',
      );
    }
  }

  async getCollectionById(userId: string, collectionId: string) {
    try {
      const collection = await this.prisma.collection.findUnique({
        where: { id: collectionId, userId },
        include: {
          bookmarks: {
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
          },
        },
      });
      if (!collection) {
        throw new NotFoundException('Collection not found');
      }
      return {
        ...collection,
        emoji: collection.emoji ?? undefined,
        bookmarksCount: collection.bookmarks.length,
        createdAt: collection.createdAt.toISOString(),
        bookmarks: collection.bookmarks.map((bookmark) => ({
          ...bookmark,
          createdAt: bookmark.createdAt.toISOString(),
          collection: bookmark.collectionId
            ? {
                id: collection.id,
                name: collection.name,
              }
            : null,
          tags: bookmark.tags.map((tag) => tag.tag),
        })),
      };
    } catch (error) {
      throw new BadRequestException(
        error instanceof Error ? error.message : 'Unknown error',
      );
    }
  }

  async createCollection(
    userId: string,
    createCollectionDto: CreateCollectionDto,
  ) {
    try {
      const existingCollection = await this.prisma.collection.findFirst({
        where: { name: createCollectionDto.name, userId },
      });
      if (existingCollection) {
        throw new BadRequestException('Collection already exists');
      }
      const createdCollection = await this.prisma.collection.create({
        data: { userId, ...createCollectionDto },
      });
      return {
        ...createdCollection,
        emoji: createdCollection.emoji ?? undefined,
        bookmarksCount: 0,
        createdAt: createdCollection.createdAt.toISOString(),
      };
    } catch (error) {
      throw new BadRequestException(
        error instanceof Error ? error.message : 'Unknown error',
      );
    }
  }

  async updateCollectionById(
    userId: string,
    collectionId: string,
    updateCollectionDto: UpdateCollectionDto,
  ) {
    try {
      const existingCollection = await this.prisma.collection.findFirst({
        where: { id: collectionId, userId },
      });
      if (!existingCollection) {
        throw new NotFoundException('Collection not found');
      }

      if (existingCollection.name !== updateCollectionDto.name) {
        const existingCollectionWithSameName =
          await this.prisma.collection.findFirst({
            where: { name: updateCollectionDto.name, userId },
          });
        if (existingCollectionWithSameName) {
          throw new BadRequestException(
            'Collection with same name already exists',
          );
        }
      }

      const updatedCollection = await this.prisma.collection.update({
        where: { id: collectionId, userId },
        data: updateCollectionDto,
        include: {
          _count: {
            select: {
              bookmarks: true,
            },
          },
        },
      });
      const { _count, ...collectionData } = updatedCollection;

      return {
        ...collectionData,
        emoji: collectionData.emoji ?? undefined,
        bookmarksCount: _count.bookmarks,
        createdAt: updatedCollection.createdAt.toISOString(),
      };
    } catch (error) {
      throw new BadRequestException(
        error instanceof Error ? error.message : 'Unknown error',
      );
    }
  }

  async deleteCollectionById(userId: string, collectionId: string) {
    try {
      const existingCollection = await this.prisma.collection.findFirst({
        where: { id: collectionId, userId },
      });
      if (!existingCollection) {
        throw new NotFoundException('Collection not found');
      }
      await this.prisma.$transaction([
        this.prisma.bookmark.deleteMany({
          where: { userId, collectionId },
        }),
        this.prisma.collection.delete({
          where: { id: collectionId, userId },
        }),
      ]);
    } catch (error) {
      throw new BadRequestException(
        error instanceof Error ? error.message : 'Unknown error',
      );
    }
  }

  async searchCollectionsByQuery(userId: string, query: string) {
    try {
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
      return collections.map((collection) => {
        const { _count, ...collectionData } = collection;
        return {
          ...collectionData,
          emoji: collectionData.emoji ?? undefined,
          bookmarksCount: _count.bookmarks,
          createdAt: collection.createdAt.toISOString(),
        };
      });
    } catch (error) {
      throw new BadRequestException(
        error instanceof Error ? error.message : 'Unknown error',
      );
    }
  }
}
