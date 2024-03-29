// Variables
localStorage.setItem('maxScore', '0');
let canvas: HTMLCanvasElement;
let ctx: CanvasRenderingContext2D;
let score = 0;
let velocity = 0;
const jumpForce = 10;
const gravity = 0.6;
const maxVelocity = 8;
const pipeSpeed = 2;
const pipeGap = 150;
const canvasSize = {
  h: 640,
  w: 480,
}
const pipeSize = {
  h: 640,
  w: 80,
}
const placePipeInterval = 3000;
let bird: {
  x: number;
  y: number;
  w: number;
  h: number;
  path: string;
  image?: HTMLImageElement;
};
let pipeArray: Pipe[] = [];
let pipe: {
  x: number;
  y: number;
  h: number;
  w: number;
}

class Pipe {
  x: number;
  y: number;
  h: number;
  w: number;
  topPipe: HTMLImageElement;
  bottomPipe: HTMLImageElement;
  random: number;
  scored: boolean;

  constructor(x: number) {
    this.x = x;
    this.y = 0;
    this.h = pipeSize.h;
    this.w = pipeSize.w;
    this.topPipe = new Image();
    this.bottomPipe = new Image();
    this.topPipe.src = './assets/pipe-top.png';
    this.bottomPipe.src = './assets/pipe-bottom.png';
    this.random = Math.random() * (canvasSize.h * 0.6) + (canvasSize.h * 0.1) + pipeGap;
    this.topPipe.onload = () => {};
    this.bottomPipe.onload = () => {};
    this.scored = false;
  }

  draw = (ctx: CanvasRenderingContext2D) => {
    if (this.topPipe) {
      ctx.drawImage(this.topPipe, this.x, -this.random, this.w, this.h);
    }
    if (this.bottomPipe) {
      ctx.drawImage(this.bottomPipe, this.x, this.y + this.h - this.random + pipeGap, this.w, this.h);
    }
  }
}

const setCanvas = () => {
  clearCanvas();
  setCanvasDimensions();
  bird = {
    x: canvas.width/3,
    y: canvas.height/2,
    w: 54.4,
    h: 38.4,
    path: './assets/yellowbird-midflap.png',
  }
  loadBird();
  drawBird();
}

const resizeCanvas = () => {
  if (shouldResizeCanvas()) {
    clearCanvas();
    setCanvasDimensions();
    bird = {
      ...bird,
      x: canvas.width/3,
      y: canvas.height/2,
    }
    drawBird();
  }
}

const clearCanvas = () => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
}

const setCanvasDimensions = () => {
  canvas.height = canvasSize.h;
  canvas.width = Math.min(canvasSize.w, window.innerWidth);
}

const shouldResizeCanvas = () => {
  if (window.innerWidth > canvasSize.w) {
    return false;
  }
  return true;
}

const loadBird = () => {
  bird.image = new Image();
  bird.image.src = bird.path;
  bird.image.onload = () => {}
}

const drawBird = () => {
  ctx.save();
  ctx.translate(bird.x + bird.w / 2, bird.y + bird.h / 2);
  ctx.rotate(getBirdAngle());
  if (bird.image)
    ctx.drawImage(bird.image, -bird.w / 2, -bird.h / 2, bird.w, bird.h);
  ctx.restore();
}

const placePipe = () => {
  if (triggerStart) {
    let pipe = new Pipe(canvas.width);
    pipeArray.push(pipe);
  }
}

const applyGravity = () => {
  if (triggerStart){
    velocity -= gravity;
    velocity = Math.max(velocity, -maxVelocity);
    bird = {
      ...bird,
      y: bird.y - velocity,
    }
  }
}

const movePipe = (pipe: Pipe) => {
  pipe.x -= pipeSpeed;
}

const updateScoreOnPoint = (pipe: Pipe) => {
  if (pipe.x < bird.x && !pipe.scored) {
    score++;
    if (score > parseInt(localStorage.getItem('maxScore')!))
        localStorage.setItem('maxScore', score.toString());
    pipe.scored = true;
  }
}

const shouldReset = (pipe: Pipe) => {
  return (birdHitPipe(pipe) || birdOutOfBounds());
}

