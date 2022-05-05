/*import { HttpException, HttpStatus } from '@nestjs/common';
import { Prisma } from '@prisma/client';*/
import { Type } from 'class-transformer';
import { IsIn, IsOptional } from 'class-validator';

export type WithPagination<T> = { data: T[]; count: number };

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
  //@Type(() => String)
  include: any; //fix

  where: any; //fix
}

// export function errorHandler(
//   e: Prisma.PrismaClientKnownRequestError | Error,
// ): void {
//   if (e instanceof Prisma.PrismaClientKnownRequestError)
//     throw new HttpException(e.message, HttpStatus.INTERNAL_SERVER_ERROR);
//   else throw new HttpException(e.message, 600);
// }

// let message: string;
// if (e.code === 'P2002')
//   message =
//     'There is a unique constrain violation, a new model cannot be created or updated';
// else if (e.code === 'P2003') message = 'Foreign key constraint failed on the field';
// else if (e.code === 'P2004')
//   message = 'A constraint failed on the database';
// else if (e.code === 'P2005')
//   message =
//     'The value stored in the database for the field ' +
//     attribute +
//     ' is invalid for the field';
// else if (e.code === 'P1008') message = 'Operations timed out after';
// else if (e.code === 'P1017') message = 'Server has closed the connection.';
// else message = 'More errors to complete!';
