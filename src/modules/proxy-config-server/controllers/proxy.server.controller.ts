import {
  Request,
  Body,
  Controller,
  Get,
  Post,
  Put,
  Req,
  Patch,
  Delete,
  UseFilters,
  InternalServerErrorException,
} from '@nestjs/common';
import axios, { Method, AxiosRequestConfig } from 'axios';
import { spawn } from 'child_process';

function proxyServer(e: any) {
  if (e instanceof Error) throw new InternalServerErrorException(e);
}

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
      console.log(e);
      throw new InternalServerErrorException(
        'The hardware service server is not running!',
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
  getSNR(@Req() request: Request, @Body() data: any) {
    return this.proxy(request, data);
  }

  @Patch('connections/:id/start')
  async updateModeConnection(
    @Req() request: Request,
    @Body()
    data: {
      mode: 'Recording' | 'Impedance' | 'Calibration' | 'Autocalibration';
    },
  ) {
    const pythonScript = spawn('py', ['EITProcessing/alexey.py']);
    console.log(pythonScript);
    pythonScript.stdout.on('data', (data) => {
      console.log(`stdout: ${data}`);
    });
    return this.proxy(request, data);
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
