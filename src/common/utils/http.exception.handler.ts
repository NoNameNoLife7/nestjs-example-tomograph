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
import { ValidationError } from 'class-validator';

@Catch(
  PrismaClientKnownRequestError,
  PrismaClientValidationError,
  ValidationError,
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
      //message = exception.message;
    } else if (exception instanceof PrismaClientKnownRequestError) {
      if (exception.code === 'P2002') {
        status = 400;
        // message = 'There is a unique constraint violation';
      } else if (exception.code === 'P2025') {
        status = 404;
        //message = 'Not found!';
      } else if (exception.code === 'P2011') {
        status = 400;
      }
    } else {
      message = exception.message.replace(/[\n]/g, '');
      for (let i = 0; i < message.length; i++) {
        if (!message[i].startsWith('{')) {
          console.log(message);
          message = message.slice(1);
        } else break;
      }
      console.log(exception.stack);
    }

    console.log(typeof exception);
    response.status(status).json({
      statusCode: status,
      //error: exception,
      message:
        exception instanceof PrismaClientKnownRequestError
          ? exception.meta
          : exception,
    });
  }
}
