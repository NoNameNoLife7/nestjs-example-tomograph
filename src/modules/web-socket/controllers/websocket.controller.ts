import {
  BadRequestException,
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { WebsocketService } from '../services/websocket.service';

@Controller('api')
export class WebsocketController {
  constructor(private readonly modelService: WebsocketService) {}

  //devices
  @Get('devices')
  listDevices() {
    return this.modelService.listDevices();
  }

  @Get('devices/:id')
  getDevice(@Param('id') id: string) {
    return this.modelService.getDeviceDetails(id);
  }

  @Get('devices/ping/:id')
  getDevicePing(@Param('id') id: string) {
    return this.modelService.getDevicePing(id);
  }
  //end devices

  //connections
  @Get('connections')
  listConnections() {
    return this.modelService.listConnections();
  }
  @Get('connections/:id')
  getConnection(@Param('id') id: string) {
    return this.modelService.getConnectionDetails(id);
  }
  @Post('connections')
  connectToDevice(@Body() params: { deviceId: string }) {
    if (!params.deviceId)
      throw new NotFoundException('Not found a deviceId in the params');
    return this.modelService.connectToDevice(params);
  }

  @Get('serverStatus')
  getServerStatus() {}

  @Put('updateConnection/{connectionId}')
  updateConnection() {}

  @Post('connectFile')
  connectToFile(@Body() params: { deviceId: string }) {
    const { deviceId } = params;
    if (!deviceId) throw new BadRequestException('An Id device is required!');
    return this.modelService.connectToFile(params);
  }

  @Post('start/websocketServer')
  startWebSocketServer() {}

  @Post('socketClient/startRecording')
  startRecording() {}
  @Post('socketClient/startMeasuringImpedance')
  startMeasuringImp() {}
  @Post('socketClient/startCalibration')
  startCalibration() {}
  @Post('socketClient/startAutocalibration')
  startAutocalibration() {}
  @Post('socketClient/:connectionId/stopRecording')
  stopRecording() {}
  @Post('socketClient/close')
  closeSocketClient() {}

  @Post('startPython/script')
  startPythonScript() {}
  @Post('stopPython/script')
  stopPythonScript() {}
}

// async function apiGetConnectionDetails(
//   request: Hapi.Request,
//   h: Hapi.ResponseToolkit,
// ) {
//   const Id = request.params.connectionId;

//   try {
//     const body = await got
//       .get(`http://127.0.0.1:8348/api/connections/${Id}`)
//       .json();

//     return h.response(body).code(200);
//   } catch (err) {
//     return h.response().code(500).message(err);
//   }
// }

// async function apiUpdateConnection(
//   request: Hapi.Request,
//   h: Hapi.ResponseToolkit,
// ) {
//   // Fetch payload from request
//   const payload = request.payload as ApiUpdateConnectionInput;
//   const Id = request.params.connectionId;

//   console.log(payload);

//   if (payload) {
//     const body = await got
//       .put(`http://127.0.0.1:8348/api/connections/${Id}`, {
//         json: payload,
//       })
//       .json();

//     return h.response(body).code(200);
//   }

//   return h.response('Payload not valid!').code(500);
// }

// async function apiStopRecording(
//   request: Hapi.Request,
//   h: Hapi.ResponseToolkit,
// ) {
//   // Fetch socket-client, prisma-client from server
//   const { client } = request.server.app;
//   // Fetch params
//   const connectionId = request.params.connectionId;

//   if (!client.isRecording) {
//     return h.response({ message: 'Server is not recording.' }).code(200);
//   }

//   try {
//     const body = await got
//       .patch(`http://127.0.0.1:8348/api/connections/${connectionId}/stop`, {
//         json: {},
//       })
//       .json();

//     client.stopRecording();

//     return h.response(body).code(200);
//   } catch (err) {
//     return h.response().code(500).message(err);
//   }
// }

// async function apiPatchCalls(request: Hapi.Request, h: Hapi.ResponseToolkit) {
//   // Fetch socket-client, prisma-client from server
//   const { client, prisma } = request.server.app;
//   // Fetch payload from request
//   const payload = request.payload as ClientInput;
//   // Fetch params
//   const connectionId = payload.DeviceId;
//   const testId = payload.TestId;
//   const mode = payload.Mode;

//   try {
//     if (!testId && mode === 'Recording') {
//       return h.response({ message: 'Test Identifier Missing!' }).code(400);
//     } else if (testId && mode === 'Recording') {
//       const test = await prisma.test.findUnique({
//         where: {
//           Id: payload.TestId,
//         },
//       });

//       if (client.isRecording) {
//         return h.response({ message: 'Already Recording!' }).code(200);
//       }

//       if (test && connectionId) {
//         console.log('found test');

//         client.startRecording(test);

//         const body = await got
//           .patch(
//             `http://127.0.0.1:8348/api/connections/${connectionId}/start`,
//             {
//               json: {
//                 mode: mode,
//               },
//             },
//           )
//           .json();

//         client.isRecording = true;

//         return h.response(body).code(200);
//       }

//       return h.response('Test Not Found!').code(400);
//     } else if (mode) {
//       const body = await got
//         .patch(`http://127.0.0.1:8348/api/connections/${connectionId}/start`, {
//           json: {
//             mode: mode,
//           },
//         })
//         .json();

//       return h.response(body).code(200);
//     }
//   } catch (err) {
//     console.log(err);
//     return h.response().code(500).message(err);
//   }
// }

// async function startPythonProcessingScript(
//   request: Hapi.Request,
//   h: Hapi.ResponseToolkit,
// ) {
//   // Fetch socket-client, prisma-client from server
//   const { client } = request.server.app;
//   // Fetch payload
//   const payload = request.payload as PythonScriptInput;

//   try {
//     if (!client.isPythonScriptRunning) {
//       const options = ['scripts/alexey.py'];

//       if (payload.ConnectionId) {
//         options.push(`--connection ${payload.ConnectionId}`);
//       }
//       if (payload.BaseUrlOutWebSocket) {
//         options.push(`--out ${payload.BaseUrlOutWebSocket}`);
//       }
//       client.pythonScript = spawn('py', options);

//       client.pythonScript.stdout.on('data', (data) => {
//         console.log(`stdout: ${data}`);
//       });

//       client.pythonScript.stderr.on('data', (data) => {
//         console.error(`stderr: ${data}`);
//         client.isPythonScriptRunning = false;
//       });

//       client.pythonScript.on('close', (code) => {
//         console.log(`child process exited with code ${code}`);
//         client.isPythonScriptRunning = false;
//       });

//       client.isPythonScriptRunning = true;

//       return h
//         .response()
//         .code(200)
//         .message('Python Script Successfully Created!');
//     } else {
//       return h.response().code(200).message('Python Script already running!');
//     }
//   } catch (e) {
//     console.log(`Error trying to run Python Script: ${e}`);
//     return h.response(e).code(500);
//   }
// }

// async function stopPythoScript(request: Hapi.Request, h: Hapi.ResponseToolkit) {
//   // Fetch socket-client, prisma-client from server
//   const { client } = request.server.app;

//   try {
//     if (client.isPythonScriptRunning && client.pythonScript) {
//       this.client.pythonScript.kill();
//       this.client.isPythonScriptRunning = false;

//       return h.response().code(200).message('Python Script Stop!');
//     } else {
//       return h.response().code(200).message('Python Script Not Running!');
//     }
//   } catch (e) {
//     console.log(`Error trying to run Python Script: ${e}`);
//     return h.response(e).code(500);
//   }
// }

// async function startWebSocketServer(
//   request: Hapi.Request,
//   h: Hapi.ResponseToolkit,
// ) {
//   // Fetch socket-client, prisma-client from server
//   const { server } = request.server.app;

//   try {
//     if (!server.socketServer) {
//       server.createServerObject();

//       return h.response().code(200).message('Socket Server Created!');
//     } else {
//       return h.response().code(200).message('Socket Server Already Running!');
//     }
//   } catch (error) {
//     console.log(`Error while trying to create WebSocketServer: ${error}`);
//     return h.response(error).code(500);
//   }
// }

// async function closeSocketConnection(
//   request: Hapi.Request,
//   h: Hapi.ResponseToolkit,
// ) {
//   // Fetch socket-client, prisma-client from server
//   const { client } = request.server.app;

//   try {
//     console.log('Closing Connection...');

//     if (client.socketClient && !client.isRecording) {
//       await client.closeConnection();
//     }

//     return h.response().code(200);
//   } catch (err) {
//     console.log(err);
//     return h.response().code(500).message(err);
//   }
// }

// async function getServerStatusHandler(
//   request: Hapi.Request,
//   h: Hapi.ResponseToolkit,
// ) {
//   // Fetch payload from request

//   try {
//     console.log('Inside getServerStatusHandler');

//     return h.response().code(200);
//   } catch (err) {
//     return h.response().code(500).message(err);
//   }
// }
