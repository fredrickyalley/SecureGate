import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";
import { PartialType } from "@nestjs/mapped-types";

export class CreateRoleDto {
    @ApiProperty({
        description: 'The name of the role to create',
        example: 'user',
      })
    @IsNotEmpty()
    @IsString()
    name: string;

    @ApiProperty({
      description: 'The id of permission to be assign to role',
      example: 1,
    })
  @IsOptional()
  @IsNumber()
  permissionId?: number;
}

export class AssignRoleToUserDto {
  @ApiProperty({
      description: 'The id of the user',
      example: 1,
    })
  @IsNotEmpty()
  @IsNumber()
  userId: number;

  @ApiProperty({
      description: 'The role id of the user',
      example: 1,
    })
  @IsNotEmpty()
  @IsNumber()
  roleId: number;
}

export class RevokeRoleOfUserDto {
  @ApiProperty({
      description: 'The id of the user',
      example: 1,
    })
  @IsNotEmpty()
  @IsNumber()
  userId: number;

  @ApiProperty({
      description: 'The role id of the user',
      example: 1,
    })
  @IsNotEmpty()
  @IsNumber()
  roleId: number;
}

export class CreatePermissionDto {
  @ApiProperty({
      description: 'The name of the permission to create',
      example: 'write',
    })
  @IsNotEmpty()
  @IsString()
  name: string;

}


export class UpdatePermissionDto extends PartialType(CreatePermissionDto) {}

export class UpdateRoleDto extends PartialType(CreateRoleDto) {}