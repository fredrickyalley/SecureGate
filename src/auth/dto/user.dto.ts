import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class SignupDto {
  @ApiProperty({
    description: 'The email of the user',
    example: 'john_doe@gmail.com',
  })
  @IsNotEmpty()
  @IsString()
  email: string;

  @ApiProperty({
    description: 'The password of the user',
    example: 'password123',
  })
  @IsNotEmpty()
  @IsString()
  password: string;
}

export class ForgotPasswordDto {
  @ApiProperty({
    description: 'The username of the user',
    example: 'johndoe@gmail.com',
  })
  @IsNotEmpty()
  @IsString()
  email: string;

}

export class LoginDto {
  @ApiProperty({
    description: 'The username of the user',
    example: 'john_doe',
  })
  @IsNotEmpty()
  @IsString()
  email: string;

  @ApiProperty({
    description: 'The password of the user',
    example: 'password123',
  })
  @IsNotEmpty()
  @IsString()
  password: string;
}

export class ResetPasswordDto {
  @ApiProperty({
    description: 'The username of the user',
    example: 'john_doe',
  })
  @IsNotEmpty()
  @IsString()
  email: string;

  @ApiProperty({
    description: 'The new password for the user',
    example: 'newpassword123',
  })
  @IsNotEmpty()
  @IsString()
  newPassword: string;
}
