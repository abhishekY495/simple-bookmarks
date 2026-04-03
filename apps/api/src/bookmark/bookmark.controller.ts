import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { BookmarkService } from './bookmark.service';
import { CreateBookmarkDto } from './dto/create-bookmark.dto';
import { BookmarkResponseDto } from './dto/bookmark-response.dto';
import { AuthGuard, type AuthenticatedRequest } from 'src/auth/auth.guard';
import { ZodResponse } from 'nestjs-zod';

@Controller('bookmark')
export class BookmarkController {
  constructor(private readonly bookmarkService: BookmarkService) {}

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
}
