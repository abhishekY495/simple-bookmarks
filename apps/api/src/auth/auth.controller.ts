import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterUserDto } from './dto/register-user.dto';
import { ZodResponse } from 'nestjs-zod';
import { AuthUserResponseDto } from './dto/auth-user-response.dto';
import { LoginUserDto } from './dto/login-user.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/register')
  @ZodResponse({ type: AuthUserResponseDto })
  async register(@Body() RegisterUserDto: RegisterUserDto) {
    const createdUser = await this.authService.registerUser(RegisterUserDto);
    return createdUser;
  }

  @Post('/login')
  @ZodResponse({ type: AuthUserResponseDto })
  async login(@Body() loginUser: LoginUserDto) {
    const user = await this.authService.loginUser(loginUser);
    return user;
  }
}
