import {
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

import { EventType } from '@prisma/client';
import { BaseIncludeDTO, PaginationDto } from 'src/common/utils/utils';
import { Transform, Type } from 'class-transformer';

export class CreateEventDto {
  @IsOptional()
  @IsBoolean()
  active?: boolean;

  @IsString()
  @IsNotEmpty()
  event: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsEnum(EventType)
  eventType: EventType;
}

export class UpdateEventDto extends CreateEventDto {}

class EventIncludeDTO extends BaseIncludeDTO {
  test?: boolean;

  constructor(includeQueryParam: string) {
    super(includeQueryParam, ['test']);
  }
}

export class EventPaginationDto extends PaginationDto {
  @IsOptional()
  @Transform(({ value }) => new EventIncludeDTO(value))
  @Type(() => EventIncludeDTO)
  include: EventIncludeDTO;

  where?: any;
}
