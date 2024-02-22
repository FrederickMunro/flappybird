var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
        this.scored = false;
    }
    return Pipe;
}());
// Variables
var board;
var ctx;
var score = 0;
var velocity = 0;
var bird;
var loadBird = function () {
    bird.image = new Image();
    bird.image.src = bird.path;
    bird.image.onload = function () { };
};
var drawBird = function () {
    ctx.save();
    ctx.translate(bird.x + bird.w / 2, bird.y + bird.h / 2);
    ctx.rotate(-Math.atan2(velocity, 10));
    if (bird.image)
        ctx.drawImage(bird.image, -bird.w / 2, -bird.h / 2, bird.w, bird.h);
    ctx.restore();
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
var handleKeyPress = function (e) {
    if (e.key === 'ArrowUp' || e.key === ' ') {
        velocity = board.height / 180;
    }
};
var handleMouseClick = function (e) {
    velocity = board.height / 180;
};
var handleTouchMove = function (e) {
    e.preventDefault();
};
var update = function () {
    requestAnimationFrame(update);
    ctx.clearRect(0, 0, board.width, board.height);
    velocity -= board.height / 4500;
    bird = __assign(__assign({}, bird), { y: bird.y - velocity });
    drawBird();
    pipeArray.forEach(function (pipe) {
        pipe.x -= board.height / 500;
        pipe.draw(ctx);
        if (pipe.x < bird.x && !pipe.scored) {
            score++;
            pipe.scored = true;
        }
        if ((bird.x > pipe.x - pipe.w / 2 &&
            bird.x - bird.w / 2 < pipe.x + pipe.w / 2 &&
            (bird.y < pipe.h - pipe.random ||
                bird.y + bird.h > pipe.y + pipe.h - pipe.random + pipe.h / 5)) ||
            bird.y < 0 ||
            bird.y + bird.h > board.height) {
            // Collision detected, reset the game
            score = 0;
            velocity = 0;
            pipeArray = [];
            bird = __assign(__assign({}, bird), { x: board.width / 3, y: board.height / 2 });
            return; // Exit the forEach loop early since the game is reset
        }
    });
    ctx.fillStyle = "white";
    ctx.font = "bold ".concat(board.height / 20, "px Arial");
    ctx.fillText("Score: " + score, board.width * 0.01, board.height * 0.075);
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
    window.addEventListener('keypress', handleKeyPress);
    window.addEventListener('click', handleMouseClick);
    window.addEventListener('touchmove', handleTouchMove);
};
