import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';

@Catch(HttpException, PrismaClientKnownRequestError)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(
    exception: HttpException | PrismaClientKnownRequestError,
    host: ArgumentsHost,
  ) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    let status = 500;
    let message = 'Error';
    if (exception instanceof HttpException) {
      status = exception.getStatus();
      message = exception.message;
    } else {
      if (exception.code === 'P2002') {
        status = 405;
        message = 'There is a unique constraint violation';
      } else if (exception.code === 'P2025') {
        status = 404;
        message = 'Not found!';
      }
    }
    response.status(status).json({
      statusCode: status,
      message: message,
      timestamp: new Date().toISOString(),
      path: request.url,
    });
  }
}
