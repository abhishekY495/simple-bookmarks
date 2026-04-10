import { Controller, Get, Query, Req, UseGuards } from '@nestjs/common';
import { SearchService } from './search.service';
import { type AuthenticatedRequest, AuthGuard } from 'src/auth/auth.guard';
import { ZodResponse } from 'nestjs-zod';
import { SearchRequestDto } from './dto/search-request.dto';
import { SearchResponseDto } from './dto/search-response.dto';

@Controller('search')
export class SearchController {
  constructor(private readonly searchService: SearchService) {}

  @Get()
  @UseGuards(AuthGuard)
  @ZodResponse({ type: SearchResponseDto })
  async search(
    @Req() req: AuthenticatedRequest,
    @Query() query: SearchRequestDto,
  ) {
    const userId = req.user.id;
    const bookmarksCollectionsAndTags =
      await this.searchService.searchBookmarksCollectionsAndTags(
        userId,
        query.query,
      );
    return bookmarksCollectionsAndTags;
  }
}
