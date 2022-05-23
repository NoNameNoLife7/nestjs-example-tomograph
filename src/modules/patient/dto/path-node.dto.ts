import { test } from '@prisma/client';
import { Transform, Type } from 'class-transformer';
import {
  IsArray,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { BaseIncludeDTO, PaginationDto } from 'src/common/utils';
import { CreateTestDto } from './test.dto';

export class CreatePathNodeDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsOptional()
  @IsInt()
  parentId?: number;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateTestDto)
  tests: test[];
}

export class UpdatePathNodeDto extends CreatePathNodeDto {}

export class PathNodeIncludeDTO extends BaseIncludeDTO {
  tests?: boolean;
  parent?: boolean;
  children?: boolean;

  constructor(includeQueryParam: string) {
    super(includeQueryParam, ['tests', 'parent', 'children']);
  }
}

export class PathNodePaginationDto extends PaginationDto {
  @IsOptional()
  @Transform(({ value }) => new PathNodeIncludeDTO(value))
  @Type(() => PathNodeIncludeDTO)
  include: PathNodeIncludeDTO;

  where?: any;
}
