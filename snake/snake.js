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

// index = (y * width) + x
// coords from index -- y = index/10 (round down), x = index%10 (round down)

export { Snake, Board, Food };
