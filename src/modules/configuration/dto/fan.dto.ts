import { Transform, Type } from 'class-transformer';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { BaseIncludeDTO, PaginationDto } from 'src/common/utils/utils';

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

export class UpdateFanDto extends CreateFanDto {}

export class FanIncludeDTO extends BaseIncludeDTO {
  test?: boolean;

  constructor(includeQueryParam: string) {
    super(includeQueryParam, ['test']);
  }
}

export class FanPaginationDto extends PaginationDto {
  @IsOptional()
  @Transform(({ value }) => new FanIncludeDTO(value))
  @Type(() => FanIncludeDTO)
  include: FanIncludeDTO;

  where?: any;
}
