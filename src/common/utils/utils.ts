import { BadRequestException } from '@nestjs/common';
import { Type } from 'class-transformer';
import { IsIn, IsNumber, IsOptional } from 'class-validator';

export type WithPagination<T> = { data: T[]; count: number };

export abstract class BaseIncludeDTO extends Object {
  constructor(includeQueryParam: string, validIncludeOptions: string[]) {
    super();

    includeQueryParam.split(',').forEach((includeOption) => {
      if (!validIncludeOptions.includes(includeOption)) {
        throw new BadRequestException(
          `${includeOption} is not valid value for the 'include' query param`,
        );
      } else {
        Reflect.set(this, includeOption, true);
      }
    });
  }
}

export class PaginationDto {
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  skip: number = 0;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  take: number = 50;

  @IsOptional()
  @IsIn(['asc', 'desc'])
  orderBy: 'asc' | 'desc';
}

//estudiar
//validate nested
//metaprogramacion
//reflect
