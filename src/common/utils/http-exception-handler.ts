import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
} from '@nestjs/common';
import { Response } from 'express';
import {
  PrismaClientKnownRequestError,
  PrismaClientValidationError,
} from '@prisma/client/runtime';

@Catch(
  PrismaClientKnownRequestError,
  PrismaClientValidationError,
  //ValidationError,
)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(
    exception:
      | HttpException
      | PrismaClientKnownRequestError
      | PrismaClientValidationError,
    host: ArgumentsHost,
  ) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    let status = 500;

    let message: string | object = exception.message;

    if (exception instanceof HttpException) {
      status = exception.getStatus();
    } else if (exception instanceof PrismaClientKnownRequestError) {
      if (exception.code === 'P2002') {
        status = 400;
        message = {
          error: 'Bad request! There is a unique constrain error.',
          ...exception.meta,
        };
      } else if (exception.code === 'P2025') {
        status = 404;
        message = {
          error: 'Not found!',
          meta: exception.message,
        };
      } else if (exception.code === 'P2011') {
        status = 400;
        message = exception;
      }
    } else {
      message = exception.message.replace(/[\n]/g, '');
      for (let i = 0; i < message.length; i++) {
        if (!message[i].startsWith('{')) {
          console.log(message);
          message = message.slice(1);
        } else break;
      }
    }
    response.status(status).json({
      statusCode: status,
      message:
        exception instanceof PrismaClientKnownRequestError
          ? message
          : exception.message,
    });
  }
}
