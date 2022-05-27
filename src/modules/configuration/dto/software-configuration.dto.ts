import {
  IsDate,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
} from 'class-validator';

import { Language } from '@prisma/client';
import { BaseIncludeDTO, PaginationDto } from 'src/common/utils';
import { Transform, Type } from 'class-transformer';

export class CreateSoftwareConfigurationDto {
  @IsNumber()
  brightness: number;

  @IsOptional()
  @IsDate()
  @IsNotEmpty()
  dateTime?: Date;

  @IsEnum(Language)
  @IsNotEmpty()
  language: Language;
}

export class UpdateSoftwareConfigurationDto extends CreateSoftwareConfigurationDto {}

export class SoftwareConfigurationIncludeDTO extends BaseIncludeDTO {
  tests?: boolean;

  constructor(includeQueryParam: string) {
    super(includeQueryParam, ['tests']);
  }
}

export class SoftwareConfigurationPaginationDto extends PaginationDto {
  @IsOptional()
  @Transform(({ value }) => new SoftwareConfigurationIncludeDTO(value))
  @Type(() => SoftwareConfigurationIncludeDTO)
  include: SoftwareConfigurationIncludeDTO;

  where?: any;
}

export class SoftwareConfigurationRelation {
  @IsOptional()
  @Transform(({ value }) => new SoftwareConfigurationIncludeDTO(value))
  @Type(() => SoftwareConfigurationIncludeDTO)
  include: SoftwareConfigurationIncludeDTO;
}
