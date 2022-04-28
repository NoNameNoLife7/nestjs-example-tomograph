import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { PartialType } from '@nestjs/mapped-types';

export class CreateFanDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsOptional()
  @IsNotEmpty()
  @IsString()
  model?: string;

  @IsOptional()
  @IsNotEmpty()
  @IsString()
  protocol?: string;
}

export class UpdateFanDto extends PartialType(CreateFanDto) {}
