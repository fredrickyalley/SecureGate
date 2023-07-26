import { IsNotEmpty, IsNumber, IsString } from "class-validator";
import { ApiProperty } from '@nestjs/swagger';


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