import { Injectable, NestMiddleware } from '@nestjs/common';
import { verify } from 'jsonwebtoken';

@Injectable()
export class GetUserIdMiddleware implements NestMiddleware {
  use(req: any, res: any, next: () => void) {
    const { authorization } = req.headers;
    if (authorization) {
      const [, token] = authorization.split(' ');
      const payload = verify(token, process.env.JWT_SECRET);
      if (
        typeof payload === 'object' &&
        payload !== null &&
        'userId' in payload
      )
        req['userId'] = payload.userId;
    }

    next();
  }
}
