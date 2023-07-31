import { Entity } from "./entity";
import { entityType, gameConstants, ballConstatns } from "../game.constant";
import { Paddle } from "./paddle.entity";

export class Ball extends Entity {
  
  constructor() {
    super(ballConstatns.ballWidth, ballConstatns.ballHeight);

    const randomDirection = Math.random() * 2 - 1;

    this.entityType = entityType.BALL;
    this.speed = ballConstatns.ballSpeed;
    this.x = ballConstatns.startPosition.x;
    this.y = ballConstatns.startPosition.y;

    if (randomDirection < 0) {
      this.dx = -1;
    } else {
      this.dx = 1;
    }
    this.dy = 1;
  };

  update(player1: Paddle, player2: Paddle){
    this.x += this.dx * this.speed;
    this.y += this.dy * this.speed;

    // check collision with walls
    if (this.y + this.height > gameConstants.canvasHeight || this.y < 0) {
      this.dy = -this.dy;
    } else if (this.x + this.width > gameConstants.canvasWidth) {
      this.ballReset();
      ++player1.score;
    } else if (this.x < 0) {
      this.ballReset();
     ++player2.score;
    }

    // check collision with paddles
    // if (this.x <= player1.x + player1.width || this.x >= player2.x + player2.width) {
    //   this.dx = -this.dx;
    // }
    if ((this.x <= player1.x + player1.width) && (this.y + this.height >= player1.y && this.y <= player1.y + player1.height)) {
      this.dx = -this.dx;
    }
    else if ((this.x >= player2.x) && (this.y + this.height >= player2.y && this.y <= player2.y + player2.height)) {
      this.dx = -this.dx;
    }
  }

  ballReset(){
    this.x = ballConstatns.startPosition.x;
    this.y = ballConstatns.startPosition.y;

    const randomDirection = Math.random() * 2 - 1;
    if (randomDirection < 0) {
      this.dx = -1;
    } else {
      this.dx = 1;
    }
    this.dy = 1;
  }

  toDto(){
    return {
      ...super.toDto(),
    }
  }
}