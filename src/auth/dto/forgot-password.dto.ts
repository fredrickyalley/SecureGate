import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class ForgotPasswordDto {
  @ApiProperty({
    description: 'The username of the user',
    example: 'johndoe@gmail.com',
  })
  @IsNotEmpty()
  @IsString()
  email: string;

}