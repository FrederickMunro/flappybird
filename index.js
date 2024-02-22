var Pipe = /** @class */ (function () {
    function Pipe(x, y, w, h) {
        var _this = this;
        this.draw = function (ctx) {
            if (_this.topPipe) {
                ctx.drawImage(_this.topPipe, _this.x, -_this.random, _this.w, _this.h);
            }
            if (_this.bottomPipe) {
                ctx.drawImage(_this.bottomPipe, _this.x, _this.y + _this.h - _this.random + _this.h / 5, _this.w, _this.h);
            }
        };
        this.x = x;
        this.y = y;
        this.h = h;
        this.w = w;
        this.topPipe = new Image();
        this.bottomPipe = new Image();
        this.topPipe.src = './assets/pipe-top.png';
        this.bottomPipe.src = './assets/pipe-bottom.png';
        this.random = Math.random() * (this.h - 100);
        this.topPipe.onload = function () { };
        this.bottomPipe.onload = function () { };
    }
    return Pipe;
}());
// Variables
var board;
var ctx;
var bird;
var loadBird = function () {
    bird.image = new Image();
    bird.image.src = bird.path;
    bird.image.onload = function () { };
};
var drawBird = function () {
    if (bird.image)
        ctx.drawImage(bird.image, bird.x, bird.y, bird.w, bird.h);
};
var pipe;
var pipeArray = [];
var resizeCanvas = function () {
    ctx.clearRect(0, 0, board.width, board.height);
    pipeArray = [];
    board.height = window.innerHeight;
    board.width = window.innerWidth;
    bird = {
        x: board.width / 3,
        y: board.height / 2,
        w: board.height / 15,
        h: ((board.height / 15) / 17) * 12,
        path: './assets/yellowbird-midflap.png',
    };
    loadBird();
    drawBird();
};
var update = function () {
    requestAnimationFrame(update);
    ctx.clearRect(0, 0, board.width, board.height);
    drawBird();
    pipeArray.forEach(function (pipe) {
        pipe.x -= board.height / 500;
        pipe.draw(ctx);
    });
};
var placePipe = function () {
    var pipe = new Pipe(board.width, 0, (board.height / 1.2) / 8, board.height / 1.2);
    pipeArray.push(pipe);
};
window.onload = function () {
    board = document.getElementById('board');
    ctx = board.getContext('2d');
    resizeCanvas();
    placePipe();
    setInterval(placePipe, board.height * 2);
    requestAnimationFrame(update);
    // Add event listener for window resize
    window.addEventListener('resize', resizeCanvas);
};
