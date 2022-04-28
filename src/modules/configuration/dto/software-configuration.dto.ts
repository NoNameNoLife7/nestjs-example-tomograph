import { IsEnum, IsNotEmpty, IsNumber, IsOptional } from 'class-validator';
import { PartialType } from '@nestjs/mapped-types';
import { Language } from '@prisma/client';

export class CreateSoftwareConfigurationDto {
  @IsOptional()
  @IsNumber()
  brightness?: number;

  @IsEnum(Language)
  @IsNotEmpty()
  event: Language;
}

export class UpdateSoftwareConfigurationDto extends PartialType(
  CreateSoftwareConfigurationDto,
) {}

/*
 * modulo 1 - user and role ---> user
 * modulo 2 - softConfiguration, equipConf and fan(fan) ---> configuration
 * modulo 3 - test, image(screenshot), record, patient ---> patient
 * modulo 5 - log and event (probably to merge module 3), communication ---> algo
 * module 6 -
 * */
