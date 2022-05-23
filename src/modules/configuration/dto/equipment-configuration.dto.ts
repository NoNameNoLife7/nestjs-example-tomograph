import {
  IsBoolean,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
} from 'class-validator';

import { Direction } from '@prisma/client';
import { BaseIncludeDTO, PaginationDto } from 'src/common/utils';
import { Transform, Type } from 'class-transformer';

export const arrayFreq: number[] = [50, 60];
export const arraySamp: number[] = [10, 15, 25];

export class CreateEquipmentConfigurationDto {
  @IsOptional()
  @IsBoolean()
  adjacent?: boolean;

  @IsOptional()
  @IsInt()
  @IsEnum(arrayFreq)
  injectionFrequency?: number;

  @IsEnum(Direction)
  @IsNotEmpty()
  direction: Direction;

  @IsOptional()
  @IsInt()
  jump?: number;

  @IsOptional()
  @IsInt()
  @IsEnum(arraySamp)
  samplingRate?: number;
}

export class UpdateEquipmentConfigurationDto extends CreateEquipmentConfigurationDto {}

export class EquipmentConfigurationIncludeDTO extends BaseIncludeDTO {
  test?: boolean;

  constructor(includeQueryParam: string) {
    super(includeQueryParam, ['test']);
  }
}

export class EquipmentConfigurationPaginationDto extends PaginationDto {
  @IsOptional()
  @Transform(({ value }) => new EquipmentConfigurationIncludeDTO(value))
  @Type(() => EquipmentConfigurationIncludeDTO)
  include: EquipmentConfigurationIncludeDTO;

  where?: any;
}
