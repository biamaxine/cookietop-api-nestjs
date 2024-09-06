import { Body, Controller, Param, Post, Put } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Default } from 'src/shared/interfaces/default.interface';

import { SignUpDto } from './dto/sign-up.dto';
import { TmpUserService } from './tmp-user.service';

@ApiTags('Auth')
@Controller('auth')
export class TmpUserController {
  constructor(private readonly service: TmpUserService) {}

  @Post('sign-up')
  async signUp(@Body() signUpDto: SignUpDto): Promise<Default> {
    return await this.service.signUp(signUpDto);
  }

  @Put('confirm/:token')
  async confirm(@Param('token') token: string): Promise<Default> {
    return await this.service.confirm(token);
  }
}
