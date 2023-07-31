import { Entity } from "./entity";
import { entityType, paddleConstants, input } from "../game.constant";

export class Paddle extends Entity {
  key: Array<boolean>;
  playerId: string;
  score: number;

  constructor( playerType: boolean, playerId: string) {
    super(paddleConstants.paddleWidth, paddleConstants.paddleHeight);
    this.entityType = playerType ? entityType.SUPER : entityType.CHALLENGER;
    this.speed = paddleConstants.paddleSpeed;
    this.x = playerType ? paddleConstants.player1StartPosition.x : paddleConstants.player2StartPosition.x;
    this.y = playerType ? paddleConstants.player1StartPosition.y : paddleConstants.player2StartPosition.y;
    this.dx = 0;
    this.dy = 0;
    this.key = [];
    this.playerId = playerId;
    this.score = 0;
  };

  update(key: string){
    const isUp: boolean = key === input.UP ? true : false;
    const isDown: boolean = key === input.DOWN ? true : false;
    if (isUp && this.y > 0){
      this.dy = -1;
    } else if (isDown && this.y + this.height < 600){
      this.dy = 1;
    } else {
      this.dy = 0;
    }
    this.y += this.dy * this.speed;
  }

  toDto(){
    return {
      ...super.toDto(),
      playerId: this.playerId,
      score: this.score,
    }
  }
}
