import { Injectable } from '@nestjs/common';
import { UserResponse } from '@repo/schemas';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  createUser() {
    const user: UserResponse = {
      id: '1',
      fullName: 'John Doe',
      email: 'john.doe@example.com',
    };
    return { message: 'User created successfully', user };
  }
}
