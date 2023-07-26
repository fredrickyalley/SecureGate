import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

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