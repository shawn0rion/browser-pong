// load canvas
const canvas = document.getElementById("game");
const context = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// define game variables
const paddleWidth = 18,
  paddleHeight = 120,
  paddleSpeed = 8,
  ballRadius = 12,
  initialBallSpeed = 8,
  maxBallSpeed = 40,
  netWidth = 5,
  netColor = "WHITE";

function drawNet() {
  for (let i = 0; i <= canvas.height; i += 15) {
    drawRect(canvas.width / 2 - netWidth / 2, i, netWidth, 10, netColor);
  }
}

function drawRect(x, y, width, height, color) {
  context.fillStyle = color;
  context.fillRect(x, y, width, height);
}
function drawCircle(x, y, radius, color) {
  context.fillStyle = color;
  context.beginPath();
  context.arc(x, y, radius, 0, Math.PI * 2, true);
  context.closePath();
  context.fill();
}
function drawText(
  text,
  x,
  y,
  color,
  fontSize = 60,
  fontWeight = "bold",
  font = "Space Mono"
) {
  context.fillStyle = color;
  context.font = `${fontWeight} ${fontSize}px ${font}`;
  context.texAlign = "center";
  context.fillText(text, x, y);
}

function createPaddle(x, y, width, height, color) {
  return { x, y, width, height, color, score: 0 };
}

// create ball, return  object
function createBall(x, y, radius, velocityX, velocityY) {
  return { x, y, radius, velocityX, velocityY, speed: initialBallSpeed };
}

// start DEFINE OBJECTS

const ball = createBall(
  canvas.width / 2,
  canvas.height / 2,
  ballRadius,
  initialBallSpeed,
  initialBallSpeed
);

const player = createPaddle(
  0,
  canvas.height / 2 - paddleHeight / 2,
  paddleWidth,
  paddleHeight,
  "WHITE"
);

const computer = createPaddle(
  canvas.width - paddleWidth,
  canvas.height / 2 - paddleHeight / 2,
  paddleWidth,
  paddleHeight,
  "WHITE"
);

// end DEFINE OBJECTS

// reset ball
function resetBall() {
  // set in center
  // random height
  ball.x = canvas.width / 2;
  // change direction
  ball.y = (canvas.height - ball.radius * 2) * Math.random() + ball.radius;
  ball.velocityX *= -1;
  ball.speed = initialBallSpeed;
}

canvas.addEventListener("mousemove", movePaddle);
// move paddle
function movePaddle(event) {
  const rect = canvas.getBoundingClientRect();
  player.y = event.clientY - rect.top - player.height / 2;
}

// collision
// this function check if the ball is in the bounds of the paddle
function checkCollision(ball, paddle) {
  return (
    ball.x < paddle.x + paddle.width &&
    ball.x + ball.radius > paddle.x &&
    ball.y < paddle.y + paddle.height &&
    ball.y + ball.radius > paddle.y
  );
}

// update
function update() {
  //

  // check for score and reset ball if necessary
  if (ball.x - ball.radius < 0) {
    computer.score++;
    resetBall();
  } else if (ball.x + ball.radius > canvas.width) {
    player.score++;
    resetBall();
  }

  // increase x by xvelocity
  // increase y by yvelocity
  ball.x += ball.velocityX;
  ball.y += ball.velocityY;

  // move computer paddle
  computer.y += (ball.y - (computer.y + computer.height / 2)) * 0.1;

  /// if ball hits top or bottom of canvas, then reverse y velocity
  if (ball.y + ball.radius > canvas.height || ball.y - ball.radius < 0) {
    ball.velocityY *= -1;
  }

  // determine which is being hit and handle collision
  let paddle = ball.x < canvas.width / 2 ? player : computer;

  // if collision, then
  if (checkCollision(ball, paddle)) {
    const collidePoint = ball.y - (paddle.y + paddle.height / 2);
    const collisionAngle = (Math.PI / 4) * (collidePoint / (paddle.height / 2));
    const direction = ball.x + ball.radius < canvas.width / 2 ? 1 : -1;
    ball.velocityX = direction * ball.speed * Math.cos(collisionAngle);
    ball.velocityY = ball.speed * Math.sin(collisionAngle);

    // increase ball speed
    ball.speed += 0.2;
    if (ball.speed > maxBallSpeed) {
      ball.speed = maxBallSpeed;
    }
  }
}

function render() {
  // clear canvas with black screen
  drawRect(0, 0, canvas.width, canvas.height, "BLACK");
  drawNet();

  // draw score
  drawText(player.score, canvas.width / 4, canvas.height / 2);

  drawText(computer.score, (canvas.width / 4) * 3, canvas.height / 2);

  drawRect(player.x, player.y, player.width, player.height, player.color);
  drawRect(
    computer.x,
    computer.y,
    computer.width,
    computer.height,
    computer.color
  );

  drawCircle(ball.x, ball.y, ball.radius, ball.color);
}

// game loop
function gameLoop() {
  console.log("loop");
  update();
  render();
  console.log(ball.x);
}

//define objects
const fps = 60;
setInterval(gameLoop, 1000 / fps);
console.log(ball, player, computer);
