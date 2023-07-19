import { Entity } from "./entity";
import { entityType, paddleConstants } from "../game.constant";

export class Paddle extends Entity {
  key: Array<boolean>;

  constructor(w: number, h: number, playerType: boolean) {
    super(w, h);
    this.entityType = entityType.PADDLE;
    this.speed = paddleConstants.paddleSpeed;
    this.x = playerType ? paddleConstants.player1StartPosition.x : paddleConstants.player2StartPosition.x;
    this.y = playerType ? paddleConstants.player1StartPosition.y : paddleConstants.player2StartPosition.y;
    this.dx = 0;
    this.dx = 1;
    this.key = [];
  };

  update(){
  }
}