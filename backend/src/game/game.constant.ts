
export const gameConstants = {
  canvasWidth: 600,
  canvasHeight: 600,
};

export const ballConstatns = {
  ballWidth: 40,
  ballHeight: 40,
  ballSpeed: 5,
  startPosition: {
    x: gameConstants.canvasWidth / 2,
    y: gameConstants.canvasHeight / 2,
  },
};

export const paddleConstants = {
  paddleWidth: 20,
  paddleHeight: 300,
  paddleSpeed: 20,
  player1StartPosition: {
    x: 20,
    y: (gameConstants.canvasHeight - 300) / 2,
  },
  player2StartPosition: {
    x: gameConstants.canvasWidth - 20,
    y: (gameConstants.canvasHeight - 300) / 2,
  },
};

export const entityType = {
  BALL: 'ball',
  SUPER: 'super',
  CHALLENGER: 'challenger',
  WALL: 'wall',
};

export const input = {
  UP: 'up',
  DOWN: 'down',
};

export const keyMap = {
  key : [
    {key : 'a', input: input.UP},
    {key : 'z', input: input.DOWN},
  ],
}