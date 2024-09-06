import { IsNotEmpty, IsString, IsStrongPassword } from 'class-validator';

export class UpdatePasswordDto {
  @IsString()
  @IsStrongPassword()
  newPassword: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}
