const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

const buttons = {
  reset: document.getElementById('js-btn-reset'),
  step: document.getElementById('js-btn-step'),
  play: document.getElementById('js-btn-play'),
  speed: document.getElementById('js-btn-speed')
};

const GRID_HEIGHT = 75;
const GRID_WIDTH = 100;
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

let grid = [];

const FRAME_RATE = 2;
const FAST_FRAME_RATE = 10;
let playing = false;
let fast = false;

const togglePlaying = () => {
  playing = !playing;
  buttons.play.innerHTML = playing ? 'Stop' : 'Play';
  buttons.step.disabled = playing;
};

const setSpeed = () => {
  fast = !fast;
  buttons.speed.innerHTML = fast ? 'Slow' : 'Fast';
};

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
  grid = new Array(width * height);
  grid.fill(0);
};

const step = () => {
  const newGrid = grid.slice();

  for (let i = 0;i < GRID_HEIGHT;i += 1) {
    for (let j = 0;j < GRID_WIDTH;j += 1) {
      const atTop = i === 0;
      const atBottom = i === GRID_HEIGHT - 1;
      const atLeft = j % GRID_WIDTH === 0;
      const atRight = (j + 1) % GRID_WIDTH === 0;

      let neighbourCount = 0;

      if (!atLeft) neighbourCount += grid[(j - 1) + (i * GRID_WIDTH)];
      if (!atRight) neighbourCount += grid[(j + 1) + (i * GRID_WIDTH)];
      if (!atTop) neighbourCount += grid[j + ((i - 1) * GRID_WIDTH)];
      if (!atBottom) neighbourCount += grid[j + ((i + 1) * GRID_WIDTH)];

      if (!atLeft && !atBottom) neighbourCount += grid[(j - 1) + ((i + 1) * GRID_WIDTH)];
      if (!atLeft && !atTop) neighbourCount += grid[(j - 1) + ((i - 1) * GRID_WIDTH)];
      if (!atRight && !atBottom) neighbourCount += grid[(j + 1) + ((i + 1) * GRID_WIDTH)];
      if (!atRight && !atTop) neighbourCount += grid[(j + 1) + ((i - 1) * GRID_WIDTH)];

      if (neighbourCount < 2 || neighbourCount > 3) newGrid[j + (i * GRID_WIDTH)] = 0;
      if (neighbourCount === 3) newGrid[j + (i * GRID_WIDTH)] = 1;
    }
  }

  grid = newGrid;
};

let lastTime = Date.now();
const update = () => {
  const newTime = Date.now();

  const frameRate = fast ? FAST_FRAME_RATE : FRAME_RATE;
  if (playing && newTime - lastTime >= 1000 / frameRate) {
    step();
    lastTime = newTime;
  }

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

const render = () => {
  canvas.width = CANVAS_WIDTH;

  for (let i = 0;i < GRID_HEIGHT;i += 1) {
    for (let j = 0;j < GRID_WIDTH;j += 1) {
      ctx.fillStyle = grid[j + (i * GRID_WIDTH)] ? 'black' : 'white';
      ctx.fillRect(j * TILE_SIZE, i * TILE_SIZE, TILE_SIZE, TILE_SIZE);
    }
  }
};

const loop = () => {
  render();
  update();

  requestAnimationFrame(loop);
};

const initGridWithSize = () => initGrid(GRID_WIDTH, GRID_HEIGHT);
const handleMouseAndSetLocation = (e, down) => handleMouse(e, down, setMouseLocation);
const renderWithGrid = () => render();

canvas.addEventListener('mousedown', e => handleMouseAndSetLocation(e, true));
canvas.addEventListener('mouseup', e => handleMouseAndSetLocation(e, false));
canvas.addEventListener('mousemove', setMouseLocation);

buttons.reset.addEventListener('click', initGridWithSize);
buttons.step.addEventListener('click', step);
buttons.play.addEventListener('click', togglePlaying);
buttons.speed.addEventListener('click', setSpeed);

initGridWithSize();
loop();
