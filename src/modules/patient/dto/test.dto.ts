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
  fan,
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

  @IsOptional()
  @IsInt()
  patientId?: number;

  @IsOptional()
  @IsInt()
  ventilatorId?: number;
}

export class UpdateTestDto extends PartialType(CreateTestDto) {}
