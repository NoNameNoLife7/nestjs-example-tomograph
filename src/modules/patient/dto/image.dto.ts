import { Transform, Type } from 'class-transformer';
import {
  IsArray,
  IsDate,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { BaseIncludeDTO, PaginationDto } from 'src/common/utils/utils';

export class CreateImageDto {
  @IsOptional()
  @IsDate()
  date?: Date;

  @IsArray()
  directory: number[];

  @IsOptional()
  @IsNotEmpty()
  @IsString()
  file?: string;

  @IsInt()
  testId: number;
}

export class UpdateImageDto extends CreateImageDto {}

export class ImageIncludeDTO extends BaseIncludeDTO {
  test?: boolean;

  constructor(includeQueryParam: string) {
    super(includeQueryParam, ['test']);
  }
}

export class ImagePaginationDto extends PaginationDto {
  @IsOptional()
  @Transform(({ value }) => new ImageIncludeDTO(value))
  @Type(() => ImageIncludeDTO)
  include: ImageIncludeDTO;

  where?: any;
}
