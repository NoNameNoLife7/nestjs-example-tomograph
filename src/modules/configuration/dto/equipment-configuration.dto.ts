import {
  IsBoolean,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

import { Direction } from '@prisma/client';

export class CreateEquipmentConfigurationDto {
  @IsInt()
  id: number;

  @IsOptional()
  @IsBoolean()
  adjacent: boolean | null;

  @IsOptional()
  @IsNumber()
  injectionFrequency: number | null;

  @IsEnum(Direction)
  @IsNotEmpty()
  direction: Direction;

  @IsOptional()
  @IsInt()
  @IsString()
  jump: number | null;
}

export class UpdateEquipmentConfigurationDto extends CreateEquipmentConfigurationDto {}
