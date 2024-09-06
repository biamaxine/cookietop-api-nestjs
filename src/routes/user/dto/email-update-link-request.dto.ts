import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class EmailUpdateLinkRequestDto {
  @IsString()
  @IsEmail()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}
