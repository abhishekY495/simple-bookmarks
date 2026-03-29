import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello() {
    return 'Hello World!';
  }

  getHealth() {
    return { message: 'API is running', statusCode: 200 };
  }
}
