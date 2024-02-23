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
// Variables
var canvas;
var ctx;
var score = 0;
var velocity = 0;
var jumpForce = 4;
var gravity = 0.1;
var maxVelocity = 4;
var pipeSpeed = 1.5;
var pipeGap = 150;
var canvasSize = {
    h: 640,
    w: 480,
};
var pipeSize = {
    h: 640,
    w: 80,
};
var placePipeInterval = 3000;
var bird;
var pipeArray = [];
var pipe;
var Pipe = /** @class */ (function () {
    function Pipe(x) {
        var _this = this;
        this.draw = function (ctx) {
            if (_this.topPipe) {
                ctx.drawImage(_this.topPipe, _this.x, -_this.random, _this.w, _this.h);
            }
            if (_this.bottomPipe) {
                ctx.drawImage(_this.bottomPipe, _this.x, _this.y + _this.h - _this.random + pipeGap, _this.w, _this.h);
            }
        };
        this.x = x;
        this.y = 0;
        this.h = pipeSize.h;
        this.w = pipeSize.w;
        this.topPipe = new Image();
        this.bottomPipe = new Image();
        this.topPipe.src = './assets/pipe-top.png';
        this.bottomPipe.src = './assets/pipe-bottom.png';
        this.random = Math.random() * (canvasSize.h * 0.6) + (canvasSize.h * 0.2);
        this.topPipe.onload = function () { };
        this.bottomPipe.onload = function () { };
        this.scored = false;
    }
    return Pipe;
}());
var setCanvas = function () {
    clearCanvas();
    setCanvasDimensions();
    bird = {
        x: canvas.width / 3,
        y: canvas.height / 2,
        w: 54.4,
        h: 38.4,
        path: './assets/yellowbird-midflap.png',
    };
    loadBird();
    drawBird();
};
var resizeCanvas = function () {
    if (shouldResizeCanvas()) {
        clearCanvas();
        setCanvasDimensions();
        bird = __assign(__assign({}, bird), { x: canvas.width / 3, y: canvas.height / 2, path: './assets/yellowbird-midflap.png' });
        drawBird();
    }
};
var clearCanvas = function () {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
};
var setCanvasDimensions = function () {
    canvas.height = canvasSize.h;
    canvas.width = Math.min(canvasSize.w, window.innerWidth);
};
var shouldResizeCanvas = function () {
    if (window.innerWidth > canvasSize.w) {
        return false;
    }
    return true;
};
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
var placePipe = function () {
    var pipe = new Pipe(canvas.width);
    pipeArray.push(pipe);
};
var applyGravity = function () {
    velocity -= gravity;
    velocity = Math.max(velocity, -maxVelocity);
    bird = __assign(__assign({}, bird), { y: bird.y - velocity });
};
var movePipe = function (pipe) {
    pipe.x -= pipeSpeed;
};
var updateScoreOnPoint = function (pipe) {
    if (pipe.x < bird.x && !pipe.scored) {
        score++;
        pipe.scored = true;
    }
};
var shouldReset = function (pipe) {
    return (birdHitPipe(pipe) || birdOutOfBounds());
};
var reset = function () {
    score = 0;
    velocity = 0;
    pipeArray = [];
    bird = __assign(__assign({}, bird), { x: canvas.width / 3, y: canvas.height / 2 });
};
var birdHitPipe = function (pipe) {
    return (bird.x > pipe.x - pipe.w / 2 &&
        bird.x - bird.w / 2 < pipe.x + pipe.w / 2 &&
        (bird.y < pipe.h - pipe.random ||
            bird.y + bird.h > pipe.y + pipe.h - pipe.random + pipe.h / 5));
};
var birdOutOfBounds = function () {
    return (bird.y < 0 || bird.y + bird.h > canvas.height);
};
var update = function () {
    requestAnimationFrame(update);
    clearCanvas();
    applyGravity();
    loadBird();
    drawBird();
    pipeArray.forEach(function (pipe) {
        movePipe(pipe);
        pipe.draw(ctx);
        updateScoreOnPoint(pipe);
        if (shouldReset(pipe))
            reset();
        return;
    });
    drawScore();
};
// Handlers
var handleKeyPress = function (e) {
    if (e.key === 'ArrowUp' || e.key === ' ') {
        velocity = jumpForce;
    }
};
var handleMouseClick = function (e) {
    velocity = jumpForce;
};
var handleTouchMove = function (e) {
    e.preventDefault();
};
// Listeners
var addEventListeners = function () {
    window.addEventListener('resize', resizeCanvas);
    window.addEventListener('keypress', handleKeyPress);
    window.addEventListener('click', handleMouseClick);
    window.addEventListener('touchmove', handleTouchMove);
};
window.onload = function () {
    canvas = document.getElementById('board');
    ctx = canvas.getContext('2d');
    setCanvas();
    placePipe();
    setInterval(placePipe, placePipeInterval);
    requestAnimationFrame(update);
    addEventListeners();
};
var drawScore = function () {
    var text = '' + score;
    var x = canvas.width / 2; // Adjust the x-coordinate as needed
    var y = 50; // Adjust the y-coordinate as needed
    var fontSize = 40; // Adjust the font size as needed
    drawTextWithOutline(text, x, y, fontSize);
};
var drawTextWithOutline = function (text, x, y, fontSize) {
    ctx.font = 'bold ' + fontSize + 'px Arial';
    // Measure text height
    var textMetrics = ctx.measureText(text);
    var textHeight = textMetrics.actualBoundingBoxAscent + textMetrics.actualBoundingBoxDescent;
    // Calculate vertical position adjustment
    var yOffset = textMetrics.actualBoundingBoxAscent - textHeight / 2 + 2; // Adjust the offset here
    // Draw black outline
    ctx.strokeStyle = 'black';
    ctx.lineWidth = 5; // Increase the thickness here
    ctx.strokeText(text, x, y + yOffset);
    // Draw filled text
    ctx.fillStyle = 'white'; // or any other color for the inside of the letter
    ctx.fillText(text, x, y + yOffset);
};
