import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsEmail, MinLength } from 'class-validator';
import { PartialType } from '@nestjs/mapped-types';

export class CreateUserDto {
  @ApiProperty({
    description: 'The email of user to create',
    example: 'user@example.com',
  })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'The password of user to create',
    example: 'password123',
  })
  @IsNotEmpty()
  @MinLength(6)
  password: string;
}

export class UpdateUserDto extends PartialType(CreateUserDto) {}
