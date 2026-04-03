import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import { BookmarkService } from './bookmark.service';
import { CreateBookmarkDto } from './dto/create-bookmark.dto';
import { BookmarkResponseDto } from './dto/bookmark-response.dto';
import { AuthGuard, type AuthenticatedRequest } from 'src/auth/auth.guard';
import { ZodResponse } from 'nestjs-zod';
import { UpdateBookmarkDto } from './dto/update-bookmark.dto';

@Controller('bookmark')
export class BookmarkController {
  constructor(private readonly bookmarkService: BookmarkService) {}

  @Get('all')
  @UseGuards(AuthGuard)
  @ZodResponse({ type: [BookmarkResponseDto] })
  async getAllBookmarks(@Req() req: AuthenticatedRequest) {
    const userId = req.user.id;
    const bookmarks =
      await this.bookmarkService.getAllBookmarksByUserId(userId);
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
