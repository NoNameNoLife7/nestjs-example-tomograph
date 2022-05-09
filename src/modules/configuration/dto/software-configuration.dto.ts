import { IsEnum, IsInt, IsNotEmpty, IsOptional } from 'class-validator';

import { Language } from '@prisma/client';
import { BaseIncludeDTO, PaginationDto } from 'src/common/utils/utils';
import { Transform, Type } from 'class-transformer';

export class CreateSoftwareConfigurationDto {
  @IsOptional()
  @IsInt()
  brightness: number | null;

  @IsEnum(Language)
  @IsNotEmpty()
  language: Language;
}

export class UpdateSoftwareConfigurationDto extends CreateSoftwareConfigurationDto {}

export class SoftwareConfigurationIncludeDTO extends BaseIncludeDTO {
  test?: boolean;

  constructor(includeQueryParam: string) {
    super(includeQueryParam, ['test']);
  }
}

export class SoftwareConfigurationPaginationDto extends PaginationDto {
  @IsOptional()
  @Transform(({ value }) => new SoftwareConfigurationIncludeDTO(value))
  @Type(() => SoftwareConfigurationIncludeDTO)
  include: SoftwareConfigurationIncludeDTO;

  where?: any;
}

/*
 * modulo 1 - user and role ---> user
 * modulo 2 - softConfiguration, equipConf and fan(fan) ---> configuration
 * modulo 3 - test, image(screenshot), record, patient ---> patient
 * modulo 5 - log and event (probably to merge module 3), communication ---> algo
 * module 6 -
 * */
