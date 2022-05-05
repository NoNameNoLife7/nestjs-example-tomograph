import {
  IsArray,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';

import {
  PatientPosition,
  //softwareConfiguration,
  //equipmentConfiguration,
} from '@prisma/client';
import { Type } from 'class-transformer';
import {
  CreateEquipmentConfigurationDto,
  CreateSoftwareConfigurationDto,
} from 'src/modules/configuration/dto';

export class CreateTestDto {
  @IsInt()
  @IsNotEmpty()
  inclination: number;

  @IsOptional()
  @IsInt()
  peep?: number;

  @IsArray()
  directory: number[]; //fix

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

//partial type
//crestedAt
//updatedAt
