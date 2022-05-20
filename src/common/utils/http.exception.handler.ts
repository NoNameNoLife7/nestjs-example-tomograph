import { ArgumentsHost, ExceptionFilter, HttpException } from '@nestjs/common';
import { Response } from 'express';
import {
  PrismaClientKnownRequestError,
  PrismaClientValidationError,
} from '@prisma/client/runtime';

export class HttpExceptionFilter implements ExceptionFilter {
  catch(
    exception:
      | HttpException
      | PrismaClientKnownRequestError
      | PrismaClientValidationError,
    host: ArgumentsHost,
  ) {
    console.log(typeof exception);
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    let status = 500;

    let message = exception.message;

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      message = exception.message;
    } else if (exception instanceof PrismaClientKnownRequestError) {
      if (exception.code === 'P2002') {
        status = 400;
        message = 'There is a unique constraint violation';
      } else if (exception.code === 'P2025') {
        status = 404;
        message = 'Not found!';
      }
    } else {
      message = exception.message;
    }
    response.status(status).json({
      statusCode: status,
      message: message,
    });
  }
}
