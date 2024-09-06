import { Prop } from '@nestjs/mongoose';
import { IsArray, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class ExternalNetwork {
  @Prop({ default: [] })
  socialMedias: string[];

  @Prop()
  website?: string;
}

export class ExternalNetworkDto implements Partial<ExternalNetwork> {
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @IsNotEmpty({ each: true })
  socialMedias?: string[];

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  website?: string;
}
