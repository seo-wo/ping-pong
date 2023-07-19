import { Entity } from "./entity";
import { entityType, gameConstants, ballConstatns } from "../game.constant";
import { Paddle } from "./paddle.entity";

export class Ball extends Entity {
  
  constructor(w: number, h: number) {
    super(w, h);

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
      this.x = ballConstatns.startPosition.x;
      /*
        player1 score increment
      */
    } else if (this.x < 0) {
      this.x = ballConstatns.startPosition.x;
      /*
        player2 score increment
      */
    }

    // check collision with paddles
    if (this.x <= player1.x + player1.width || this.x >= player2.x + player2.width) {
      this.dx = -this.dx;
    }
  }
}