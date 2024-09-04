import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Request } from 'express';
import { sign } from 'jsonwebtoken';
import { Model } from 'mongoose';
import { JwtPayload } from 'src/shared/interfaces/jwt.payload';
import { TmpUser } from 'src/shared/schemas/tmp-user.schema';
import { User } from 'src/shared/schemas/user.schema';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel('TmpUser')
    private readonly TMP_USERS: Model<TmpUser>,
    @InjectModel('User')
    private readonly USERS: Model<User>,
  ) {}

  async createToken(
    userId: string,
    secret = process.env.JWT_SECRET,
  ): Promise<string> {
    return sign({ userId }, secret, {
      expiresIn: process.env.JWT_EXPIRATION,
    });
  }

  async validateUser(payload: JwtPayload): Promise<User> {
    const user = await this.USERS.findById(payload.userId);
    if (!user) throw new UnauthorizedException('invalid token');
    return user;
  }

  returnJwtExtractor(): (req: Request) => string {
    return AuthService.jwtExtractor;
  }

  private static jwtExtractor({ headers }: Request): string {
    if (headers.authorization) {
      const [, token] = headers.authorization.split(' ');
      return token;
    }

    throw new UnauthorizedException('invalid token.');
  }
}
