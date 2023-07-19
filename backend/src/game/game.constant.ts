
export const gameConstants = {
  canvasWidth: 800,
  canvasHeight: 600,
};

export const ballConstatns = {
  ballWidth: 20,
  ballHeight: 20,
  ballSpeed: 5,
  startPosition: {
    x: 400,
    y: 300,
  },
};

export const paddleConstants = {
  paddleWidth: 20,
  paddleHeight: 100,
  paddleSpeed: 5,
  player1StartPosition: {
    x: 100,
    y: 300,
  },
  player2StartPosition: {
    x: 700,
    y: 300,
  },
};

export const entityType = {
  BALL: 'ball',
  PADDLE: 'paddle',
  WALL: 'wall',
};
