import {
  IsDate,
  IsInt,
  IsJSON,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { PartialType } from '@nestjs/mapped-types';

export class CreateImageDto {
  @IsOptional()
  @IsDate()
  date?: Date;

  @IsJSON()
  @IsNotEmpty()
  directory: []; //fix

  @IsOptional()
  @IsNotEmpty()
  @IsString()
  file?: string;

  @IsInt()
  testId: number;
}

export class UpdateImageDto extends PartialType(CreateImageDto) {}
