import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import * as bcrypt from 'bcrypt';
import { Request } from 'express';
import { Model } from 'mongoose';
import { AuthService } from 'src/auth/auth.service';
import { NodemailerService } from 'src/auth/email/nodemailer.service';
import { ExternalNetwork } from 'src/shared/classes/external-network';
import { NotificationSettings } from 'src/shared/classes/notification-settings';
import { PrivacySettings } from 'src/shared/classes/privacy-settings.class';
import { ProfileSettings } from 'src/shared/classes/profile-settings';
import { Default } from 'src/shared/interfaces/default.interface';
import { TmpUser } from 'src/shared/schemas/tmp-user.schema';
import { User } from 'src/shared/schemas/user.schema';

import { SignInDto } from './dto/sign-in.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserView } from './interfaces/user-view.interface';
import { EmailUpdateLinkRequestDto } from './dto/email-update-link-request.dto';
import { UpdatePasswordDto } from './dto/update-password.dto';

@Injectable()
export class UserService {
  private merge = {
    profile: (user: User, dto: UpdateUserDto): ProfileSettings => {
      const current = user.profileSettings;
      const update = dto?.profileSettings;

      return {
        bio: update?.bio ?? current.bio,
        interests: update?.interests ?? current.interests,
      };
    },
    privacy: (user: User, dto: UpdateUserDto): PrivacySettings => {
      const current = user.privacySettings;
      const update = dto?.privacySettings;

      return {
        visibility: update?.visibility ?? current.visibility,
        showEmail: update?.showEmail ?? current.showEmail,
      };
    },
    notification: (user: User, dto: UpdateUserDto): NotificationSettings => {
      const current = user.notificationSettings;
      const update = dto?.notificationSettings;

      return {
        emailNotifications:
          update?.emailNotifications ?? current.emailNotifications,
        pushNotifications:
          update?.pushNotifications ?? current.pushNotifications,
      };
    },
    externalNetwork: (user: User, dto: UpdateUserDto): ExternalNetwork => {
      const current = user.externalNetwork;
      const update = dto?.externalNetwork;

      return {
        socialMedias: update?.socialMedias ?? current.socialMedias,
        website: update?.website ?? current.website,
      };
    },
  };

  constructor(
    @InjectModel('User')
    private readonly USERS: Model<User>,
    @InjectModel('TmpUser')
    private readonly TMP_USERS: Model<TmpUser>,
    private readonly auth: AuthService,
    private readonly mailer: NodemailerService,
  ) {}

  async signIn({ email, password }: SignInDto): Promise<Default> {
    const user = await this.USERS.findOne({ email });
    if (!user) {
      const tmpUser = await this.TMP_USERS.findOne({ email });
      if (!tmpUser) throw new NotFoundException('email not found.');

      throw new UnauthorizedException('email not verified.');
    }

    await this.checkPassword(user, password);

    try {
      const token = await this.auth.createToken(user._id.toString());

      return {
        message: 'access authorized.',
        object: { name: user.name, email },
        token,
      };
    } catch (err) {
      throw new InternalServerErrorException('failed to access account.');
    }
  }

  async read(req: Request): Promise<UserView> {
    const {
      name,
      email,
      profileSettings,
      privacySettings,
      notificationSettings,
      externalNetwork,
    } = await this.getUserForRequest(req);

    return {
      name,
      email,
      profileSettings,
      privacySettings,
      notificationSettings,
      externalNetwork,
    };
  }

  async update(req: Request, updateUserDto: UpdateUserDto): Promise<Default> {
    const user = await this.getUserForRequest(req);

    await this.checkPassword(user, updateUserDto.password);

    try {
      await this.USERS.updateOne(
        { _id: user._id.toString() },
        {
          name: updateUserDto.name ?? user.name,
          profileSettings: this.merge.profile(user, updateUserDto),
          privacySettings: this.merge.privacy(user, updateUserDto),
          notificationSettings: this.merge.notification(user, updateUserDto),
          externalNetwork: this.merge.externalNetwork(user, updateUserDto),
        },
      );

      const updated = await this.USERS.findById(user._id);

      return {
        message: 'user updated successfully.',
        object: {
          name: updated.name,
          email: updated.email,
          profileSettings: updated.profileSettings,
          privacySettings: updated.privacySettings,
          notificationSettings: updated.notificationSettings,
          externalNetwork: updated.externalNetwork,
        },
      };
    } catch (err) {
      throw new InternalServerErrorException('failed to update user.');
    }
  }

  async requireEmailUpdateLink(
    req: Request,
    { email, password }: EmailUpdateLinkRequestDto,
  ): Promise<Default> {
    const user = await this.getUserForRequest(req);

    await this.checkPassword(user, password);

    try {
      const token = await this.auth.createToken(
        user._id.toString(),
        process.env.MAILER_SECRET,
      );

      await this.mailer.sendEmailUpdateConfirmation(email, user.name, token);

      return {
        message: 'a confirmation link has been sent to your email.',
        object: {
          name: user.name,
          email: user.email,
          newEmail: email,
        },
        token,
      };
    } catch (err) {
      throw new InternalServerErrorException('failed to send email.');
    }
  }

  async updateEmail(token: string, email: string): Promise<Default> {
    const { userId } = this.auth.payloadExtractor(token);

    const user = await this.USERS.findById(userId);
    if (!user) throw new InternalServerErrorException('user not found.');

    user.email = email;

    try {
      await user.save();

      return {
        message: 'email updated successfully.',
        object: { name: user.name, email },
      };
    } catch (err) {
      throw new InternalServerErrorException('failed to update email.');
    }
  }

  async updatePassword(
    req: Request,
    { newPassword, password }: UpdatePasswordDto,
  ): Promise<Default> {
    const user = await this.getUserForRequest(req);

    await this.checkPassword(user, password);

    try {
      user.password = await bcrypt.hash(newPassword, 10);
      await user.save();

      return {
        message: 'Password updated successfully.',
      };
    } catch (err) {
      throw new InternalServerErrorException('failed to update password.');
    }
  }

  private async checkPassword(user: User, password: string): Promise<void> {
    const match = await bcrypt.compare(password, user.password);
    if (!match) throw new UnauthorizedException('access denied.');
  }

  private async getUserForRequest(req: Request): Promise<User> {
    const user = await this.USERS.findById(req['userId']);
    if (!user) throw new InternalServerErrorException('invalid token.');
    return user;
  }
}
