import { ArgumentsHost, Catch, HttpException } from '@nestjs/common';
import { BaseWsExceptionFilter, WsException } from '@nestjs/websockets';

@Catch(WsException, HttpException)
export class WebsocketExceptionsFilter extends BaseWsExceptionFilter {
  catch(exception: WsException | HttpException, host: ArgumentsHost) {
    super.catch(exception, host);
    const client = host.switchToWs().getClient() as WebSocket;
    const data = host.switchToWs().getData();
    const error =
      exception instanceof WsException
        ? exception.getError()
        : exception.getResponse();
    const details = error instanceof Error ? error.message : { message: error };
    client.send(
      JSON.stringify({
        event: 'Error',
        data: {
          id: (client as any).id,
          rid: data.rid,
          details,
        },
      }),
    );
  }
}
