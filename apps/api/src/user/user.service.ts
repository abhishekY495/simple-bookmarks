import { BadRequestException, Injectable } from '@nestjs/common';
import { RegisterUserDto } from 'src/auth/dto/register-user.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import bcrypt from 'bcrypt';

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

  async updateFullNameById(id: string, fullName: string) {
    try {
      const user = await this.prisma.user.update({
        where: { id },
        data: { fullName },
        select: {
          id: true,
          fullName: true,
          email: true,
        },
      });
      return user;
    } catch (error) {
      throw new BadRequestException(
        error instanceof Error ? error.message : 'Unknown error',
      );
    }
  }

  async updateEmailById(id: string, email: string) {
    try {
      const user = await this.prisma.user.update({
        where: { id },
        data: { email },
        select: {
          id: true,
          fullName: true,
          email: true,
        },
      });
      return user;
    } catch (error) {
      throw new BadRequestException(
        error instanceof Error ? error.message : 'Unknown error',
      );
    }
  }

  async updatePasswordById(
    id: string,
    oldPassword: string,
    newPassword: string,
  ) {
    try {
      const user = await this.prisma.user.findUnique({
        where: { id },
        select: {
          id: true,
          password: true,
          fullName: true,
          email: true,
        },
      });

      if (!user) {
        throw new BadRequestException('User not found');
      }

      // compare old password
      const isMatch = await bcrypt.compare(oldPassword, user.password);
      if (!isMatch) {
        throw new BadRequestException('Old password is incorrect');
      }

      // hash password
      const saltRounds = Number(process.env.SALT_ROUNDS) || 10;
      const passwordHash = await bcrypt.hash(newPassword, saltRounds);

      const updatedUser = await this.prisma.user.update({
        where: { id },
        data: { password: passwordHash },
        select: {
          id: true,
          fullName: true,
          email: true,
        },
      });
      return updatedUser;
    } catch (error) {
      throw new BadRequestException(
        error instanceof Error ? error.message : 'Unknown error',
      );
    }
  }
}
