import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { test } from '@prisma/client';
import { WebSocket } from 'ws';
import { InternalServerErrorException, Logger } from '@nestjs/common';
import { Data } from './data';

import fs from 'fs';

@WebSocketGateway()
export class DataGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
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

  afterInit(server: Server) {
    this.logger.log('Initialized WebSocket DataGateway!');
    //this.socketClient = new WebSocket('ws://localhost:8348/ws/connections');
  }
  handleConnection(client: Socket, ...args: any[]) {
    this.logger.log(`Client connected ${client.id}`);
  }
  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected ${client.id}`);
  }

  //@SubscribeMessage('ws/connections')
  startRecording(test: test) {
    try {
      this.socketClient = new WebSocket('ws://localhost:8348/ws/connections');

      console.log('startRecording');

      this.socketClient.on('open', () => {
        console.log('Inside Open');
      });

      this.socketClient.on('message', async (data, flags) => {
        const incomingDataBufferJson = data.toString('utf-8');
        const receiveData = JSON.parse(incomingDataBufferJson);
        const message: Data = receiveData.DataReceived;
        const date = new Date().toDateString().replace(/ /g, '_');

        const recordingPath = `public/recordings/${date}_${test.id}.txt`;
        const recordingTrial = `public/studies/test_${test.id}/trial_${date}.txt`;

        console.log(recordingPath);
        console.log(recordingTrial);

        if (!this.writeStream)
          this.writeStream = fs.createWriteStream(this.recordingPath, {
            flags: 'a+',
          });

        if (!this.trialWriteStream) {
          this.trialWriteStream = fs.createWriteStream(this.recordingTrial, {
            flags: 'a+',
          });
        }

        if (message) {
          this.messageNumber = message.buffer.Id;
          this.messageContent.push(Buffer.from(message.buffer.Data));
        }
      });

      this.socketClient.on('close', (code, reason) => {
        console.log('Closing connection');
        if (this.writeStream) this.writeStream.end();
        if (this.trialWriteStream) this.trialWriteStream.end();
        this.isRecording = false;
        this.isTrialRecording = false;
        this.writeStream = null;
        this.trialWriteStream = null;
      });
    } catch (e) {
      throw new InternalServerErrorException('Error with websocket client');
    }
  }

  stopRecording() {
    this.isRecording = false;
  }

  startRecordingTrial() {
    this.isTrialRecording = true;

    if (!this.trialWriteStream) {
      this.trialWriteStream = fs.createWriteStream(this.recordingTrial, {
        flags: 'a+',
      });
    }
  }

  stopRecordingTrial() {
    this.isTrialRecording = false;

    if (this.trialWriteStream) {
      this.trialWriteStream.end();
      this.trialWriteStream = null;
    }
  }

  async closeConnection() {
    this.socketClient.close();

    setTimeout(() => {
      if (
        this.socketClient.readyState === WebSocket.CLOSING ||
        this.socketClient.readyState === WebSocket.CLOSED
      ) {
        this.socketClient.terminate();
      }
    }, 5000);
  }
}
