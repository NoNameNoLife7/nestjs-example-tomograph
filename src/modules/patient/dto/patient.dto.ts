import {
  IsBoolean,
  IsDate,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

import { Sex, SkinColor } from '@prisma/client';
import { BaseIncludeDTO, PaginationDto } from 'src/common/utils';
import { Transform, Type } from 'class-transformer';

export class CreatePatientDto {
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @IsString()
  @IsNotEmpty()
  lastName: string;

  @IsOptional()
  @Type(() => Date)
  @IsDate()
  date?: Date;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  hospitalCode?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  comorbidities?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  diagnostic?: string;

  @IsOptional()
  @IsBoolean()
  active?: boolean;

  @IsOptional()
  @IsNumber()
  weight?: number;

  @IsOptional()
  @IsNumber()
  size?: number;

  @IsOptional()
  @IsEnum(Sex)
  sex?: Sex;

  @IsOptional()
  @IsEnum(SkinColor)
  skinColor?: SkinColor;
}

export class UpdatePatientDto extends CreatePatientDto {}

export class PatientIncludeDTO extends BaseIncludeDTO {
  tests?: boolean;

  constructor(includeQueryParam: string) {
    super(includeQueryParam, ['tests']);
  }
}

export class PatientPaginationDto extends PaginationDto {
  @IsOptional()
  @Transform(({ value }) => new PatientIncludeDTO(value))
  @Type(() => PatientIncludeDTO)
  include: PatientIncludeDTO;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  firstName?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  lastName?: string;

  @IsOptional()
  @Type(() => Date)
  @IsDate()
  date?: Date;

  @IsOptional()
  @IsString()
  hospitalCode?: string;

  @IsOptional()
  @IsString()
  comorbidities?: string;

  @IsOptional()
  @IsString()
  diagnostic?: string;

  @IsOptional()
  @Type(() => Boolean)
  @IsBoolean()
  active?: boolean;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  weight?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  size?: number;

  @IsOptional()
  @IsEnum(Sex)
  sex?: Sex;

  @IsOptional()
  @IsEnum(SkinColor)
  skinColor?: SkinColor;
}

export class PatientRelation {
  @IsOptional()
  @Transform(({ value }) => new PatientIncludeDTO(value))
  @Type(() => PatientIncludeDTO)
  include: PatientIncludeDTO;
}
