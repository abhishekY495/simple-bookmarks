import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterUserDto } from './dto/register-user.dto';
import { ZodResponse } from 'nestjs-zod';
import { AuthUserResponseDto } from './dto/auth-user-response.dto';
import { ApiTags } from '@nestjs/swagger';

@Controller('auth')
@ApiTags('Authentication')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/register')
  @ZodResponse({ type: AuthUserResponseDto })
  async register(@Body() registerUser: RegisterUserDto) {
    const createdUser = await this.authService.registerUser(registerUser);
    return createdUser;
  }
}