const reset = () => {
  score = 0;
  velocity = 0;
  triggerStart = false;
  pipeArray = [];
  bird = {
    ...bird,
    x: canvas.width / 3,
    y: canvas.height / 2,
  };
}

const birdOutOfBounds = () => {
  return (bird.y < 0 || bird.y + Math.sqrt((bird.h/2)*(bird.h/2) + (bird.w/2)*(bird.w/2)) > canvas.height);
}

const birdHitGround = () => {
  return (bird.y < 0);
}

const update = () => {
  counter++;
  requestAnimationFrame(update);
  clearCanvas();
  applyGravity();
  loadBird();
  drawBird();
  pipeArray.forEach(pipe => {
    movePipe(pipe);
    pipe.draw(ctx);
    updateScoreOnPoint(pipe);
    if (shouldReset(pipe)) {
      reset();
      return;
    }
  })
  drawScore();
}

// Handlers
const handleKeyPress = (e: KeyboardEvent) => {
  if (e.key === 'ArrowUp' || e.key === ' ') {
    velocity = jumpForce;
  }
}

const handleMouseClick = (e: MouseEvent) => {
  if (!triggerStart)
    triggerStart = true;
  velocity = jumpForce;
}

const handleTouchMove = (e: TouchEvent) => {
  e.preventDefault();
}

// Listeners
const addEventListeners = () => {
  window.addEventListener('resize', resizeCanvas);
  window.addEventListener('keypress', handleKeyPress);
  window.addEventListener('click', handleMouseClick);
  window.addEventListener('touchmove', handleTouchMove);
}

window.onload = () => {
  canvas = document.getElementById('board') as HTMLCanvasElement;
  ctx = canvas.getContext('2d')!;
  setCanvas();
  placePipe();
  setInterval(placePipe, placePipeInterval);
  requestAnimationFrame(update);
  addEventListeners();
}

const drawScore = () => {
  const text = '' + score;
  const x = canvas.width / 2; // Adjust the x-coordinate as needed
  const y = 50; // Adjust the y-coordinate as needed
  const fontSize = 40; // Adjust the font size as needed
  drawTextWithOutline(text, x, y, fontSize);
  drawTextWithOutline('Best: '  + Math.max(score, parseInt(localStorage.getItem('maxScore')!)), x-30, y+35, fontSize-15);
}

const drawTextWithOutline = (text: string, x: number, y: number, fontSize: number) => {
  ctx.font = 'bold ' + fontSize + 'px Arial';
  
  // Measure text height
  const textMetrics = ctx.measureText(text);
  const textHeight = textMetrics.actualBoundingBoxAscent + textMetrics.actualBoundingBoxDescent;
  
  // Calculate vertical position adjustment
  const yOffset = textMetrics.actualBoundingBoxAscent - textHeight / 2 + 2; // Adjust the offset here
  
  // Draw black outline
  ctx.strokeStyle = 'black';
  ctx.lineWidth = 5; // Increase the thickness here
  ctx.strokeText(text, x, y + yOffset);
  
  // Draw filled text
  ctx.fillStyle = 'white'; // or any other color for the inside of the letter
  ctx.fillText(text, x, y + yOffset);
}

const birdHitPipe = (pipe: Pipe) => {
  let isWithinPipeBounds = bird.x > pipe.x - pipe.w/2 &&
                              bird.x - bird.w/2 < pipe.x + pipe.w/2;
  let isOutidePipeGap = bird.y < pipe.h-pipe.random ||
                          bird.y + bird.h > pipe.y + pipe.h - pipe.random + pipeGap;
  return (isWithinPipeBounds && isOutidePipeGap);
}

let angle  = 0;
const getBirdAngle = () => {
    if (!triggerStart) {
        angle = 0;
        bird.path = counter % 14 < 7 ? pathUp : pathDown;
    } else if (velocity > -maxVelocity) {
        angle = -69.5;
        bird.path = counter % 14 < 7 ? pathUp : pathDown;
    } else {
        if (angle < -67.7) {
            bird.path = pathMid;
            console.log(angle);
            angle += 0.15;
        }
    }
    return angle;
}

const pathUp = './assets/yellowbird-upflap.png';
const pathMid = './assets/yellowbird-midflap.png';
const pathDown = './assets/yellowbird-downflap.png';
let triggerStart = false;
let counter = 0;