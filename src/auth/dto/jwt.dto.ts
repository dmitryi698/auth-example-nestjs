import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class JwtDto {
  @ApiProperty({ required: false })
  @IsString()
  access_token: string;
}
