import {
  IsDate,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { PartialType } from '@nestjs/mapped-types';

export class CreateLogDto {
  @IsOptional()
  @IsInt()
  noEvent?: number;

  @IsOptional()
  @IsNotEmpty()
  @IsString()
  comment?: string;

  @IsDate()
  date: Date;

  @IsOptional()
  @IsInt()
  eventId?: number;

  @IsOptional()
  @IsInt()
  testId: number;
}

export class UpdateLogDto extends PartialType(CreateLogDto) {}
