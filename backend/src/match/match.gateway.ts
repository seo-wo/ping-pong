import { 
  WebSocketGateway,
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketServer,
  OnGatewayInit,
  SubscribeMessage,
  ConnectedSocket,
  MessageBody,
} from '@nestjs/websockets';
import { Interval } from '@nestjs/schedule';
import { MatchService } from './match.service';
import { Socket, Server, Namespace } from 'socket.io';
import { Paddle } from '../game/entity/paddle.entity';
import { Ball } from '../game/entity/ball.entity';

@WebSocketGateway(3002, {namespace: 'match', cors:true})
export class MatchGateway
  implements OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit
{
  @WebSocketServer()
  private server: Server;
  private rooms: any;

  constructor(
    private matchService: MatchService,
    private roomStatus: Map<string, boolean>,
    private paddles: Map<string, Paddle>,
    private balls: Map<string, Ball>,
    private intervals: Map<string, NodeJS.Timeout>,
  ) {
    this.roomStatus = new Map<string, boolean>();
  }

  afterInit(server: any) {
    this.server = server;
    this.rooms = server.adapter.rooms;
    console.log('MatchGateway Init', server.adapter.rooms);
    
  }

  handleConnection(client: any, ...args: any[]) {
    console.log(`Client ${client.id} connected`);
  }

  handleDisconnect(client: any) {
    clearInterval(this.intervals.get(client.id));
  }

  @SubscribeMessage('pressCreate')
  handleRoomCreate(
    @ConnectedSocket() client: Socket,
    @MessageBody() roomID: string,
  ) {
    if (this.rooms.has(roomID)) {
      console.log('Room already exists');
      client.emit('roomExist', 'Room already exists');
      return;
    }
    client.join(roomID);
    this.roomStatus.set(roomID, false);
    this.paddles.set(client.id, new Paddle(true, client.id));
    console.log(`Client ${client.id} created room ${roomID}`);
  }

  @SubscribeMessage('pressJoin')
  hadleRoomJoin(
    @ConnectedSocket() client: Socket,
    @MessageBody() roomID: string,
  ) 
  {
    if (this.rooms.has(roomID) && this.rooms.get(roomID).size === 1) {
      client.join(roomID);
      const user1 = Array.from(this.rooms.get(roomID))[0];
      const user2 = Array.from(this.rooms.get(roomID))[1];
      this.paddles.set(client.id, new Paddle(false, client.id));
      this.balls.set(roomID, new Ball());
      console.log('Now Room is Full', roomID);
      this.rooms.get(roomID).forEach((socketID: string) => {
        this.server.to(socketID).emit('gameInit',
        this.paddles.get(user1 as string).toDto(),
        this.paddles.get(user2 as string).toDto(),
        this.balls.get(roomID).toDto(),
        );
      });
      this.rooms.get(roomID).forEach((socketID: string) => {
        this.server.to(socketID).emit('roomLocked', roomID, user1, user2);
      });
      this.roomStatus.set(roomID, true);
    }
    else if (this.rooms.has(roomID) && this.rooms.get(roomID).size === 2) {
      console.log('Room is already Full');
      client.emit('roomFull', 'Room is Full');
    }
    else {
      console.log('Room does not exist');
    }
  }

  @SubscribeMessage('pressGameStart')
  handleGameStart(
    @ConnectedSocket() client: Socket,
    @MessageBody() roomID: string,
  ) {
    console.log('pressGameStart', roomID);
    this.rooms.get(roomID).forEach((socketID: string) => {
      console.log(this.paddles.get(socketID).toDto());
      this.server.to(socketID).emit('gameStarted');
    })
    
    const ball: Ball = this.balls.get(roomID);
    const user1: string = Array.from(this.rooms.get(roomID))[0] as string;
    const user2: string = Array.from(this.rooms.get(roomID))[1] as string;
    const paddle1: Paddle = this.paddles.get(user1);
    const paddle2: Paddle = this.paddles.get(user2);
    this.intervals.set(roomID, setInterval(() => {
      this.handleInterval(ball, paddle1, paddle2);
    }, 1000/60));
  }

  handleInterval(ball: Ball, paddle1: Paddle, paddle2: Paddle) {
    ball.update(paddle1, paddle2);
    this.server.to(paddle1.playerId).emit('updateBall', ball.toDto());
    this.server.to(paddle2.playerId).emit('updateBall', ball.toDto());
  }

  @SubscribeMessage('keydown')
  handleKeyDown(
    @ConnectedSocket() client: Socket,
    @MessageBody() payload: any,
  ) {
    const socketID = client.id;
    const paddle = this.paddles.get(socketID);
    // const ball = this.balls.get(payload.roomID);
  
    if (payload.key === 'up'){
      paddle.update('up');
    }
    else if (payload.key === 'down'){
      paddle.update('down');
    }
    // ball.update(this.paddles.get(payload.user1), this.paddles.get(payload.user2))
    console.log(client.id,'keydown', payload.key, paddle.y);
    this.rooms.get(payload.roomID).forEach((socketID: string) => {
      this.server.to(socketID).emit('updatePosition', paddle.toDto());
    });
  }
}
