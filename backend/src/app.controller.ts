import { Controller, Get, Post, Render, Body } from '@nestjs/common';
import { AppService } from './app.service';
import { log } from 'console';

@Controller('api')
export class AppController {
  private rectanglePos = { x: 10, y: 10 };

  constructor(private readonly appService: AppService) {}
  @Get('data')
  getData(): string {
    console.log("Here is Data!");
    return this.appService.getData();
  }
  
  @Post('submit')
  handleFormSubmit(@Body('id') id: string): { message: string } {
    const message = `Received ID: ${id}`;
    return { message };
  }

  @Post(':id/move')
  moveRectangle(@Body() body: { x: number, y: number }): void {
    this.rectanglePos.x = body.x;
    this.rectanglePos.y = body.y;
    console.log(`Rectangle moved to: ${this.rectanglePos.x}, ${this.rectanglePos.y}`);
  }
}
