import { Paddle } from "./entity/paddle.entity";
import { Ball } from "./entity/ball.entity";
import { gameConstants } from "./game.constant";


export default class Game{

  constructor(
    private player1: Paddle,
    private player2: Paddle,
    private ball: Ball,
  ){
    this.player1 = new Paddle(true, 'player1');
    this.player2 = new Paddle(false, 'player2');
    this.ball = new Ball();
  }

  update(){
    this.ball.update(this.player1, this.player2);
  }

  gameLoop(){
    this.update();
    this.gameLoop();
  }
};