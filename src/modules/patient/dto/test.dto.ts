import {
  IsArray,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';

import { PatientPosition } from '@prisma/client';
import { Transform, Type } from 'class-transformer';
import {
  CreateEquipmentConfigurationDto,
  CreateSoftwareConfigurationDto,
} from 'src/modules/configuration/dto';
import { BaseIncludeDTO, PaginationDto } from 'src/common/utils';

export class CreateTestDto {
  @IsInt()
  @IsNotEmpty()
  inclination: number;

  @IsOptional()
  @IsInt()
  peep?: number;

  @IsArray()
  directory: number[];

  @IsOptional()
  @IsString()
  file?: string;

  @IsEnum(PatientPosition)
  position: PatientPosition;

  @ValidateNested()
  @Type(() => CreateSoftwareConfigurationDto)
  softwareConfiguration: CreateSoftwareConfigurationDto;

  @ValidateNested()
  @Type(() => CreateEquipmentConfigurationDto)
  equipmentConfiguration: CreateEquipmentConfigurationDto;
}

export class UpdateTestDto extends CreateTestDto {}

export class TestIncludeDTO extends BaseIncludeDTO {
  images?: boolean;
  patient?: boolean;
  softwareConfiguration?: boolean;
  equipmentConfiguration?: boolean;
  fan?: boolean;

  constructor(includeQueryParam: string) {
    super(includeQueryParam, [
      'images',
      'patient',
      'softwareConfiguration',
      'equipmentConfiguration',
      'fan',
    ]);
  }
}

export class TestPaginationDto extends PaginationDto {
  @IsOptional()
  @Transform(({ value }) => new TestIncludeDTO(value))
  @Type(() => TestIncludeDTO)
  include: TestIncludeDTO;
}
