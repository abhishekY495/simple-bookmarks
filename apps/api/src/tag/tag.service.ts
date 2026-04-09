import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateTagDto } from './dto/create-tag.dto';
import { UpdateTagDto } from './dto/update-tag.dto';

@Injectable()
export class TagService {
  constructor(private readonly prisma: PrismaService) {}

  async getAllTagsByUserId(userId: string, cursor?: string, take: number = 20) {
    try {
      const where = { userId };

      const results = await this.prisma.tag.findMany({
        where,
        include: {
          _count: {
            select: {
              bookmarks: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
        take: take + 1,
        ...(cursor && {
          skip: 1,
          cursor: { id: cursor },
        }),
      });

      const hasNextPage = results.length > take;
      const data = hasNextPage ? results.slice(0, take) : results;
      const nextCursor = hasNextPage ? data[data.length - 1].id : null;

      return {
        data: data.map((tag) => ({
          ...tag,
          bookmarksCount: tag._count.bookmarks,
          createdAt: tag.createdAt.toISOString(),
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

  async getTagById(userId: string, tagId: string) {
    try {
      const tag = await this.prisma.tag.findUnique({
        where: { id: tagId, userId },
        include: {
          bookmarks: {
            select: {
              bookmark: {
                select: {
                  id: true,
                  url: true,
                  domain: true,
                  title: true,
                  cover: true,
                  parsingStatus: true,
                  isFavorite: true,
                  createdAt: true,
                  collection: {
                    select: {
                      id: true,
                      name: true,
                    },
                  },
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
          },
        },
      });
      if (!tag) {
        throw new NotFoundException('Tag not found');
      }
      const bookmarks = tag.bookmarks.map(({ bookmark }) => ({
        ...bookmark,
        createdAt: bookmark.createdAt.toISOString(),
        tags: bookmark.tags.map(({ tag }) => tag),
      }));

      return {
        id: tag.id,
        name: tag.name,
        bookmarksCount: bookmarks.length,
        bookmarks,
      };
    } catch (error) {
      throw new BadRequestException(
        error instanceof Error ? error.message : 'Unknown error',
      );
    }
  }

  async createTag(userId: string, createTagDto: CreateTagDto) {
    try {
      const existingTag = await this.prisma.tag.findFirst({
        where: { name: createTagDto.name, userId },
      });
      if (existingTag) {
        throw new BadRequestException('Tag already exists');
      }
      const createdTag = await this.prisma.tag.create({
        data: { ...createTagDto, userId },
      });
      return {
        ...createdTag,
        createdAt: createdTag.createdAt.toISOString(),
      };
    } catch (error) {
      throw new BadRequestException(
        error instanceof Error ? error.message : 'Unknown error',
      );
    }
  }

  async updateTagById(
    userId: string,
    tagId: string,
    updateTagDto: UpdateTagDto,
  ) {
    try {
      const existingTag = await this.prisma.tag.findFirst({
        where: { id: tagId, userId },
      });
      if (!existingTag) {
        throw new NotFoundException('Tag not found');
      }
      if (existingTag.name !== updateTagDto.name) {
        const existingTagWithSameName = await this.prisma.tag.findFirst({
          where: { name: updateTagDto.name, userId },
        });
        if (existingTagWithSameName) {
          throw new BadRequestException('Tag with same name already exists');
        }
      }
      const updatedTag = await this.prisma.tag.update({
        where: { id: tagId, userId },
        data: updateTagDto,
      });
      return {
        ...updatedTag,
        createdAt: updatedTag.createdAt.toISOString(),
      };
    } catch (error) {
      throw new BadRequestException(
        error instanceof Error ? error.message : 'Unknown error',
      );
    }
  }

  async deleteTagById(userId: string, tagId: string) {
    try {
      const existingTag = await this.prisma.tag.findFirst({
        where: { id: tagId, userId },
      });
      if (!existingTag) {
        throw new NotFoundException('Tag not found');
      }
      await this.prisma.tag.delete({
        where: { id: tagId, userId },
      });
    } catch (error) {
      throw new BadRequestException(
        error instanceof Error ? error.message : 'Unknown error',
      );
    }
  }

  async searchTagsByQuery(userId: string, query: string) {
    try {
      const tags = await this.prisma.tag.findMany({
        where: { userId, name: { contains: query, mode: 'insensitive' } },
      });
      return tags.map((tag) => ({
        id: tag.id,
        name: tag.name,
        createdAt: tag.createdAt.toISOString(),
      }));
    } catch (error) {
      throw new BadRequestException(
        error instanceof Error ? error.message : 'Unknown error',
      );
    }
  }
}
