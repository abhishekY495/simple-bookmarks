import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHealth(): {
    message: string;
    statusCode: number;
  } {
    return { message: 'API is running', statusCode: 200 };
  }
}
