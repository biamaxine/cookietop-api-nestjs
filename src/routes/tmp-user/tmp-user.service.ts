import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AuthService } from 'src/auth/auth.service';
import { NodemailerService } from 'src/auth/email/nodemailer.service';
import { Default } from 'src/shared/interfaces/default.interface';
import { TmpUser } from 'src/shared/schemas/tmp-user.schema';
import { User } from 'src/shared/schemas/user.schema';

import { SignUpDto } from './dto/sign-up.dto';

@Injectable()
export class TmpUserService {
  constructor(
    @InjectModel('User')
    private readonly USERS: Model<User>,
    @InjectModel('TmpUser')
    private readonly TMP_USERS: Model<TmpUser>,
    private readonly auth: AuthService,
    private readonly mailer: NodemailerService,
  ) {}

  async signUp({ email, name, password }: SignUpDto): Promise<Default> {
    const verifyUser = await this.USERS.findOne({ email });
    if (verifyUser) throw new ConflictException('email already registered.');

    const verifyTmpUser = await this.TMP_USERS.findOne({ email });
    if (verifyTmpUser) throw new ConflictException('email already registerd.');

    const tmpUser = new this.TMP_USERS({
      email,
      name,
      password,
    });

    try {
      await tmpUser.save();

      const token = await this.auth.createToken(
        tmpUser._id.toString(),
        process.env.MAILER_SECRET,
      );

      await this.mailer
        .sendConfirmationEmail(email, name, token)
        .catch(async (err) => {
          await this.TMP_USERS.findByIdAndDelete(tmpUser._id);

          throw new Error(err.message);
        });

      return {
        message: 'user created successfully.',
        object: { name, email },
        token,
      };
    } catch (err) {
      throw new InternalServerErrorException('failed to create user', err);
    }
  }

  async confirm(token: string): Promise<Default> {
    const { userId } = this.auth.payloadExtractor(token);
    const tmpUser = await this.TMP_USERS.findById(userId);
    if (!tmpUser) throw new NotFoundException('user not found.');

    const { email, name, password } = tmpUser;

    const user = new this.USERS({ email, name, password });

    try {
      await user.save();
      await this.TMP_USERS.findByIdAndDelete(userId);

      return {
        message: 'email confirmed successfully.',
        object: { email, name },
      };
    } catch (err) {
      throw new InternalServerErrorException('failed to confirm email.', err);
    }
  }
}
