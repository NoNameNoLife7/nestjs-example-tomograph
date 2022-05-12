import { Transform, Type } from 'class-transformer';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { BaseIncludeDTO, PaginationDto } from 'src/common/utils/utils';

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

export class UpdateCommunicationDto extends CreateCommunicationDto {}
