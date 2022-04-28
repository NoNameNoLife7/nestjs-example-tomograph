import {
  IsEnum,
  IsInt,
  IsJSON,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { PartialType } from '@nestjs/mapped-types';
import {
  PatientPosition,
  softwareConfiguration,
  equipmentConfiguration,
} from '@prisma/client';

export class CreateTestDto {
  @IsInt()
  @IsNotEmpty()
  inclination: number;

  @IsOptional()
  @IsInt()
  peep?: number;

  @IsJSON()
  directory: []; //fix

  @IsOptional()
  @IsString()
  file?: string;

  @IsEnum(PatientPosition)
  position: PatientPosition;

  softwareConfiguration: softwareConfiguration;

  equipmentConfiguration: equipmentConfiguration;
}

export class UpdateTestDto extends PartialType(CreateTestDto) {}
