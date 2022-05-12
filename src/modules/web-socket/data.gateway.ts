import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  WsException,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { test } from '@prisma/client';
import {
  InternalServerErrorException,
  Logger,
  UseFilters,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { Data } from './data';

import fs from 'fs';
import { WebsocketExceptionsFilter } from 'src/common/utils/websocket.exception.filter';

@WebSocketGateway({ path: '/ws/connections' })
@UseFilters(WebsocketExceptionsFilter)
@UsePipes(new ValidationPipe({ transform: true }))
export class DataGateway {
  @WebSocketServer()
  server: Server;

  private socketClient: WebSocket;

  private logger: Logger = new Logger('DataGateway');

  private writeStream: any;
  private trialWriteStream: any;
  private recordingPath: string;
  private recordingTrial: string;
  private messageContent: Buffer[];
  private messageNumber: number;

  private isRecording: boolean;
  private isTrialRecording: boolean;

  constructor() {
    this.messageNumber = 0;
    this.messageContent = [];
    this.isRecording = false;
    this.isTrialRecording = false;
    this.writeStream = null;
  }

  @SubscribeMessage('connections')
  startRecording(data) {
    console.log('startRecording');
    try {
      this.isRecording = true;
    } catch (e) {
      console.log('error startRecording');
      throw new WsException(e);
    }
  }
  @SubscribeMessage('open')
  open() {
    console.log('open');
  }

  @SubscribeMessage('message')
  message() {
    console.log('open');
  }
}