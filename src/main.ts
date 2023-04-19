import { FIELD_SIZE, FIGURE_SPEED, RECT_SIZE } from "./common/constants";
import { Figure } from "./Figure";
const canv = <HTMLCanvasElement>document.getElementById('canvas');
const ctx = canv.getContext('2d');

canv.width = FIELD_SIZE.W;
canv.height = FIELD_SIZE.H;

const drawNet = () => {
  ctx!.lineWidth = 2;
  field[0].forEach((_, ind) => {
    ctx!.strokeStyle = "#000000";
    ctx!.beginPath();
    ctx!.moveTo(ind * RECT_SIZE, 0);
    ctx!.lineTo(ind * RECT_SIZE, FIELD_SIZE.H);
    ctx!.stroke();
    ctx!.closePath();
  })
  field.forEach((_, ind) => {
    ctx!.strokeStyle = "#000000";
    ctx!.beginPath();
    ctx!.moveTo(0, ind * RECT_SIZE);
    ctx!.lineTo(FIELD_SIZE.W, ind * RECT_SIZE);
    ctx!.stroke();
    ctx!.closePath();
  })
}

const generateRect = (x: number, y: number, w: number, h: number) => {
  ctx!.fillStyle = "#009900";
  ctx!.fillRect(x, y, w, h);

  ctx!.strokeStyle = "#0000ff";
  ctx!.lineWidth = 4;
  ctx!.strokeRect(x, y, w, h);
}

let figuresCbs: (() => void)[] = [];

const field: boolean[][] = new Array(FIELD_SIZE.H / RECT_SIZE).fill(FIELD_SIZE.W / RECT_SIZE).map(() => (new Array(FIELD_SIZE.W / RECT_SIZE).fill(false)));

const createFigure = () => {
  const currentFigure = new Figure();
  const { data, height, weight } = currentFigure
  let x = 0;
  let y = 0;
  let over = false;
  let keysPressed = new Set<string>();

  const linstenerKeydown = (evt: KeyboardEvent) => {
    keysPressed.add(evt.code);
  }

  const linstenerKeyup = (evt: KeyboardEvent) => {
    keysPressed.delete(evt.code);
  }

  document.addEventListener('keydown', linstenerKeydown)
  document.addEventListener('keyup', linstenerKeyup)

  let defaultTimeDelay = 1000;
  let timerDefault = Date.now();

  let moveTimeDelay = 100;
  let moveDownTimeDelay = 20;
  let timerLeft = Date.now();
  let timerRight = Date.now();
  let timerDown = Date.now();
  let timerRotate = Date.now();

  const cb = () => {
    const isUnderDisallow = data.some((rect) => {
      const yInd = ((y + rect.data.y) / RECT_SIZE) + 1;
      const xInd = ((x + rect.data.x) / RECT_SIZE);


      if ([yInd, xInd].some((coord) => coord >= field.length || coord < 0 || !Number.isInteger(coord))) return false;
      
      return field[yInd][xInd];
    })
    const isYCoordInField = y < FIELD_SIZE.H - height;
    
    if (isYCoordInField && !isUnderDisallow) {
      if (Date.now() - timerDefault > defaultTimeDelay) {
        y += RECT_SIZE; 
        timerDefault = Date.now();
      }
    } else if (!over) {
      document.removeEventListener('keydown', linstenerKeydown)
      document.removeEventListener('keyup', linstenerKeyup)
      data.forEach((rect) => {
        const yInd = ((y + rect.data.y) / RECT_SIZE);
        const xInd = ((x + rect.data.x) / RECT_SIZE);
        if (field[yInd]) field[yInd][xInd] = true;
      })
      figuresCbs.push(createFigure());
      over = true;
    }

    // Handle keyboard events
    if (keysPressed.has('ArrowLeft')) {
      const isLeftAllow = data.every((rect) => {
        const yInd = ((y + rect.data.y) / RECT_SIZE);
        const xInd = ((x + rect.data.x) / RECT_SIZE) - 1;
        return xInd >= 0 && field[yInd] && !field[yInd][xInd];
      })
      if (isLeftAllow && Date.now() - timerLeft > moveTimeDelay) {
        x -= RECT_SIZE;
        timerLeft = Date.now();
      }
    }
    if (keysPressed.has('ArrowRight')) {
      const isRightAllow = data.every((rect) => {
        const yInd = ((y + rect.data.y) / RECT_SIZE);
        const xInd = ((x + rect.data.x) / RECT_SIZE) + 1;
        return xInd < field[0].length && field[yInd] && !field[yInd][xInd];
      })
      if (isRightAllow && Date.now() - timerRight > moveTimeDelay) {
        x += RECT_SIZE;
        timerRight = Date.now();
      }
    }
    
    if (keysPressed.has('ArrowDown')) {
        const isUnderAllow = data.every((rect) => {
          const yInd = ((y + rect.data.y) / RECT_SIZE) + 1;
          const xInd = ((x + rect.data.x) / RECT_SIZE);
          return yInd < field.length && xInd < field[0].length && field[yInd] && !field[yInd][xInd];
        })
        if (isUnderAllow && Date.now() - timerDown > moveDownTimeDelay) {
          y += RECT_SIZE;
          timerDown = Date.now();
        }
    }

    const rotate = () => {
      const oldX1 = data[0].data.x;
      const oldY1 = data[0].data.y;
      const oldX2 = data[1].data.x;
      const oldY2 = data[1].data.y;
      const oldX3 = data[2].data.x;
      const oldY3 = data[2].data.y;
      const oldX4 = data[3].data.x;
      const oldY4 = data[3].data.y;

      const centerX = (oldX1 + oldX2 + oldX3 + oldX4) / 4;
      const centerY = (oldY1 + oldY2 + oldY3 + oldY4) / 4;

      const newX1 = centerX + (oldY1 - centerY);
      const newY1 = centerY - (oldX1 - centerX);

      const newX2 = centerX + (oldY2 - centerY);
      const newY2 = centerY - (oldX2 - centerX);

      const newX3 = centerX + (oldY3 - centerY);
      const newY3 = centerY - (oldX3 - centerX);

      const newX4 = centerX + (oldY4 - centerY);
      const newY4 = centerY - (oldX4 - centerX);
      console.log(centerX)
      data[0].data.x = newX1 % 40 === 0 ? newX1 : newX1 - 20;
      data[0].data.y = newY1 % 40 === 0 ? newY1 : newY1 - 20;
      data[1].data.x = newX2 % 40 === 0 ? newX2 : newX2 - 20;
      data[1].data.y = newY2 % 40 === 0 ? newY2 : newY2 - 20;
      data[2].data.x = newX3 % 40 === 0 ? newX3 : newX3 - 20;
      data[2].data.y = newY3 % 40 === 0 ? newY3 : newY3 - 20;
      data[3].data.x = newX4 % 40 === 0 ? newX4 : newX4 - 20;
      data[3].data.y = newY4 % 40 === 0 ? newY4 : newY4 - 20;
    }

    if (keysPressed.has('ArrowUp')) {
      if (Date.now() - timerRotate > 100) {
        rotate();

        timerRotate = Date.now();
      }
    }

    data.forEach((rect) => {
      generateRect(x + rect.data.x, y + rect.data.y, rect.data.size, rect.data.size)
    })
  }

  return cb;
}

figuresCbs.push(createFigure());
function render () {
  requestAnimationFrame(render);
  ctx?.clearRect(0, 0, canv.width, canv.height);
  drawNet();
  
  figuresCbs.forEach((cb) => cb());
}

requestAnimationFrame(render);

export {};