import { PartialType } from "@nestjs/mapped-types";
import { CreateRoleDto } from "./permission-role.dto";

export class UpdateRoleDto extends PartialType(CreateRoleDto) {}