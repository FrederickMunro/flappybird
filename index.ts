class Pipe {
  x: number;
  y: number;
  h: number;
  w: number;
  topPipe: HTMLImageElement;
  bottomPipe: HTMLImageElement;
  random: number;

  constructor(x: number, y: number, w: number, h: number) {
    this.x = x;
    this.y = y;
    this.h = h;
    this.w = w;
    this.topPipe = new Image();
    this.bottomPipe = new Image();
    this.topPipe.src = './assets/pipe-top.png';
    this.bottomPipe.src = './assets/pipe-bottom.png';
    this.random = Math.random()*(this.h-100);
    this.topPipe.onload = () => {};
    this.bottomPipe.onload = () => {};
  }

  draw = (ctx: CanvasRenderingContext2D) => {
    if (this.topPipe) {
      ctx.drawImage(this.topPipe, this.x, -this.random, this.w, this.h);
    }
    if (this.bottomPipe) {
      ctx.drawImage(this.bottomPipe, this.x, this.y + this.h - this.random + this.h/5, this.w, this.h);
    }
  }
}

// Variables
let board: HTMLCanvasElement;
let ctx: CanvasRenderingContext2D;

let bird: {
  x: number;
  y: number;
  w: number;
  h: number;
  image?: HTMLImageElement;
  path: string;
};

const loadBird = () => {
  bird.image = new Image();
  bird.image.src = bird.path;
  bird.image.onload = () => {}
}

const drawBird = () => {
  if (bird.image)
    ctx.drawImage(bird.image, bird.x, bird.y, bird.w, bird.h);
}

let pipe: {
  x: number;
  y: number;
  h: number;
  w: number;
}

let pipeArray: Pipe[] = [];

const resizeCanvas = () => {
  ctx.clearRect(0, 0, board.width, board.height);
  pipeArray= [];
  board.height = window.innerHeight;
  board.width = window.innerWidth;
  bird = {
    x: board.width/3,
    y: board.height/2,
    w: board.height/15,
    h: ((board.height/15)/17)*12, // ratio 17:12
    path: './assets/yellowbird-midflap.png',
  }
  loadBird();
  drawBird();
}

const update = () => {
  requestAnimationFrame(update);
  ctx.clearRect(0, 0, board.width, board.height);

  drawBird();

  pipeArray.forEach(pipe => {
    pipe.x -= board.height/500;
    pipe.draw(ctx)
  })
}

const placePipe = () => {
  let pipe = new Pipe(board.width, 0, (board.height/1.2)/8, board.height/1.2);
  pipeArray.push(pipe);
}

window.onload = () => {
  board = document.getElementById('board') as HTMLCanvasElement;
  ctx = board.getContext('2d')!;

  resizeCanvas();

  placePipe();
  setInterval(placePipe, board.height*2);
  requestAnimationFrame(update);

  // Add event listener for window resize
  window.addEventListener('resize', resizeCanvas);
}