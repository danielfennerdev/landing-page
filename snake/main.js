class Snake {
  body = [
    [9, 6],
    [10, 6],
  ];

  head = [11, 6];

  move(direction) {
    this.body.push(this.head);
    let prevHead = this.head;
    let prevHeadX = prevHead[0];
    let prevHeadY = prevHead[1];
    switch (direction) {
      case "n":
        this.head = [prevHeadX, (prevHeadY - 1 + 12) % 12];
        break;
      case "e":
        this.head = [(prevHeadX + 1) % 21, prevHeadY];
        break;
      case "s":
        this.head = [prevHeadX, (prevHeadY + 1) % 12];
        break;
      case "w":
        this.head = [(prevHeadX - 1 + 21) % 21, prevHeadY];
        break;
    }
    this.body.shift();
  }

  extendBody() {
    this.body.unshift(this.body[0]);
  }

  print() {
    console.log(this.body[0][1], this.body[1][1], this.head[1]);
  }
}

class Board {
  width = 21;
  height = 12;
  grid = Array(this.width * this.height).fill(null);
  food = this.placeFood();
  score = 0;

  input = "e";
  currentDirection = "e";

  coordToIndex(x, y) {
    return y * this.width + x;
  }

  coordFromIndex(index) {
    let y = Math.floor(index / this.width);
    let x = Math.floor(index % this.width);
    return [x, y];
  }

  updateSnake(snake) {
    this.grid.fill(null);
    snake.move(this.input);

    // After the snake moves, record the direction that was used so
    // input validation compares against the actual movement direction.
    this.currentDirection = this.input;

    let foodIndex = this.coordToIndex(this.food[0], this.food[1]);
    this.grid[foodIndex] = "food";

    snake.body.forEach((bodyPart) => {
      let bodyIndex = this.coordToIndex(bodyPart[0], bodyPart[1]);
      this.grid[bodyIndex] = "body";
    });

    let headIndex = this.coordToIndex(snake.head[0], snake.head[1]);

    if (this.grid[headIndex] === "body") return "dead";
    if (this.grid[headIndex] === "food") {
      this.updateScore(snake);
      console.log(this.score);
      this.food = this.placeFood();
      snake.extendBody();
    }
    this.grid[headIndex] = "head";
  }

  lastInput(keypress) {
    this.input = keypress;
  }

  placeFood() {
    let index = Math.floor(Math.random() * (this.width * this.height));
    while (this.grid[index] !== null) {
      index = Math.floor(Math.random() * (this.width * this.height));
    }
    return this.coordFromIndex(index);
  }

  updateScore(snake) {
    this.score = this.score + (snake.body.length + 1);
  }

  updateInput(keypress) {
    const oppositeDirections = { n: "s", e: "w", s: "n", w: "e" };
    // Prevent reversing into the snake by rejecting inputs that are
    // opposite of the current movement direction. We compare against
    // `currentDirection` (the direction used for the most recent move)
    // so multiple rapid keypresses between frames cannot chain into
    // an immediate 180° reversal.
    if (keypress !== oppositeDirections[this.currentDirection]) {
      this.input = keypress;
    }
  }

  restart(snake) {
    snake.body = [
      [9, 6],
      [10, 6],
    ];
    snake.head = [11, 6];
    this.grid = Array(this.width * this.height).fill(null);
    this.food = this.placeFood();
    this.score = 0;
    this.input = "e";
  }
}

class Food {}

// Main game logic
const snake = new Snake();
const board = new Board();
const score = document.getElementById("score-display");
const modal = document.querySelector("modal");
const startButton = document.getElementById("start-button");

// define key inputs
document.addEventListener("keydown", (event) => {
  const keyName = event.key;

  switch (keyName) {
    case "w":
      board.updateInput("n");
      break;
    case "a":
      board.updateInput("w");
      break;
    case "s":
      board.updateInput("s");
      break;
    case "d":
      board.updateInput("e");
      break;
  }
});

function renderBoard() {
  const container = document.getElementById("board-container");
  container.innerHTML = "";

  board.grid.forEach((slot, index) => {
    const square = document.createElement("div");
    square.classList.add("square");

    if (slot === "head") {
      square.classList.add("head");
    }

    if (slot === "body") {
      square.classList.add("body");
    }

    if (slot === "food") {
      square.classList.add("food");
    }

    container.appendChild(square);
  });

  score.textContent = `${board.score}`;
}

let lastTime = 0;
const speed = 150;
let paused = true;

function gameLoop(currentTime) {
  const deltaTime = currentTime - lastTime;

  if (deltaTime > speed && paused === false) {
    if (board.updateSnake(snake) === "dead") {
      modal.textContent = "";
      const gameOverMessage = document.createElement("h3");
      gameOverMessage.textContent = "Game Over!";
      modal.appendChild(gameOverMessage);
      const finalScoreMessage = document.createElement("p");
      finalScoreMessage.textContent = "Your final score was: ";
      modal.appendChild(finalScoreMessage);
      const scoreValue = document.createElement("h1");
      scoreValue.textContent = board.score;
      modal.appendChild(scoreValue);
      const restartButton = document.createElement("button");
      restartButton.textContent = "Restart Game";
      restartButton.addEventListener("click", () => {
        modal.style.display = "none";
        board.restart(snake);
        paused = false;
        renderBoard();
      });
      modal.appendChild(restartButton);
      paused = true;
      modal.style.display = "flex";
    }
    renderBoard();
    lastTime = currentTime;
  }

  requestAnimationFrame(gameLoop);
}

// Start the loop
requestAnimationFrame(gameLoop);

renderBoard();

startButton.addEventListener("click", () => {
  modal.style.display = "none";
  board.restart(snake);
  paused = false;
  renderBoard();
});