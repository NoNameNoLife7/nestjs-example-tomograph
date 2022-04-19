//import {RoleEntity} from "../../roles/entity/role.entity";

import {
  IsBoolean,
  IsDate,
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { CreateRoleDto } from '../../roles/dto/create-role.dto';
import { Type } from 'class-transformer';
import { User } from '../entity/user.entity';
import { RoleEntity } from '../../roles/entity/role.entity';

export class CreateUserDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  firstName: string;

  @IsString()
  @IsNotEmpty()
  lastName: string;

  @IsOptional()
  @IsBoolean()
  active?: boolean;

  @IsNumber()
  roleId: number;
}
