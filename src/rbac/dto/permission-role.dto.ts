import { ApiProperty } from "@nestjs/swagger";
import { IsArray, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";
import { z } from 'zod'



export const roleId = z.string();

export const permissionId = z.string();

export const roleSchema =  z.object({
  name: z.string().toLowerCase(),
})

export const permissionToRoleSchema =  z.object({
    roleId: z.number(),
    permissionId: z.array(z.number())
})


export const roleStatusSchema =  z.object({
  userId: z.number(),
  roleId: z.number()
})

export const permissionSchema =  z.object({
  name: z.string().toLowerCase(),
})

export const roleIdSchema =  z.object({
  roleId: z.number(),
})

/**
 * DTO for creating a new role.
 *
 * @class
 */
export class RoleDto {
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
  // @IsNotEmpty()
  // @IsString()
  name: string;

}

export class AssignPermissionToRoleDto {
  /**
   * The role id to assign permissions.
   *
   * @property
   * @type {number}
   * @example 1
   */
  @ApiProperty({
    description: 'The role id to assign permissions',
    example: 1,
  })
  // @IsNotEmpty()
  // @IsNumber()
  roleId: number;

  /**
   * The id of the permission to be assigned to the role (optional).
   *
   * @property
   * @type {number[]}
   * @example [1,2]
   */
  @ApiProperty({
    description: 'The id of permission to be assign to role',
    example: [1,2],
  })
  // @IsNotEmpty()
  // @IsArray()
  permissionIds: number[];
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
  // @IsNotEmpty()
  // @IsNumber()
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
  // @IsNotEmpty()
  // @IsNumber()
  roleId: number;
}

/**
 * DTO for creating a new permission.
 *
 * @class
 */
export class PermissionDto {
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
  // @IsNotEmpty()
  // @IsString()
  name: string;
}

export class RoleIdDto {
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
  // @IsNotEmpty()
  // @IsNumber()
  roleId: number
}

