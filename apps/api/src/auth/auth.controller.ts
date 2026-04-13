import {
  BadRequestException,
  Body,
  Controller,
  Post,
  Req,
  Res,
} from '@nestjs/common';
import type { Response, Request } from 'express';
import { AuthService } from './auth.service';
import { RegisterUserDto } from './dto/register-user.dto';
import { ZodResponse } from 'nestjs-zod';
import { UserResponseDto } from './dto/auth-user-response.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { RefreshTokenResponseDto } from './dto/refresh-token-response.dto';
import {
  REFRESH_TOKEN_COOKIE_NAME,
  REFRESH_TOKEN_EXPIRES_IN,
} from './utils/constants';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  private setRefreshTokenCookie(res: Response, refreshToken: string) {
    const isProduction = process.env.IS_DEV === 'false';
    res.cookie(REFRESH_TOKEN_COOKIE_NAME, refreshToken, {
      httpOnly: true,
      secure: isProduction,
      sameSite: 'none',
      maxAge: REFRESH_TOKEN_EXPIRES_IN,
      path: '/',
    });
  }

  @Post('/register')
  @ZodResponse({ type: UserResponseDto })
  async register(
    @Body() RegisterUserDto: RegisterUserDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { refreshToken, ...createdUser } =
      await this.authService.registerUser(RegisterUserDto);
    this.setRefreshTokenCookie(res, refreshToken);
    return createdUser;
  }

  @Post('/login')
  @ZodResponse({ type: UserResponseDto })
  async login(
    @Body() loginUser: LoginUserDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { refreshToken, ...user } =
      await this.authService.loginUser(loginUser);
    if (refreshToken) {
      this.setRefreshTokenCookie(res, refreshToken);
    }
    return user;
  }

  @Post('/refresh-token')
  @ZodResponse({ type: RefreshTokenResponseDto })
  async refreshToken(
    @Req() req: Request & { cookies: { [REFRESH_TOKEN_COOKIE_NAME]: string } },
  ) {
    const refreshToken = req.cookies[REFRESH_TOKEN_COOKIE_NAME];
    if (!refreshToken) {
      throw new BadRequestException('Refresh token is required');
    }
    const accessToken = await this.authService.refreshToken(refreshToken);
    return accessToken;
  }

  @Post('/logout')
  async logout(
    @Req() req: Request & { cookies: { [REFRESH_TOKEN_COOKIE_NAME]: string } },
    @Res({ passthrough: true }) res: Response,
  ) {
    const refreshToken = req.cookies[REFRESH_TOKEN_COOKIE_NAME];
    if (!refreshToken) {
      throw new BadRequestException('Refresh token is required');
    }
    this.setRefreshTokenCookie(res, '');
    await this.authService.logoutUser(refreshToken);
  }
}
