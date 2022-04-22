import { PartialType } from "@nestjs/mapped-types";
import { IsNotEmpty, IsString } from "class-validator";

export class CreateRoleDto {
  @IsString()
  @IsNotEmpty()
  name: string;
}

export class UpdateRoleDto extends PartialType(CreateRoleDto) {}
