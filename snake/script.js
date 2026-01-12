import { Snake, Board, Food } from "./snake.js";

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
