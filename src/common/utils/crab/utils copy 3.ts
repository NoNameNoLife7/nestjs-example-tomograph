import {
  ClassTransformer,
  Transform,
  TransformationType,
  Type,
} from 'class-transformer';
import { IsIn, IsOptional } from 'class-validator';

export type WithPagination<T> = { data: T[]; count: number };

abstract class BaseIncludeDTO extends ClassTransformer {
  constructor(private includeQueryParam: string) {
    super();
    this.includeQueryParam.split(',').forEach((includeOption) => {
      if (Reflect.has(this, includeOption)) {
        Reflect.set(this, includeOption, true);
      }
    });
  }
}

class TestIncludeDTO extends BaseIncludeDTO {
  images: false;
  patient: false;
  softwareConfiguration: false;
  equipmentConfiguration: false;
}

export class PaginationDto {
  @IsOptional()
  @Type(() => Number)
  skip: number = 0;

  @IsOptional()
  @Type(() => Number)
  take: number = 50;

  @IsOptional()
  @IsIn(['asc', 'desc'])
  orderBy: 'asc' | 'desc';

  @IsOptional()
  @Transform(({ value, type }) =>
    type === TransformationType.PLAIN_TO_CLASS
      ? new TestIncludeDTO(value)
      : value,
  )
  include: TestIncludeDTO;

  where: any;
}
