import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags } from '@nestjs/swagger';
import { Request } from 'express';
import { Default } from 'src/shared/interfaces/default.interface';

import { EmailUpdateLinkRequestDto } from './dto/email-update-link-request.dto';
import { SignInDto } from './dto/sign-in.dto';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserView } from './interfaces/user-view.interface';
import { UserService } from './user.service';

@ApiTags('Auth')
@Controller('auth')
export class UserController {
  constructor(private readonly service: UserService) {}

  @Post('sign-in')
  async signIn(@Body() signInDto: SignInDto): Promise<Default> {
    return await this.service.signIn(signInDto);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('read')
  async read(@Req() req: Request): Promise<UserView> {
    return await this.service.read(req);
  }

  @UseGuards(AuthGuard('jwt'))
  @Put('update')
  async update(
    @Req() req: Request,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<Default> {
    return await this.service.update(req, updateUserDto);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('update/email/require')
  async requireEmailUpdateLink(
    @Req() req: Request,
    @Body() emailUpdateLinkRequest: EmailUpdateLinkRequestDto,
  ): Promise<Default> {
    return await this.service.requireEmailUpdateLink(
      req,
      emailUpdateLinkRequest,
    );
  }

  @Put('update/email/:token')
  async updateEmail(
    @Param('token') token: string,
    @Query('email') email: string,
  ): Promise<Default> {
    return await this.service.updateEmail(token, email);
  }

  @UseGuards(AuthGuard('jwt'))
  @Put('update/password')
  async updatePassword(
    @Req() req: Request,
    @Body() updatePasswordDto: UpdatePasswordDto,
  ): Promise<Default> {
    return await this.service.updatePassword(req, updatePasswordDto);
  }
}
