import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  Put,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { TagService } from './tag.service';
import { type AuthenticatedRequest, AuthGuard } from 'src/auth/auth.guard';
import { ZodResponse } from 'nestjs-zod';
import { PaginatedTagResponseDto } from './dto/paginated-tag-response.dto';
import { PaginatedTagRequestDto } from './dto/paginated-tag-request.dto';
import { TagResponseDto } from './dto/tag-response.dto';
import { CreateTagDto } from './dto/create-tag.dto';
import { UpdateTagDto } from './dto/update-tag.dto';

@Controller('tag')
export class TagController {
  constructor(private readonly tagService: TagService) {}

  @Get('all')
  @UseGuards(AuthGuard)
  @ZodResponse({ type: PaginatedTagResponseDto })
  async getAllTags(
    @Req() req: AuthenticatedRequest,
    @Query() query: PaginatedTagRequestDto,
  ) {
    const userId = req.user.id;
    const tags = await this.tagService.getAllTagsByUserId(
      userId,
      query.cursor,
      query.take,
    );
    return tags;
  }

  @Get(':tagId')
  @UseGuards(AuthGuard)
  @ZodResponse({ type: TagResponseDto })
  async getTagById(
    @Param('tagId', ParseUUIDPipe) tagId: string,
    @Req() req: AuthenticatedRequest,
  ) {
    const userId = req.user.id;
    const tag = await this.tagService.getTagById(userId, tagId);
    return tag;
  }

  @Post('create')
  @UseGuards(AuthGuard)
  @ZodResponse({ type: TagResponseDto })
  async createTag(
    @Req() req: AuthenticatedRequest,
    @Body() createTagDto: CreateTagDto,
  ) {
    const userId = req.user.id;
    const tag = await this.tagService.createTag(userId, createTagDto);
    return tag;
  }

  @Put(':tagId')
  @UseGuards(AuthGuard)
  @ZodResponse({ type: TagResponseDto })
  async updateTagById(
    @Param('tagId', ParseUUIDPipe) tagId: string,
    @Req() req: AuthenticatedRequest,
    @Body() updateTagDto: UpdateTagDto,
  ) {
    const userId = req.user.id;
    const tag = await this.tagService.updateTagById(
      userId,
      tagId,
      updateTagDto,
    );
    return tag;
  }

  @Delete(':tagId')
  @UseGuards(AuthGuard)
  async deleteTagById(
    @Param('tagId', ParseUUIDPipe) tagId: string,
    @Req() req: AuthenticatedRequest,
  ) {
    const userId = req.user.id;
    await this.tagService.deleteTagById(userId, tagId);
  }
}
