import { JwtService } from '@nestjs/jwt';
import { UserResponse } from '@repo/schemas';
import { randomBytes } from 'crypto';
import { REFRESH_TOKEN_LENGTH } from './constants';

export async function generateAuthTokens(
  user: UserResponse,
  jwtService: JwtService,
) {
  const accessToken = await jwtService.signAsync(user);
  //
  const buffer = randomBytes(REFRESH_TOKEN_LENGTH);
  const refreshToken = buffer.toString('hex');
  return { accessToken, refreshToken };
}
