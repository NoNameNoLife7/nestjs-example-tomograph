import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';
import { Response } from 'express';

@Catch(PrismaClientKnownRequestError)
export class PrismaExceptionFilter implements ExceptionFilter {
  catch(exception: PrismaClientKnownRequestError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    let status = 500;
    let message: string | { error: string } = exception.message;
    let error = exception.name;
    if (
      exception.code === 'P2002' ||
      exception.code === 'P2011' ||
      exception.code === 'P2004'
    ) {
      status = 400;
      error = 'Bad request exception!';
      const meta = exception.meta ? exception.meta['target'] : '';
      message =
        exception.code === 'P2002'
          ? `There is a unique constraint violation: ${meta}`
          : exception.code === 'P2011'
          ? (message = `Null constraint violation: ${meta}`)
          : (message = `A constraint failed on the database: ${meta}`);
    } else if (exception.code === 'P2025') {
      status = 404;
      error = 'Not found exception!';
      const meta = exception.meta ? exception.meta['cause'] : '';
      message = `${meta}`;
    }

    response.status(status).json({
      statusCode: status,
      message: message,
      error: error,
    });
  }
}

/*
400 Bad Request – client sent an invalid request, such as lacking required request body or parameter
401 Unauthorized – client failed to authenticate with the server
403 Forbidden – client authenticated but does not have permission to access the requested resource
404 Not Found – the requested resource does not exist
412 Precondition Failed – one or more conditions in the request header fields evaluated to false
500 Internal Server Error – a generic error occurred on the server
503 Service Unavailable – the requested service is not available
*/
