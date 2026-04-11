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
import { CollectionService } from './collection.service';
import { AuthGuard, type AuthenticatedRequest } from 'src/auth/auth.guard';
import { ZodResponse } from 'nestjs-zod';
import { PaginatedCollectionResponseDto } from './dto/pagianted-collection-response.dto';
import { PaginatedCollectionRequestDto } from './dto/paginated-collection-request.dto';
import { CollectionResponseDto } from './dto/collection-response.dto';
import { CreateCollectionDto } from './dto/create-collection.dto';
import { UpdateCollectionDto } from './dto/update-collection.dto';
import { SearchCollectionRequestDto } from './dto/search-collection-request.dto';
import { SearchCollectionResponseDto } from './dto/search-collection-response.dto';
import { DetailedCollectionResponseDto } from './dto/detailed-collection-response.dto';

@Controller('collection')
export class CollectionController {
  constructor(private readonly collectionService: CollectionService) {}

  @Get('all')
  @UseGuards(AuthGuard)
  @ZodResponse({ type: PaginatedCollectionResponseDto })
  async getAllCollections(
    @Req() req: AuthenticatedRequest,
    @Query() query: PaginatedCollectionRequestDto,
  ) {
    const userId = req.user.id;
    const collections = await this.collectionService.getAllCollectionsByUserId(
      userId,
      query.cursor,
      query.take,
    );
    return collections;
  }

  @Get('search')
  @UseGuards(AuthGuard)
  @ZodResponse({ type: SearchCollectionResponseDto })
  async searchCollections(
    @Req() req: AuthenticatedRequest,
    @Query() query: SearchCollectionRequestDto,
  ) {
    const userId = req.user.id;
    const collections = await this.collectionService.searchCollectionsByQuery(
      userId,
      query.query,
    );
    return collections;
  }

  @Get(':collectionId')
  @UseGuards(AuthGuard)
  @ZodResponse({ type: DetailedCollectionResponseDto })
  async getCollectionById(
    @Param('collectionId', ParseUUIDPipe) collectionId: string,
    @Req() req: AuthenticatedRequest,
  ) {
    const userId = req.user.id;
    const collection = await this.collectionService.getCollectionById(
      userId,
      collectionId,
    );
    return collection;
  }

  @Post('create')
  @UseGuards(AuthGuard)
  @ZodResponse({ type: CollectionResponseDto })
  async createCollection(
    @Req() req: AuthenticatedRequest,
    @Body() createCollectionDto: CreateCollectionDto,
  ) {
    const userId = req.user.id;
    const collection = await this.collectionService.createCollection(
      userId,
      createCollectionDto,
    );
    return collection;
  }

  @Put(':collectionId')
  @UseGuards(AuthGuard)
  @ZodResponse({ type: CollectionResponseDto })
  async updateCollectionById(
    @Param('collectionId', ParseUUIDPipe) collectionId: string,
    @Req() req: AuthenticatedRequest,
    @Body() updateCollectionDto: UpdateCollectionDto,
  ) {
    const userId = req.user.id;
    const collection = await this.collectionService.updateCollectionById(
      userId,
      collectionId,
      updateCollectionDto,
    );
    return collection;
  }

  @Delete(':collectionId')
  @UseGuards(AuthGuard)
  async deleteCollectionById(
    @Param('collectionId', ParseUUIDPipe) collectionId: string,
    @Req() req: AuthenticatedRequest,
  ) {
    const userId = req.user.id;
    await this.collectionService.deleteCollectionById(userId, collectionId);
  }

  @Get('public/:collectionId')
  @ZodResponse({ type: DetailedCollectionResponseDto })
  async getPublicCollectionById(
    @Param('collectionId', ParseUUIDPipe) collectionId: string,
  ) {
    const collection =
      await this.collectionService.getPublicCollectionById(collectionId);
    return collection;
  }
}
