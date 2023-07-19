
export class Entity {
  width: number;
  height: number;
  x: number;
  y: number;
  dx: number;
  dy: number;
  entityType: string;
  speed : number;

  constructor(w: number, h: number) {
    this.width = w;
    this.height = h;
  };
  // draw(context: CanvasRenderingContext2D) {
  //   context.fillStyle = "#fff";
  //   context.fillRect(this.x, this.y, this.width, this.height);
  // }
}