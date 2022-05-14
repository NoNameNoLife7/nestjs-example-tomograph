import { Transform, Type } from 'class-transformer';
import { IsInt, IsNotEmpty, IsOptional } from 'class-validator';
import { BaseIncludeDTO, PaginationDto } from 'src/common/utils';

export class CreateRecordDto {
  @IsInt()
  @IsNotEmpty()
  testId: number;
}

export class UpdateRecordDto extends CreateRecordDto {}

export class RecordIncludeDTO extends BaseIncludeDTO {
  test?: boolean;

  constructor(includeQueryParam: string) {
    super(includeQueryParam, ['test']);
  }
}

export class RecordPaginationDto extends PaginationDto {
  @IsOptional()
  @Transform(({ value }) => new RecordIncludeDTO(value))
  @Type(() => RecordIncludeDTO)
  include: RecordIncludeDTO;

  where?: any;
}
