import {
  IsBoolean,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { PartialType } from '@nestjs/mapped-types';
import { Direction } from '@prisma/client';

export class CreateEquipmentConfigurationDto {
  @IsOptional()
  @IsBoolean()
  adjacent?: boolean;

  @IsOptional()
  @IsNumber()
  injectionFrequency?: number;

  @IsEnum(Direction)
  @IsNotEmpty()
  direction: Direction;

  @IsOptional()
  @IsInt()
  @IsString()
  jump?: number;
}

export class UpdateEquipmentConfigurationDto extends PartialType(
  CreateEquipmentConfigurationDto,
) {}
