const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

const GRID_HEIGHT = 200;
const GRID_WIDTH = 400;
const TILE_SIZE = 3;
const CANVAS_WIDTH = GRID_WIDTH * TILE_SIZE;
const CANVAS_HEIGHT = GRID_HEIGHT * TILE_SIZE;

canvas.width = CANVAS_WIDTH;
canvas.height = CANVAS_HEIGHT;

const initGrid = (width, height) => {
  const grid = new Array(width * height);
  grid.fill(0);
  return grid;
};

const render = grid => {
  canvas.width = CANVAS_WIDTH;

  for (let i = 0;i < GRID_HEIGHT;i += 1) {
    for (let j = 0;j < GRID_WIDTH;j += 1) {
      ctx.fillStyle = grid[(i * GRID_HEIGHT) + j] ? 'black' : 'white';
      ctx.fillRect(j * TILE_SIZE, i * TILE_SIZE, TILE_SIZE, TILE_SIZE);
    }
  }
};

const grid = initGrid(GRID_WIDTH, GRID_HEIGHT);
render(grid);
