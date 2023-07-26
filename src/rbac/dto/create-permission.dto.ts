import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty,  IsString } from "class-validator";

export class CreatePermissionDto {
    @ApiProperty({
        description: 'The name of the permission to create',
        example: 'write',
      })
    @IsNotEmpty()
    @IsString()
    name: string;

}