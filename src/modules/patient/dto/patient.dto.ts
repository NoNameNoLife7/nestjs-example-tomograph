import {
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

import { Sex, SkinColor } from '@prisma/client';

export class CreatePatientDto {
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @IsString()
  @IsNotEmpty()
  lastName: string;

  @IsOptional()
  @IsString()
  hospitalCode: string;

  @IsOptional()
  @IsString()
  comorbidities: string;

  @IsOptional()
  @IsString()
  diagnostic: string;

  @IsOptional()
  @IsBoolean()
  active?: boolean;

  @IsOptional()
  @IsNumber()
  weight: number;

  @IsOptional()
  @IsNumber()
  size: number;

  @IsOptional()
  @IsEnum(Sex)
  sex?: Sex;

  @IsOptional()
  @IsEnum(SkinColor)
  skinColor?: SkinColor;
}

export class UpdatePatientDto extends CreatePatientDto {}
