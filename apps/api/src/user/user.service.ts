import { BadRequestException, Injectable } from '@nestjs/common';
import { RegisterUserDto } from 'src/auth/dto/register-user.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async createUser(registerUserDto: RegisterUserDto) {
    try {
      const createdUser = await this.prisma.user.create({
        data: registerUserDto,
        select: {
          id: true,
          fullName: true,
          email: true,
        },
      });
      return createdUser;
    } catch (error) {
      throw new BadRequestException(
        error instanceof Error ? error.message : 'Unknown error',
      );
    }
  }
}
