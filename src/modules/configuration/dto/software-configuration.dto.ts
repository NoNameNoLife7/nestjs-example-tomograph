import { IsEnum, IsInt, IsNotEmpty, IsOptional } from 'class-validator';

import { Language } from '@prisma/client';

export class CreateSoftwareConfigurationDto {
  @IsOptional()
  @IsInt()
  brightness: number | null;

  @IsEnum(Language)
  @IsNotEmpty()
  language: Language;
}

export class UpdateSoftwareConfigurationDto extends CreateSoftwareConfigurationDto {}

/*
 * modulo 1 - user and role ---> user
 * modulo 2 - softConfiguration, equipConf and fan(fan) ---> configuration
 * modulo 3 - test, image(screenshot), record, patient ---> patient
 * modulo 5 - log and event (probably to merge module 3), communication ---> algo
 * module 6 -
 * */
