const board = document.querySelector('.board')
const boxheight = 30;
const boxwidth = 30;
const modal = document.querySelector('.modal')
const strtbtn = document.querySelector('.btn-start')
let intervalId = null;
let timerintervalId = null;
const startgame = document.querySelector('.startgame')
const restartgame = document.querySelector('.restartgame')
const restartbtn = document.querySelector('.btn-restart')

const highscoreElement = document.querySelector("#High-score")
const scoreElement = document.querySelector("#score")
const timerElement = document.querySelector("#timer")

const upkey = document.querySelector(".up")
const  downkey= document.querySelector(".down")
const leftkey = document.querySelector(".left")
const rightkey = document.querySelector(".right")

let time = '00-00';

let score = 0;
let highscore = localStorage.getItem("highscoring") || 0;
highscoreElement.innerText = highscore;
const coloums = Math.floor(board.clientWidth / boxwidth);
const rows = Math.floor(board.clientHeight / boxheight);
let blocks = [];
let snake = [{
    x: 1,
    y: 3
}]

let food = { x: Math.floor(Math.random() * rows), y: Math.floor(Math.random() * coloums) };

function spawnFood() {
    let x, y;
    do {
        x = Math.floor(Math.random() * rows);
        y = Math.floor(Math.random() * coloums);
    } while (snake.some(s => s.x === x && s.y === y));
    food = { x, y };
}

function starttimer() {
    timerintervalId = setInterval(() => {
        let [min, sec] = time.split("-").map(Number);
        if (sec == 59) {
            min = min + 1;
            sec = 0;
        } else {
            sec = sec + 1;
        }
        time = `${min}-${sec}`
        timerElement.innerText = time;
    }, 1000)
}

for (let row = 0; row < rows; row++) {
    for (let coloum = 0; coloum < coloums; coloum++) {
        const block = document.createElement('div');
        block.classList.add('block');
        board.appendChild(block);
   
        blocks[`${row},${coloum}`] = block;
    }
}
let direction = 'left';
let directionQueue = [];

function setDirection(newDir) {
    const opposite = { up: 'down', down: 'up', left: 'right', right: 'left' };
    const lastDir = directionQueue.length > 0 ? directionQueue[directionQueue.length - 1] : direction;
    if (lastDir === newDir || lastDir === opposite[newDir]) return;
    directionQueue.push(newDir);
}

function rendersnake() {

    if (directionQueue.length > 0) {
        direction = directionQueue.shift();
    }

    let head = null
    blocks[`${food.x},${food.y}`].classList.add("food")
    if (direction === 'left') {
        head = { x: snake[0].x, y: snake[0].y - 1 }
    }
    else if (direction === 'right') {
        head = { x: snake[0].x, y: snake[0].y + 1 }
    }
    else if (direction === 'up') {
        head = { x: snake[0].x - 1, y: snake[0].y }
    }
    else if (direction === 'down') {
        head = { x: snake[0].x + 1, y: snake[0].y }
    }

    if (head.x < 0 || head.x >= rows || head.y < 0 || head.y >= coloums) {
        clearInterval(intervalId)
        clearInterval(timerintervalId)
        modal.style.display = "flex"
        startgame.style.display = "none"
        restartgame.style.display = "flex"
        return;
    }
    let selfcollision = snake.some(segment => head.x === segment.x && head.y === segment.y)

    if (selfcollision) {
        clearInterval(intervalId)
        clearInterval(timerintervalId)
        modal.style.display = "flex"
        startgame.style.display = "none"
        restartgame.style.display = "flex"
        return;
    }


    if (head.x === food.x && head.y === food.y) {

        blocks[`${food.x},${food.y}`].classList.remove("food")
        spawnFood()
        blocks[`${food.x},${food.y}`].classList.add("food")
        snake.unshift(head)

        score = score + 10;
        scoreElement.innerText = score;
        if (score > highscore) {
            highscore = score
            highscoreElement.innerText = highscore;
            localStorage.setItem("highscoring", highscore.toString())
        }
    }

    snake.forEach(segment => {
        blocks[`${segment.x},${segment.y}`].classList.remove("fill")
    })

    snake.unshift(head);
    snake.pop();

    snake.forEach(segment => {
        blocks[`${segment.x},${segment.y}`].classList.add("fill")

    })


}



strtbtn.addEventListener("click", () => {
    modal.style.display = 'none'
    intervalId = setInterval(() => { rendersnake(); }, 300);
    starttimer();



})
restartbtn.addEventListener("click", resgame)

function resgame() {

    clearInterval(intervalId)
    clearInterval(timerintervalId)
    time = '00-00'
    timerElement.innerText ="00-00"
     score = 0;
      scoreElement.innerText = score;
    highscoreElement.innerText = highscore;
    starttimer()


    blocks[`${food.x},${food.y}`].classList.remove("food");
    snake.forEach(segment => {
        blocks[`${segment.x},${segment.y}`].classList.remove("fill")
    })
    modal.style.display = "none"
    direction = 'down'
    directionQueue = []
    snake = [{ x: 1, y: 3 }]
    spawnFood()
    intervalId = setInterval(() => { rendersnake() }, 300);
}


addEventListener("keydown", (buttonkaname) => {
    if (buttonkaname.key === "ArrowUp") {
        setDirection("up")
    }
    else if (buttonkaname.key === "ArrowDown") {
        setDirection("down")
    }
    else if (buttonkaname.key === "ArrowRight") {
        setDirection("right")
    }
    else if (buttonkaname.key === "ArrowLeft") {
        setDirection("left")
    }
})

upkey.addEventListener("click", (e)=>{ e.preventDefault(); setDirection("up") });
downkey.addEventListener("click", (e)=>{ e.preventDefault(); setDirection("down") });
rightkey.addEventListener("click", (e)=>{ e.preventDefault(); setDirection("right") });
leftkey.addEventListener("click", (e)=>{ e.preventDefault(); setDirection("left") });
