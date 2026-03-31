import { Body, Controller, Put, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/auth/auth.guard';
import type { AuthenticatedRequest } from 'src/auth/auth.guard';
import { UserService } from './user.service';
import { UpdateUserFullNameDto } from './dto/update-fullname.dto';
import { ZodResponse } from 'nestjs-zod';
import { UserResponseDto } from 'src/auth/dto/auth-user-response.dto';
import { UpdateUserEmailDto } from './dto/update-email.dto';
import { UpdateUserPasswordDto } from './dto/update-password.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Put('/full-name')
  @UseGuards(AuthGuard)
  @ZodResponse({ type: UserResponseDto })
  async updateFullname(
    @Req() req: AuthenticatedRequest,
    @Body() updateUserFullname: UpdateUserFullNameDto,
  ) {
    const userId = req.user.id;
    const user = await this.userService.updateFullNameById(
      userId,
      String(updateUserFullname.fullName),
    );
    return user;
  }

  @Put('/email')
  @UseGuards(AuthGuard)
  @ZodResponse({ type: UserResponseDto })
  async updateEmail(
    @Req() req: AuthenticatedRequest,
    @Body() updateUserEmail: UpdateUserEmailDto,
  ) {
    const userId = req.user.id;
    const user = await this.userService.updateEmailById(
      userId,
      String(updateUserEmail.email),
    );
    return user;
  }

  @Put('/password')
  @UseGuards(AuthGuard)
  @ZodResponse({ type: UserResponseDto })
  async updatePassword(
    @Req() req: AuthenticatedRequest,
    @Body() UpdateUserPasswordDto: UpdateUserPasswordDto,
  ) {
    const userId = req.user.id;
    const user = await this.userService.updatePasswordById(
      userId,
      String(UpdateUserPasswordDto.oldPassword),
      String(UpdateUserPasswordDto.newPassword),
    );
    return user;
  }
}
