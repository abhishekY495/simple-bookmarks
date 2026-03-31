import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { JwtModule } from '@nestjs/jwt';

@Module({
  exports: [UserService],
  imports: [PrismaModule, JwtModule],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
