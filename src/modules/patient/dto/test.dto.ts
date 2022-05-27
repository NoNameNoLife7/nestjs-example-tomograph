import {
  IsArray,
  IsEnum,
  IsIn,
  IsInt,
  IsNotEmpty,
  IsObject,
  IsOptional,
  IsString,
  ValidateIf,
  ValidateNested,
} from 'class-validator';

import { PatientPosition } from '@prisma/client';
import { Transform, Type } from 'class-transformer';
import {
  CreateEquipmentConfigurationDto,
  CreateSoftwareConfigurationDto,
} from 'src/modules/configuration/dto';
import { BaseIncludeDTO, PaginationDto } from 'src/common/utils';

export const arrayInclination: number[] = [-20, 0, 20, 30, 45, 90, 120];

export class CreateTestDto {
  @IsInt()
  @IsIn(arrayInclination)
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

  @IsOptional()
  @IsInt()
  patientId?: number;

  @IsInt()
  softwareConfigurationId: number;

  @IsInt()
  equipmentConfigurationId: number;
}

export class UpdateTestDto extends CreateTestDto {}

export class TestIncludeDTO extends BaseIncludeDTO {
  images?: boolean;
  patient?: boolean;
  softwareConfiguration?: boolean;
  equipmentConfiguration?: boolean;
  fan?: boolean;
  logs?: boolean;
  records?: boolean;

  constructor(includeQueryParam: string) {
    super(includeQueryParam, [
      'images',
      'patient',
      'softwareConfiguration',
      'equipmentConfiguration',
      'fan',
      'logs',
      'records',
    ]);
  }
}

export class TestPaginationDto extends PaginationDto {
  @IsOptional()
  @Transform(({ value }) => new TestIncludeDTO(value))
  @Type(() => TestIncludeDTO)
  include: TestIncludeDTO;
}

export class TestRelation {
  @IsOptional()
  @Transform(({ value }) => new TestIncludeDTO(value))
  @Type(() => TestIncludeDTO)
  include: TestIncludeDTO;
}
