import {
  IsBoolean,
  IsEnum,
  IsIn,
  IsInt,
  IsNotEmpty,
  IsOptional,
  ValidateIf,
} from 'class-validator';

import { Direction } from '@prisma/client';
import { BaseIncludeDTO, PaginationDto } from 'src/common/utils';
import { Transform, Type } from 'class-transformer';
import { BadRequestException } from '@nestjs/common';

export const arrayFreq: number[] = [20, 25, 30, 35, 40, 45, 50, 55, 60];
export const arraySamp: number[] = [15, 20, 25, 30, 35, 40];

export class CreateEquipmentConfigurationDto {
  @IsOptional()
  @IsBoolean()
  adjacent?: boolean;

  @IsOptional()
  @IsInt()
  @IsIn(arrayFreq)
  injectionFrequency?: number;

  @IsEnum(Direction)
  @IsNotEmpty()
  direction: Direction;

  @IsOptional()
  @IsInt()
  jump?: number;

  @IsOptional()
  @IsInt()
  @IsIn(arraySamp)
  samplingRate?: number;
}

export class UpdateEquipmentConfigurationDto extends CreateEquipmentConfigurationDto {}

export class EquipmentConfigurationIncludeDTO extends BaseIncludeDTO {
  tests?: boolean;

  constructor(includeQueryParam: string) {
    super(includeQueryParam, ['tests']);
  }
}

export class EquipmentConfigurationPaginationDto extends PaginationDto {
  @IsOptional()
  @Transform(({ value }) => new EquipmentConfigurationIncludeDTO(value))
  @Type(() => EquipmentConfigurationIncludeDTO)
  include: EquipmentConfigurationIncludeDTO;

  where?: any;
}

export class EquipmentConfigurationRelation {
  @IsOptional()
  @Transform(({ value }) => new EquipmentConfigurationIncludeDTO(value))
  @Type(() => EquipmentConfigurationIncludeDTO)
  include: EquipmentConfigurationIncludeDTO;
}
