class Pipe {
  x: number;
  y: number;
  h: number;
  w: number;
  topPipe: HTMLImageElement;
  bottomPipe: HTMLImageElement;
  random: number;
  scored: boolean;

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
    this.scored = false;
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
let score = 0;
let velocity = 0;

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
  ctx.save();
  ctx.translate(bird.x + bird.w / 2, bird.y + bird.h / 2);
  ctx.rotate(-Math.atan2(velocity, 10));
  if (bird.image)
    ctx.drawImage(bird.image, -bird.w / 2, -bird.h / 2, bird.w, bird.h);
  ctx.restore();
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

const handleKeyPress = (e: KeyboardEvent) => {
  if (e.key === 'ArrowUp' || e.key === ' ') {
    velocity = board.height/180;
  }
}

const update = () => {
  requestAnimationFrame(update);
  ctx.clearRect(0, 0, board.width, board.height);

  velocity -= board.height/4500;

  bird = {
    ...bird,
    y: bird.y - velocity,
  }

  drawBird();

  pipeArray.forEach(pipe => {
    pipe.x -= board.height/500;
    pipe.draw(ctx)
    if (pipe.x < bird.x && !pipe.scored) {
      score++;
      pipe.scored = true;
    }
    if (
      (bird.x > pipe.x - pipe.w/2 &&
      bird.x - bird.w/2 < pipe.x + pipe.w/2 &&
      (bird.y < pipe.h-pipe.random ||
      bird.y + bird.h > pipe.y + pipe.h - pipe.random + pipe.h/5)) ||
      bird.y < 0 ||
      bird.y + bird.h > board.height
    ) {
      // Collision detected, reset the game
      score = 0;
      velocity = 0;
      pipeArray = [];
      bird = {
        ...bird,
        x: board.width / 3,
        y: board.height / 2,
      };
      return; // Exit the forEach loop early since the game is reset
    }
  })
  
  ctx.fillStyle = "white";
  ctx.font = `bold ${board.height/20}px Arial`;
  ctx.fillText("Score: " + score, board.width * 0.01, board.height * 0.075);

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
  window.addEventListener('keypress', handleKeyPress)
}