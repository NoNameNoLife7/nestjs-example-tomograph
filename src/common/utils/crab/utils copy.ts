import { Transform, TransformationType, Type } from 'class-transformer';
import { IsIn, IsOptional } from 'class-validator';

export type WithPagination<T> = { data: T[]; count: number };

const IncludeOptionsForTest = [
  'images',
  'patient',
  'equipmentConfiguration',
  'softwareConfiguration',
  'fan',
] as const;

type IncludeOptionsForTest = typeof IncludeOptionsForTest[number];

type IncludeAfterTransform = Partial<Record<IncludeOptionsForTest, boolean>>;

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
  @Transform(({ type, value }) => {
    if (type !== TransformationType.PLAIN_TO_CLASS) return value;

    // value: "invalid2,images,patient,invalid1"
    const includeWithInvalidOptions = new Set(value.split(','));
    // includeWithInvalidOptions: new Set(["invalid2","images","patient","invalid1"])

    const includeOptionsToUse = IncludeOptionsForTest.filter((option) =>
      includeWithInvalidOptions.has(option),
    );
    // includeOptionsToUse = ["images", "patient"]

    return includeOptionsToUse.reduce((acc, includeOption) => {
      return { ...acc, [includeOption]: true };
    }, {} as IncludeAfterTransform);
    // return: { images: true, patient: true }
  })
  include: IncludeAfterTransform;
}
