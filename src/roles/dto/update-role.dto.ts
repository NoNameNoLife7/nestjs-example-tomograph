import { PartialType } from '@nestjs/mapped-types';
import { CreateRoleDto } from './create-role.dto';
import { isNumber } from 'class-validator';

export class UpdateRoleDto extends PartialType(CreateRoleDto) {}
