import { Type } from 'class-transformer';
import { IsIn, IsOptional } from 'class-validator';

export type WithPagination<T> = { data: T[]; count: number };

type IncludeAfterTransform<T extends string> = Partial<Record<T, boolean>>;

abstract class BaseIncludeDTO<T extends string> extends Object {
  abstract readonly includeOptions: string[];

  constructor(private includeQueryParam: string) {
    super();
  }

  valueOf(): IncludeAfterTransform<T> {
    const includeWithInvalidOptions = new Set(
      this.includeQueryParam.split(','),
    );

    const includeOptionsToUse = this.includeOptions.filter((option) =>
      includeWithInvalidOptions.has(option),
    );

    Reflect.set(this, 'something', true);

    return includeOptionsToUse.reduce((acc, includeOption) => {
      return { ...acc, [includeOption]: true };
    }, {});
  }
}

type IncludeOptionsForTest =
  | 'images'
  | 'patient'
  | 'equipmentConfiguration'
  | 'softwareConfiguration';

class TestIncludeDTO extends BaseIncludeDTO<IncludeOptionsForTest> {
  readonly includeOptions = [
    'images',
    'patient',
    'equipmentConfiguration',
    'softwareConfiguration',
  ];
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

  where: any;

  @IsOptional()
  @Type(() => TestIncludeDTO)
  include: TestIncludeDTO;
}
