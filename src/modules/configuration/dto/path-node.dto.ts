import { Transform, Type } from 'class-transformer';
import { IsInt, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { BaseIncludeDTO, PaginationDto } from 'src/common/utils';

export class CreatePathNodeDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsOptional()
  @IsInt()
  parentId?: number;
}

export class UpdatePathNodeDto extends CreatePathNodeDto {}

export class PathNodeIncludeDTO extends BaseIncludeDTO {
  test?: boolean;

  constructor(includeQueryParam: string) {
    super(includeQueryParam, ['test']);
  }
}

export class PathNodePaginationDto extends PaginationDto {
  @IsOptional()
  @Transform(({ value }) => new PathNodeIncludeDTO(value))
  @Type(() => PathNodeIncludeDTO)
  include: PathNodeIncludeDTO;

  where?: any;
}
