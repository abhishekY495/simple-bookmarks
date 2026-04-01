import {
  BadRequestException,
  ConflictException,
  Injectable,
} from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { RegisterUserDto } from './dto/register-user.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import bcrypt from 'bcrypt';
import { LoginUserDto } from './dto/login-user.dto';
import { generateAuthTokens } from './utils/generate-token';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async registerUser(registerUserDto: RegisterUserDto) {
    try {
      // check if user already exists
      const existingUser = await this.prisma.user.findUnique({
        where: { email: registerUserDto.email },
      });
      if (existingUser) {
        throw new ConflictException('Email already in use');
      }

      // hash password
      const saltRounds = Number(process.env.SALT_ROUNDS) || 10;
      const hash = await bcrypt.hash(registerUserDto.password, saltRounds);

      // create user
      const createdUser = await this.userService.createUser({
        ...registerUserDto,
        password: hash,
      });

      // generate tokens
      const { accessToken, refreshToken } = await generateAuthTokens(
        createdUser,
        this.jwtService,
      );

      // create user session
      await this.userService.createUserSession(createdUser.id, refreshToken);

      return {
        ...createdUser,
        accessToken,
        refreshToken,
      };
    } catch (error) {
      throw new BadRequestException(
        error instanceof Error ? error.message : 'Unknown error',
      );
    }
  }

  async loginUser(loginUserDto: LoginUserDto) {
    try {
      const { email, password } = loginUserDto;
      // check if user exists
      const user = await this.prisma.user.findUnique({
        where: { email },
        select: {
          id: true,
          fullName: true,
          email: true,
          password: true,
        },
      });
      if (!user) {
        throw new BadRequestException('Invalid email or password');
      }

      // compare password
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        throw new BadRequestException('Invalid email or password');
      }

      const { accessToken, refreshToken } = await generateAuthTokens(
        {
          id: user.id,
          fullName: user.fullName,
          email: user.email,
        },
        this.jwtService,
      );

      await this.userService.createUserSession(user.id, refreshToken);

      return {
        ...user,
        accessToken,
        refreshToken,
      };
    } catch (error) {
      throw new BadRequestException(
        error instanceof Error ? error.message : 'Unknown error',
      );
    }
  }
}
