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
import { BaseIncludeDTO, PaginationDto } from 'src/common/utils';
import { Transform, Type } from 'class-transformer';

export class CreateEquipmentConfigurationDto {
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
