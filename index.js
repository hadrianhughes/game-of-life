const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

const GRID_HEIGHT = 75;
const GRID_WIDTH = 200;
const TILE_SIZE = 10;
const CANVAS_WIDTH = GRID_WIDTH * TILE_SIZE;
const CANVAS_HEIGHT = GRID_HEIGHT * TILE_SIZE;

canvas.width = CANVAS_WIDTH;
canvas.height = CANVAS_HEIGHT;
let isMouseDown = false;
let mouseX = 0;
let mouseY = 0;
let isMouseBlocked = false;
let lastXPos = 0;
let lastYPos = 0;

const handleMouse = (e, down, callback = () => {}) => {
  if (!down) isMouseBlocked = false;

  isMouseDown = down;
  callback(e);
};

const setMouseLocation = e => {
  mouseX = e.clientX;
  mouseY = e.clientY;
};

const initGrid = (width, height) => {
  const grid = new Array(width * height);
  grid.fill(0);
  return grid;
};

const update = grid => {
  const xPos = Math.floor(mouseX / TILE_SIZE);
  const yPos = Math.floor(mouseY / TILE_SIZE);
  const isSamePos = xPos === lastXPos && yPos === lastYPos;

  if (isMouseDown) {
    if (!isSamePos || !isMouseBlocked) {
      const gridIndex = xPos + (yPos * GRID_WIDTH);
      grid[gridIndex] = grid[gridIndex] ? 0 : 1;

      lastXPos = xPos;
      lastYPos = yPos;
      isMouseBlocked = true;
    }
  }
};

const render = grid => {
  canvas.width = CANVAS_WIDTH;

  for (let i = 0;i < GRID_HEIGHT;i += 1) {
    for (let j = 0;j < GRID_WIDTH;j += 1) {
      ctx.fillStyle = grid[j + (i * GRID_WIDTH)] ? 'black' : 'white';
      ctx.fillRect(j * TILE_SIZE, i * TILE_SIZE, TILE_SIZE, TILE_SIZE);
    }
  }
};

const loop = (fnRender, fnUpdate, grid) => {
  fnRender(grid);
  fnUpdate(grid);

  requestAnimationFrame(() => loop(fnRender, fnUpdate, grid));
};

const grid = initGrid(GRID_WIDTH, GRID_HEIGHT);

const handleMouseAndSetLocation = (e, down) => handleMouse(e, down, setMouseLocation);
const renderWithGrid = () => render(grid);

canvas.addEventListener('mousedown', e => handleMouseAndSetLocation(e, true));
canvas.addEventListener('mouseup', e => handleMouseAndSetLocation(e, false));
canvas.addEventListener('mousemove', setMouseLocation);

loop(render, update, grid);
