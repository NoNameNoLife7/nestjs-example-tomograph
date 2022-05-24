import { Transform, Type } from 'class-transformer';
import {
  IsDate,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { BaseIncludeDTO, PaginationDto } from 'src/common/utils';

export class CreateLogDto {
  @IsOptional()
  @IsInt()
  noLog?: number;

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

export class UpdateLogDto extends CreateLogDto {}

class LogIncludeDTO extends BaseIncludeDTO {
  test?: boolean;

  constructor(includeQueryParam: string) {
    super(includeQueryParam, ['test']);
  }
}

export class LogPaginationDto extends PaginationDto {
  @IsOptional()
  @Transform(({ value }) => new LogIncludeDTO(value))
  @Type(() => LogIncludeDTO)
  include: LogIncludeDTO;

  where?: any;
}

export class LogRelation {
  @IsOptional()
  @Transform(({ value }) => new LogIncludeDTO(value))
  @Type(() => LogIncludeDTO)
  include: LogIncludeDTO;
}
