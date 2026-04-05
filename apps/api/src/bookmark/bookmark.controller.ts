import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  Put,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { BookmarkService } from './bookmark.service';
import { CreateBookmarkDto } from './dto/create-bookmark.dto';
import { BookmarkResponseDto } from './dto/bookmark-response.dto';
import { PaginatedBookmarkRequestDto } from './dto/paginated-bookmark-request.dto';
import { AuthGuard, type AuthenticatedRequest } from 'src/auth/auth.guard';
import { ZodResponse } from 'nestjs-zod';
import { UpdateBookmarkDto } from './dto/update-bookmark.dto';
import { PaginatedBookmarkResponseDto } from './dto/paginated-bookmark-response.dto';

@Controller('bookmark')
export class BookmarkController {
  constructor(private readonly bookmarkService: BookmarkService) {}

  @Get('all')
  @UseGuards(AuthGuard)
  @ZodResponse({ type: PaginatedBookmarkResponseDto })
  async getAllBookmarks(
    @Req() req: AuthenticatedRequest,
    @Query() query: PaginatedBookmarkRequestDto,
  ) {
    const userId = req.user.id;
    const bookmarks = await this.bookmarkService.getAllBookmarksByUserId(
      userId,
      query.type,
      query.cursor,
      query.take,
    );
    return bookmarks;
  }

  @Get(':bookmarkId')
  @UseGuards(AuthGuard)
  @ZodResponse({ type: BookmarkResponseDto })
  async getBookmarkById(
    @Param('bookmarkId', ParseUUIDPipe) bookmarkId: string,
    @Req() req: AuthenticatedRequest,
  ) {
    const userId = req.user.id;
    const bookmark = await this.bookmarkService.getBookmarkById(
      userId,
      bookmarkId,
    );
    return bookmark;
  }

  @Post('create')
  @UseGuards(AuthGuard)
  @ZodResponse({ type: BookmarkResponseDto })
  async createBookmark(
    @Req() req: AuthenticatedRequest,
    @Body() createBookmarkDto: CreateBookmarkDto,
  ) {
    const userId = req.user.id;
    const bookmark = await this.bookmarkService.createBookmark(
      userId,
      createBookmarkDto,
    );
    return bookmark;
  }

  @Put(':bookmarkId')
  @UseGuards(AuthGuard)
  @ZodResponse({ type: BookmarkResponseDto })
  async updateBookmarkById(
    @Param('bookmarkId', ParseUUIDPipe) bookmarkId: string,
    @Req() req: AuthenticatedRequest,
    @Body() updateBookmarkDto: UpdateBookmarkDto,
  ) {
    const userId = req.user.id;
    const bookmark = await this.bookmarkService.updateBookmarkById(
      userId,
      bookmarkId,
      updateBookmarkDto,
    );
    return bookmark;
  }
}
