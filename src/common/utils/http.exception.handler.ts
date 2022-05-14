import {
  BadRequestException,
  HttpException,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';

export function httpExceptionHandler(
  e: Error | Prisma.PrismaClientKnownRequestError,
): HttpException {
  let message = e.message;
  if (e instanceof Prisma.PrismaClientKnownRequestError) {
    if (e.code === 'P2002')
      throw new BadRequestException('There is a unique constraint violation');
    else if (e.code === 'P2025') throw new NotFoundException();
  }
  throw new InternalServerErrorException(message);
}
