import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

/**
 * Data Transfer Object (DTO) for user signup.
 */
export class SignupDto {
  /** The email of the user */
  @ApiProperty({
    description: 'The email of the user',
    example: 'johndoe@gmail.com',
  })
  @IsNotEmpty()
  @IsString()
  email: string;

  /** The password of the user */
  @ApiProperty({
    description: 'The password of the user',
    example: 'password123',
  })
  @IsNotEmpty()
  @IsString()
  password: string;
}

/**
 * Data Transfer Object (DTO) for requesting password reset.
 */
export class ForgotPasswordDto {
  /** The email of the user */
  @ApiProperty({
    description: 'The email of the user',
    example: 'johndoe@gmail.com',
  })
  @IsNotEmpty()
  @IsString()
  email: string;
}

/**
 * Data Transfer Object (DTO) for user login.
 */
export class LoginDto {
  /** The email of the user */
  @ApiProperty({
    description: 'The email of the user',
    example: 'johndoe@gmail.com',
  })
  @IsNotEmpty()
  @IsString()
  email: string;

  /** The password of the user */
  @ApiProperty({
    description: 'The password of the user',
    example: 'password123',
  })
  @IsNotEmpty()
  @IsString()
  password: string;
}

/**
 * Data Transfer Object (DTO) for resetting the user's password.
 */
export class ResetPasswordDto {
   /** The id of the user */
   @ApiProperty({
    description: 'The id for the user',
    example: 1,
  })
  @IsNotEmpty()
  @IsNumber()
  userId: number;

  /** The email of the user */
  @ApiProperty({
    description: 'The new password for the user',
    example: 'oldpassword123',
  })
  @IsNotEmpty()
  @IsString()
  oldPassword: string;

  /** The new password for the user */
  @ApiProperty({
    description: 'The new password for the user',
    example: 'newpassword123',
  })
  @IsNotEmpty()
  @IsString()
  newPassword: string;


}
