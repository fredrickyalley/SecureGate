import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsEmail, MinLength, IsString } from 'class-validator';
import { PartialType } from '@nestjs/mapped-types';
import { z } from 'zod';

export const userSchema = z.object({
  email: z.string().email(),
  password: z.coerce.string().min(6)
})

export const updateUserSchema = z.object({
  email: z.string().email().optional(),
  password: z.coerce.string().min(6).optional()
})

export const userIdSchema = z.string();


/**
 * Data transfer object for creating a new user.
 */
export class CreateUserDto {
  @ApiProperty({
    description: 'The email of user to create',
    example: 'user@example.com',
  })
  // @IsNotEmpty()
  // @IsEmail()
  email: string;

  @ApiProperty({
    description: 'The password of user to create',
    example: 'password123',
  })
  // @IsNotEmpty()
  // @IsString()
  // @MinLength(6)
  password: string;
}

/**
 * Data transfer object for updating a user.
 * Note: This class extends PartialType(CreateUserDto) to allow partial updates.
 */
export class UpdateUserDto extends PartialType(CreateUserDto) {}
