import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";
import { PartialType } from "@nestjs/mapped-types";


/**
 * DTO for creating a new role.
 *
 * @class
 */
export class CreateRoleDto {
  /**
   * The name of the role to create.
   *
   * @property
   * @type {string}
   * @example 'user'
   */
  @ApiProperty({
    description: 'The name of the role to create',
    example: 'user',
  })
  @IsNotEmpty()
  @IsString()
  name: string;

  /**
   * The id of the permission to be assigned to the role (optional).
   *
   * @property
   * @type {number}
   * @example 1
   */
  @ApiProperty({
    description: 'The id of permission to be assign to role',
    example: 1,
  })
  @IsOptional()
  @IsNumber()
  permissionId?: number;
}

/**
 * DTO for assigning a role to a user.
 *
 * @class
 */
export class AssignRoleToUserDto {
  /**
   * The id of the user.
   *
   * @property
   * @type {number}
   * @example 1
   */
  @ApiProperty({
    description: 'The id of the user',
    example: 1,
  })
  @IsNotEmpty()
  @IsNumber()
  userId: number;

  /**
   * The role id of the user.
   *
   * @property
   * @type {number}
   * @example 1
   */
  @ApiProperty({
    description: 'The role id of the user',
    example: 1,
  })
  @IsNotEmpty()
  @IsNumber()
  roleId: number;
}

/**
 * DTO for revoking a role from a user.
 *
 * @class
 */
export class RevokeRoleOfUserDto {
  /**
   * The id of the user.
   *
   * @property
   * @type {number}
   * @example 1
   */
  @ApiProperty({
    description: 'The id of the user',
    example: 1,
  })
  @IsNotEmpty()
  @IsNumber()
  userId: number;

  /**
   * The role id of the user.
   *
   * @property
   * @type {number}
   * @example 1
   */
  @ApiProperty({
    description: 'The role id of the user',
    example: 1,
  })
  @IsNotEmpty()
  @IsNumber()
  roleId: number;
}

/**
 * DTO for creating a new permission.
 *
 * @class
 */
export class CreatePermissionDto {
  /**
   * The name of the permission to create.
   *
   * @property
   * @type {string}
   * @example 'write'
   */
  @ApiProperty({
    description: 'The name of the permission to create',
    example: 'write',
  })
  @IsNotEmpty()
  @IsString()
  name: string;
}

/**
 * DTO for updating a permission.
 *
 * @class
 */
export class UpdatePermissionDto extends PartialType(CreatePermissionDto) {}

/**
 * DTO for updating a role.
 *
 * @class
 */
export class UpdateRoleDto extends PartialType(CreateRoleDto) {}
