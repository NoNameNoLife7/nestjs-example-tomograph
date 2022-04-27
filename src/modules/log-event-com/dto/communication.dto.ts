import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { PartialType } from '@nestjs/mapped-types';

export class CreateCommunicationDto {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  protocol?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  version?: string;
}

export class UpdateCommunicationDto extends PartialType(
  CreateCommunicationDto,
) {}
