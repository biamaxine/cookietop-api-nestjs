import { Injectable } from '@nestjs/common';

import { Default } from './shared/interfaces/default.interface';

@Injectable()
export class AppService {
  read(): Default {
    return {
      message: 'CookieTop API NestJS',
      object: {
        v: '1.0.0 - DEV',
      },
    };
  }
}
