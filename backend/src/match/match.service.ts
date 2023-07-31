import { Injectable } from '@nestjs/common';
import { Socket } from 'socket.io';
import { Interval } from '@nestjs/schedule';

@Injectable()
export class MatchService {
  getData(): string {
	return 'Data!';
  }

  @Interval(1000)
  handleInterval() {
    console.log('Called every second');
  }
}