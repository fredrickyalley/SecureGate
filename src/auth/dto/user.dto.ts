import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsNumber, IsString, Length, min } from 'class-validator';
import {z} from 'zod'


export const userAuthSchema = z.object({
  email: z.string().email(),
  password: z.coerce.string().min(6)
})

export const forgotPasswordSchema = z.object({
  email: z.string().email(),
})

export const resetPasswordSchema = z.object({
  userId: z.number().positive(),
  oldPassword: z.coerce.string().min(6),
  newPassword: z.coerce.string().min(6)
})

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
  @IsEmail()
  email: string;

  /** The password of the user */
  @ApiProperty({
    description: 'The password of the user',
    example: 'password123',
  })
  @IsNotEmpty()
  @IsString()
  @Length(6)
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
  @IsEmail()
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
  @IsEmail()
  email: string;

  /** The password of the user */
  @ApiProperty({
    description: 'The password of the user',
    example: 'password123',
  })
  @IsNotEmpty()
  @IsString()
  @Length(6)
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
  @Length(6)
  oldPassword: string;

  /** The new password for the user */
  @ApiProperty({
    description: 'The new password for the user',
    example: 'newpassword123',
  })
  @IsNotEmpty()
  @IsString()
  @Length(6)
  newPassword: string;


}
