import { Body, Controller, Get, Put, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/auth/auth.guard';
import type { AuthenticatedRequest } from 'src/auth/auth.guard';
import { UserService } from './user.service';
import { UserFullNameDto } from './dto/full-name.dto';
import { ZodResponse } from 'nestjs-zod';
import { UserResponseDto } from 'src/auth/dto/auth-user-response.dto';
import { UserEmailDto } from './dto/update-email.dto';
import { UserPasswordDto } from './dto/update-password.dto';
import { GetCountDto } from './dto/get-count.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Put('/full-name')
  @UseGuards(AuthGuard)
  @ZodResponse({ type: UserResponseDto })
  async updateFullname(
    @Req() req: AuthenticatedRequest,
    @Body() userFullNameDto: UserFullNameDto,
  ) {
    const userId = req.user.id;
    const user = await this.userService.updateFullNameById(
      userId,
      String(userFullNameDto.fullName),
    );
    return user;
  }

  @Put('/email')
  @UseGuards(AuthGuard)
  @ZodResponse({ type: UserResponseDto })
  async updateEmail(
    @Req() req: AuthenticatedRequest,
    @Body() userEmailDto: UserEmailDto,
  ) {
    const userId = req.user.id;
    const user = await this.userService.updateEmailById(
      userId,
      String(userEmailDto.email),
    );
    return user;
  }

  @Put('/password')
  @UseGuards(AuthGuard)
  @ZodResponse({ type: UserResponseDto })
  async updatePassword(
    @Req() req: AuthenticatedRequest,
    @Body() userPasswordDto: UserPasswordDto,
  ) {
    const userId = req.user.id;
    const user = await this.userService.updatePasswordById(
      userId,
      String(userPasswordDto.oldPassword),
      String(userPasswordDto.newPassword),
    );
    return user;
  }

  @Get('count')
  @UseGuards(AuthGuard)
  @ZodResponse({ type: GetCountDto })
  async getCount(@Req() req: AuthenticatedRequest) {
    const userId = req.user.id;
    const count = await this.userService.getCount(userId);
    return count;
  }
}
