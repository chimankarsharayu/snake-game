const board = document.querySelector(".board");
const startButton = document.querySelector(".btn-start");
const modal = document.querySelector(".modal");
const startGameModal = document.querySelector(".start-game");
const gameOverModal = document.querySelector(".game-over");
const restartButton = document.querySelector(".btn-restart");
const hiScoreElement = document.querySelector("#high-score span");
const scoreElement = document.querySelector("#score span");
const timeElement = document.querySelector("#time span");

let highScore = localStorage.getItem("highScore") || 0;
let score = 0;
let time = "00:00";

const blockWidth = 30;
const blockHeight = 30;

const cols = Math.floor(board.clientWidth / blockWidth);
const rows = Math.floor(board.clientHeight / blockHeight);

let timeIntervalId = null;
const blocks = [];
let food = {
  x: Math.floor(Math.random() * rows),
  y: Math.floor(Math.random() * cols),
};

let snake = [
  { x: 5, y: 5 },
  { x: 5, y: 6 },
  { x: 5, y: 7 },
];
let direction = "right";
let interverId = null;

for (let i = 0; i < rows; i++) {
  for (let j = 0; j < cols; j++) {
    const block = document.createElement("div");
    block.classList.add("block");
    board.appendChild(block);
    blocks[`${i},${j}`] = block;
  }
}

function render() {
  let head = null;
  blocks[`${food.x},${food.y}`].classList.add("food");
  if (direction === "left") {
    head = { x: snake[0].x, y: snake[0].y - 1 };
  } else if (direction === "right") {
    head = { x: snake[0].x, y: snake[0].y + 1 };
  } else if (direction === "up") {
    head = { x: snake[0].x - 1, y: snake[0].y };
  } else if (direction === "down") {
    head = { x: snake[0].x + 1, y: snake[0].y };
  }

  if (head.x < 0 || head.x >= rows || head.y < 0 || head.y >= cols) {
    clearInterval(interverId);
    modal.style.display = "flex";
    startGameModal.style.display = "none";
    gameOverModal.style.display = "flex";
    return;
  }
  if (head.x === food.x && head.y === food.y) {
    blocks[`${food.x},${food.y}`].classList.remove("food");
    food = {
      x: Math.floor(Math.random() * rows),
      y: Math.floor(Math.random() * cols),
    };
    snake.unshift(head);
    blocks[`${food.x},${food.y}`].classList.add("food");
    score += 10;
    scoreElement.innerText = score;
    if (score > highScore) {
      highScore = score;
      localStorage.setItem("highScore", highScore.toString());
    }
  }
  snake.forEach((segment, index) => {
    const block = blocks[`${segment.x},${segment.y}`];
    if (block) {
      block.classList.remove("fill");
    }
  });
  snake.unshift(head);
  snake.pop();
  snake.forEach((segment, index) => {
    const block = blocks[`${segment.x},${segment.y}`];
    if (block) {
      block.classList.add("fill");
    }
  });
}

addEventListener("click", (event) => {
  if (event.target.classList.contains("btn-start")) {
    modal.style.display = "none";
    interverId = setInterval(() => {
      render();
    }, 100);
    timeIntervalId = setInterval(() => {
      const [minutes, seconds] = time.split(":").map(Number);
      let totalSeconds = minutes * 60 + seconds + 1;
      const newMinutes = Math.floor(totalSeconds / 60)
        .toString()
        .padStart(2, "0");
      const newSeconds = (totalSeconds % 60).toString().padStart(2, "0");
      time = `${newMinutes}:${newSeconds}`;
      timeElement.innerText = time;
    }, 1000);
  }
});

restartButton.addEventListener("click", restartGame);

function restartGame() {
  blocks[`${food.x},${food.y}`].classList.remove("food");
  snake.forEach((segment) => {
    const block = blocks[`${segment.x},${segment.y}`];
    if (block) {
      block.classList.remove("fill");
    }
  });
  score = 0;
  time = "00:00";
  scoreElement.innerText = score;
  timeElement.innerText = time;
  hiScoreElement.innerText = highScore;

  modal.style.display = "none";
  snake = [
    { x: 5, y: 5 },
    { x: 5, y: 6 },
    { x: 5, y: 7 },
  ];
  food = {
    x: Math.floor(Math.random() * rows),
    y: Math.floor(Math.random() * cols),
  };
  direction = "right";
  interverId = setInterval(() => {
    render();
  }, 100);
}

addEventListener("keydown", (event) => {
  if (event.key === "ArrowLeft" && direction !== "right") {
    direction = "left";
  } else if (event.key === "ArrowRight" && direction !== "left") {
    direction = "right";
  } else if (event.key === "ArrowUp" && direction !== "down") {
    direction = "up";
  } else if (event.key === "ArrowDown" && direction !== "up") {
    direction = "down";
  }
});
