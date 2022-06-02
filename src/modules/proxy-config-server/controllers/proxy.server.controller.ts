import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  Param,
  Patch,
  Post,
  Put,
  Req,
  Request,
} from '@nestjs/common';
import axios, { AxiosRequestConfig, Method } from 'axios';
import { spawn } from 'child_process';

const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));

@Controller('proxy')
export class ProxyServerController {
  async proxy(request: Request, data: any) {
    try {
      const axiosConfig: AxiosRequestConfig = {
        url: request.url.slice('/proxy/'.length),
        method: request.method as Method,
        baseURL: 'http://localhost:8348/api',
        data,
      };
      return (await axios.request(axiosConfig)).data;
    } catch (e) {
      throw new HttpException(
        'Error communicating with hardware service!',
        503,
      );
    }
  }

  @Get('devices')
  listDevices(@Req() request: Request, @Body() data: any) {
    return this.proxy(request, data);
  }

  @Get('devices/:id')
  getDevice(@Req() request: Request, @Body() data: any) {
    return this.proxy(request, data);
  }

  @Get('devices/:id/ping')
  getDevicePing(@Req() request: Request, @Body() data: any) {
    return this.proxy(request, data);
  }
  // end devices

  // connections
  @Get('connections')
  listConnections(@Req() request: Request, @Body() data: any) {
    return this.proxy(request, data);
  }
  @Get('connections/:id')
  getConnectionDetails(@Req() request: Request, @Body() data: any) {
    return this.proxy(request, data);
  }
  @Post('connections')
  connectToDevice(@Req() request: Request, @Body() data: any) {
    return this.proxy(request, data);
  }

  @Put('connections/:id')
  updateConnection(
    @Req() request: Request,
    @Body()
    data: {
      polling?: string;
      notifyBuffers?: boolean;
      notifyImpedance?: boolean;
      onlineImpedance?: boolean;
      notifySnr?: boolean;
    },
  ) {
    return this.proxy(request, data);
  }

  @Get('connections/:id/buffer')
  getRecordingBuffer(@Req() request: Request, @Body() data: any) {
    return this.proxy(request, data);
  }

  @Get('connections/:id/stream')
  getStreamData(@Req() request: Request, @Body() data: any) {
    return this.proxy(request, data);
  }
  @Get('connections/:id/impedance')
  getImpedance(@Req() request: Request, @Body() data: any) {
    return this.proxy(request, data);
  }
  @Get('connections/:id/snr')
  async getSNR(
    @Param('id') id: string,
    @Req() request: Request,
    @Body() data: any,
  ) {
    await delay(2500);
    return this.proxy(request, data);
  }

  @Patch('connections/:id/start')
  async updateModeConnection(
    @Param('id') id: string,
    @Req() request: Request,
    @Body()
    data: {
      mode: 'Recording' | 'Impedance' | 'Calibration' | 'Autocalibration';
    },
  ) {
    try {
      const arrayArgs = [
        'EITProcessing/alexey.py',
        `--connection`,
        id,
        '--out',
        'localhost:3003',
      ];
      const pythonScript = spawn('py', arrayArgs);
      pythonScript.stdout.on('data', (data) => {
        console.log(`stdout: ${data}`);
      });
      pythonScript.stdout.on('data', (data) => {
        console.log(`stdout: ${data}`);
      });
      pythonScript.stderr.on('data', (data) => {
        console.error(`stderr: ${data}`);
      });
      pythonScript.on('close', (code) => {
        console.log(`child process exited with code ${code}`);
      });

      return this.proxy(request, data);
    } catch (e) {
      throw new HttpException('Error processing python script', 500);
    }
  }
  @Patch('connections/:id/stop')
  stopModeConnection(@Req() request: Request, @Body() data: any) {
    return this.proxy(request, data);
  }

  @Delete('connections/:id')
  async disconnect(@Req() request: Request, @Body() data: any) {
    const res = await this.proxy(request, data);
    if (res.code === 404) return res;
    return 'Disconnected successfully';
  }

  @Delete('connections')
  async disconnectAll(@Req() request: Request, @Body() data: any) {
    const res = await this.proxy(request, data);
    if (res.code === 404) return res;
    return 'Close All connections';
  }
  //end connections
}
