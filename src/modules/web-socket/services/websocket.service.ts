import { HttpService } from '@nestjs/axios';
import { lastValueFrom, Observable } from 'rxjs';
import {
  HttpException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';

@Injectable()
export class WebsocketService {
  private baseUrl = 'http://127.0.0.1:8348/api/';
  private devicesUrl = this.baseUrl + 'devices/';
  private connectionsUrl = this.baseUrl + 'connections/';
  constructor(private httpService: HttpService) {}

  async validateResponseGetOrDelete(link: string) {
    const res = await lastValueFrom(this.httpService.get(link)).catch((e) => {
      throw new HttpException('Server Connection Error! ' + e.message, 405);
    });

    if (res.status === 200) return res.data;
    else throw new InternalServerErrorException();
  }

  async validateResponsePostOrPut(
    method: 'post' | 'put' | 'patch',
    link: string,
    data: any,
  ) {
    const res = await lastValueFrom(this.httpService[method](link, data)).catch(
      (e) => {
        throw new HttpException('Server Connection Error! ' + e.message, 405);
      },
    );
    if (res.status === 200) return res.data;
    else throw new InternalServerErrorException();
  }

  //devices
  listDevices(): Promise<Device[]> {
    return this.validateResponseGet(this.devicesUrl);
  }

  getDeviceDetails(id: string): Promise<Observable<Device[]>> {
    const link = this.devicesUrl + id;
    return this.validateResponseGet(link);
  }

  getDevicePing(id: string): Promise<boolean> {
    return this.validateResponseGet(`${this.devicesUrl + id}/ping`);
  }
  //end devices

  //connections
  listConnections() {
    return this.validateResponseGet(this.connectionsUrl);
  }
  getConnectionDetails(id: string): Promise<Observable<Device[]>> {
    const link = this.connectionsUrl + id;
    return this.validateResponseGet(link);
  }
  connectToDevice(params: { deviceId: string }) {
    const link = this.connectionsUrl;
    return this.validateResponsePostOrPut('post', link, params);
  }
  connectToFile(params: { deviceId: string }): Promise<any> {
    return this.validateResponsePostOrPut(
      'post',
      this.devicesUrl,
      params.deviceId,
    );
  }
  updateConnection(
    id: string,
    params: {
      polling: string;
      notifyBuffers: boolean;
      notifyImpedance: boolean;
      onlineImpedance: boolean;
      notifySnr: boolean;
    },
  ): Promise<any> {
    return this.validateResponsePostOrPut(
      'put',
      this.connectionsUrl + id,
      params,
    );
  }
  getRecordingBuffer(id: string): Promise<any> {
    return this.validateResponseGet(`${this.connectionsUrl + id}/buffer`);
  }
  getStreamRecording(id: string): Promise<any> {
    return this.validateResponseGet(`${this.connectionsUrl + id}/stream`);
  }
  getImpedance(id: string): Promise<any> {
    return this.validateResponseGet(`${this.connectionsUrl + id}/impedance`);
  }
  getSNR(id: string): Promise<any> {
    return this.validateResponseGet(`${this.connectionsUrl + id}/snr`);
  }
  updateStartRecording(
    id: string,
    params: {
      mode: 'Recording' | 'Impedance' | 'Calibration' | 'Autocalibration';
    },
  ): Promise<any> {
    return this.validateResponsePostOrPut(
      'patch',
      `${this.connectionsUrl + id}/start`,
      params,
    );
  }
  updateStopRecording(id: string): Promise<any> {
    return this.validateResponsePostOrPut(
      'patch',
      `${this.connectionsUrl + id}/stop`,
      {},
    );
  }
  deleteConnection(id: string) {
    return this.validateResponsePostOrPut(
      'patch',
      `${this.connectionsUrl + id}/start`,
      params,
    );
  }
  //end connections
}

export type Device = {
  Id: string;
  URI: string;
};

export interface ClientInput {
  TestId: number;
  DeviceId: string;
  Mode: string;
}

export type DeviceId = {
  deviceId: string;
};

export interface ApiUpdateConnectionInput {
  Polling: string;
  NotifyBuffers: boolean;
  NotifyImpedance: boolean;
  OnlineImpedance: boolean;
  NotifySnr: boolean;
}

export interface PythonScriptInput {
  HttpBaseUrlApi: string;
  BaseUrlWebSocket: string;
  BaseUrlOutWebSocket: string;
  ConnectionId: string;
  FrameRate: number;
  PollFrequency: number;
  RestartAfterFinishing: boolean;
}
