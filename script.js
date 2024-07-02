const totalMines = document.getElementById("mines");
const buttons = document.getElementById("buttons");
const hintButton = document.getElementById("hint_btn");
const flagButton = document.getElementById("flag_btn");
const replay = document.getElementById("replay");
const hours = document.getElementById("hrs");
const minutes = document.getElementById("min");
const seconds = document.getElementById("sec");
const cellContainer = document.getElementById("cell_container");
const gameOverScreen = document.getElementById("game_over");
const gameWinScreen = document.getElementById("game_win");
const playerTime = document.getElementById("your_time");
const bestTime = document.getElementById("best_time");
const start = document.getElementById("start");
const help = document.getElementById("info_container");
const gameArea = document.getElementById("game_area");
const information = document.getElementById("info_container");
const settingButton = document.getElementById("setting_btn");

let eventListnersALreadyAdded = false;
let mines = 15;
let question = [];
let flagGrid = Array.from({ length: 10 }, () => Array(10).fill(0));
let mode = "mine";
let availableHint = true;
let timeTaken = "";
let timeTnterval;
let timer = 0, h, m, s;
let started = false;;
let currIndex = 0;
let elementArray;

document.addEventListener("DOMContentLoaded", function () {
    cellContainer.innerHTML = "";
    for (let i = 0; i < 10; i++) {
        for (let j = 0; j < 10; j++) {
            const span = document.createElement("span");
            if (i == 1 && j == 4) span.classList.add("give-info", "info-cell");
            span.classList.add("cell");
            span.id = `${i}_${j}`;
            span.addEventListener("click", function () {
                checkCell(span.id, question);
            });
            cellContainer.appendChild(span);
        }
    }

    const helpAlreadyViewed = localStorage.getItem("help");
    if (helpAlreadyViewed === "true") {
        start.classList.remove("hidden");
    } else {
        help.classList.remove("hidden");
        elementArray = Array.from(document.querySelectorAll(".give-info"));
        showItem(currIndex);
    }

    replay.addEventListener("click", function () {
        gameOverScreen.classList.add("hidden");
        gameWinScreen.classList.add("hidden");
        replay.classList.add("hidden");
        hintButton.classList.remove("hidden");
        flagButton.classList.remove("hidden");
        startGame();
    });

    settingButton.addEventListener("click", function () {
        if (confirm("All your current game progress will be lost. and a new game with new settings will start\nDo you really want to continue?")) {

        }
    });
});

document.getElementById("prev").addEventListener("click", function () {
    if (currIndex > 0) {
        hideItem(currIndex);
        currIndex -= 1;
        showItem(currIndex);
        document.getElementById("next").textContent = "Next";
    }
});

document.getElementById("next").addEventListener("click", function () {
    if (currIndex < elementArray.length - 1) {
        hideItem(currIndex);
        currIndex += 1;
        showItem(currIndex);
    } else {
        information.classList.add("hidden");
        localStorage.setItem("help", true);
        startGame();
    }
});

function hideItem(index) {
    elementArray[index].classList.remove("show-info");
    elementArray[index].style.zIndex = "0";
    if (currIndex == elementArray.length - 1) {
        elementArray[currIndex].textContent = "";
        elementArray[currIndex].classList.remove("opened");
        const [row, col] = elementArray[currIndex].id.split('_').map(Number);
        const directions = [
            [-1, -1], [-1, 0], [-1, 1],
            [0, -1], [0, 1],
            [1, -1], [1, 0], [1, 1]
        ];
        directions.forEach(([dx, dy]) => {
            const newRow = row + dx;
            const newCol = col + dy;
            const newCell = document.getElementById(`${newRow}_${newCol}`);
            newCell.style.zIndex = "0";
            newCell.classList.remove("opened");
            if ((dx == -1 && dy == -1) || (dx == 0 && dy == 1)) {
                newCell.innerHTML = ``;
            }
            if (dx == 1 && dy == 0) {
                newCell.classList.remove("how-to-play", "show-info", "give-info");
            }
        });
        console.log(elementArray[currIndex]);
        document.getElementById("next").textContent = "next";
    }
}

function showItem(index) {
    elementArray[index].classList.add("show-info");
    elementArray[index].style.zIndex = "999";
    if (currIndex == elementArray.length - 1) {
        elementArray[currIndex].textContent = "2";
        elementArray[currIndex].classList.add("opened");
        const [row, col] = elementArray[currIndex].id.split('_').map(Number);
        const directions = [
            [-1, -1], [-1, 0], [-1, 1],
            [0, -1], [0, 1],
            [1, -1], [1, 0], [1, 1]
        ];
        directions.forEach(([dx, dy]) => {
            const newRow = row + dx;
            const newCol = col + dy;
            const newCell = document.getElementById(`${newRow}_${newCol}`);
            newCell.style.zIndex = "999";
            newCell.classList.add("opened");
            if ((dx == -1 && dy == -1) || (dx == 0 && dy == 1)) {
                newCell.innerHTML = `<img src="assets/mine.svg" alt=".">`;
            }
            if (dx == 1 && dy == 0) {
                newCell.classList.add("how-to-play", "show-info", "give-info");
            }
        });
        console.log(elementArray[currIndex]);
        document.getElementById("next").textContent = "Close";
    }
}

start.addEventListener("click", function () {
    startGame();
});

function startTimer(maxHours = 2) {
    const maxDuration = maxHours * 3600;

    const intervalId = setInterval(function () {
        h = Math.floor(timer / 3600);
        m = Math.floor((timer % 3600) / 60);
        s = Math.floor(timer % 60);

        h = h < 10 ? "0" + h : h;
        m = m < 10 ? "0" + m : m;
        s = s < 10 ? "0" + s : s;

        hours.textContent = h;
        minutes.textContent = m;
        seconds.textContent = s;

        timeTaken = `${h}:${m}:${s}`;
        if (++timer > maxDuration) {
            clearInterval(intervalId);
        }
    }, 1000);

    return intervalId;
}

function createMinesweeperGrid(mines) {
    const size = 10;
    const grid = Array.from({ length: size }, () => Array(size).fill(0));

    function placeMines() {
        let placedMines = 0;
        while (placedMines < mines) {
            const row = Math.floor(Math.random() * size);
            const col = Math.floor(Math.random() * size);
            if (grid[row][col] !== -1) {
                grid[row][col] = -1;
                placedMines++;
                updateNumbers(row, col);
            }
        }
    }

    function updateNumbers(row, col) {
        for (let i = -1; i <= 1; i++) {
            for (let j = -1; j <= 1; j++) {
                const newRow = row + i;
                const newCol = col + j;
                if (isValidCell(newRow, newCol) && grid[newRow][newCol] !== -1) {
                    grid[newRow][newCol]++;
                }
            }
        }
    }

    function isValidCell(row, col) {
        return row >= 0 && row < size && col >= 0 && col < size;
    }

    placeMines();
    return grid;
}

function updateColor(i, j) {
    const cell = document.getElementById(`${i}_${j}`);
    const value = question[i][j];
    switch (value) {
        case 1:
            cell.style.color = "#00a200"
            break;
        case 2:
            cell.style.color = "#00884d"
            break;
        case 3:
            cell.style.color = "#0d5175"
            break;
        case 4:
            cell.style.color = "#ff3737"
            break;
        case 5:
            cell.style.color = "#310093"
            break;
        case 6:
            cell.style.color = "#ffa600"
            break;
        case 7:
            cell.style.color = "#ece800"
            break;
        case 8:
            cell.style.color = "#ece800"
            break;

        default:
            break;
    }
}

function checkCell(cellId, grid) {
    const [row, col] = cellId.split('_').map(Number);
    const cell = document.getElementById(cellId);

    if (cell.classList.contains("opened")) {
        return;
    } else if (mode == "mine") {
        if (flagGrid[row][col] == 0) {
            if (grid[row][col] === -1) {
                cell.classList.add("opened");
                cell.innerHTML = `<img src="assets/mine.svg" alt=".">`;
                cell.style.backgroundColor = "red";
                gameOverScreen.classList.remove("hidden");
                replay.classList.remove("hidden");
                hintButton.classList.add("hidden");
                flagButton.classList.add("hidden");
                clearInterval(timeTnterval);
                revealAllMines();
                started = false;
            } else {
                cell.classList.add("opened");
                cell.textContent = grid[row][col] > 0 ? grid[row][col] : '';
                updateColor(row, col);
                checkGameCompleted();
                if (grid[row][col] === 0) {
                    revealEmptyCells(row, col, grid);
                }
            }
        }
    } else if (mode == "flag") {
        if (flagGrid[row][col] == 0 && mines > 0) {
            flagGrid[row][col] = 1;
            cell.innerHTML = `<img src="assets/flag.png" alt=".">`;
            cell.classList.add("flag");
            mines -= 1;
            totalMines.innerHTML = mines > 99 ? mines : "0" + mines;
        }
        else {
            flagGrid[row][col] = 0;
            cell.innerHTML = "";
            cell.classList.remove("flag");
            mines += 1;
            totalMines.innerHTML = mines > 99 ? mines : "0" + mines;
        }

    }
}

function revealAllMines() {
    for (let i = 0; i < question.length; i++) {
        for (let j = 0; j < question[i].length; j++) {
            const cell = document.getElementById(`${i}_${j}`);
            cell.classList.add("opened");
            if (question[i][j] === -1) {
                cell.innerHTML = `<img src="assets/mine.svg" alt=".">`;
            }
            else {
                cell.textContent = question[i][j] > 0 ? question[i][j] : '';
                updateColor(i, j);
            }
        }
    }
}

function revealEmptyCells(row, col, grid) {
    const directions = [
        [-1, -1], [-1, 0], [-1, 1],
        [0, -1], [0, 1],
        [1, -1], [1, 0], [1, 1]
    ];
    directions.forEach(([dx, dy]) => {
        const newRow = row + dx;
        const newCol = col + dy;
        if (isValidCell(newRow, newCol, grid) && !document.getElementById(`${newRow}_${newCol}`).classList.contains("opened")) {
            const newCell = document.getElementById(`${newRow}_${newCol}`);
            newCell.classList.add("opened");
            newCell.textContent = grid[newRow][newCol] > 0 ? grid[newRow][newCol] : '';
            checkGameCompleted();
            if (grid[newRow][newCol] === 0) {
                revealEmptyCells(newRow, newCol, grid);
            } else {
                updateColor(newRow, newCol);
            }
        }
    });
}

function isValidCell(row, col, grid) {
    return row >= 0 && row < grid.length && col >= 0 && col < grid[row].length;
}

function changeMode() {
    mode = mode == "mine" ? "flag" : "mine";
    if (mode == "flag") {
        flagButton.innerHTML = `<img src="assets/red_flag.svg" alt="flag">`;
        gameArea.style.cursor = `url(assets/flag.png), default`;
    } else {
        flagButton.innerHTML = `<img src="assets/mine_hammer.svg" alt="flag">`;
        gameArea.style.cursor = `url(assets/hammer.png), default`;
    }
}

function showHint(grid) {
    // check for 0 cells first
    for (let row = 0; row < grid.length; row++) {
        for (let col = 0; col < grid[row].length; col++) {
            const cellId = `${row}_${col}`;
            const cell = document.getElementById(cellId);

            if (grid[row][col] == 0 && !cell.classList.contains("opened") && availableHint == true) {
                hintButton.classList.remove("hint-available");
                availableHint = false;
                setTimeout(() => {
                    availableHint = true;
                    hintButton.classList.add("hint-available");
                }, 60000);
                cell.classList.add("hint");
                return;
            }
        }
    }

    // check for other available cells.
    for (let row = 0; row < grid.length; row++) {
        for (let col = 0; col < grid[row].length; col++) {
            const cellId = `${row}_${col}`;
            const cell = document.getElementById(cellId);

            if (grid[row][col] !== -1 && !cell.classList.contains("opened") && availableHint == true) {
                hintButton.classList.remove("hint-available");
                availableHint = false;
                setTimeout(() => {
                    availableHint = true;
                    hintButton.classList.add("hint-available");
                }, 60000);
                cell.classList.add("hint");
                return;
            }
        }
    }


}

function checkGameCompleted(grid = question) {
    let allCellsRevealed = true;

    for (let row = 0; row < grid.length; row++) {
        for (let col = 0; col < grid[row].length; col++) {
            const cellId = `${row}_${col}`;
            const cell = document.getElementById(cellId);

            if (grid[row][col] !== -1 && !cell.classList.contains("opened")) {
                allCellsRevealed = false;
                break;
            }
        }
    }

    if (allCellsRevealed) {
        clearInterval(timeTnterval);
        gameWinScreen.classList.remove("hidden");
        replay.classList.remove("hidden");
        hintButton.classList.add("hidden");
        flagButton.classList.add("hidden");
        storeGameTime();
        started = false;
    }
}

function storeGameTime() {
    const newTimeInSeconds = convertToSeconds(timeTaken);
    const storedTime = localStorage.getItem('bestTime');

    if (!storedTime || newTimeInSeconds < convertToSeconds(storedTime)) {
        localStorage.setItem('bestTime', timeTaken);
        bestTime.textContent = timeTaken;
    } else {
        bestTime.textContent = storedTime;
    }
    playerTime.textContent = timeTaken;
}

function convertToSeconds(time) {
    const [hours, minutes, seconds] = time.split(':').map(Number);
    return hours * 3600 + minutes * 60 + seconds;
}

function startGame() {
    started = true;
    mines = Math.floor(Math.random() * (20 - 10 + 1)) + 10;
    totalMines.innerHTML = mines > 99 ? mines : "0" + mines;

    cellContainer.innerHTML = "";
    for (let i = 0; i < 10; i++) {
        for (let j = 0; j < 10; j++) {
            const span = document.createElement("span");
            span.classList.add("cell");
            span.id = `${i}_${j}`;
            span.addEventListener("click", function () {
                checkCell(span.id, question);
            });
            cellContainer.appendChild(span);
        }
    }

    start.classList.add("hidden");
    timer = 0;
    timeTnterval = startTimer();

    question = createMinesweeperGrid(mines);
    // console.table(question);

    if (!eventListnersALreadyAdded) {
        eventListnersALreadyAdded = true;
        hintButton.addEventListener("click", function () {
            showHint(question);
        });

        flagButton.addEventListener("click", function () {
            changeMode();
        });
    }
}

document.addEventListener('keydown', function (event) {
    if (event.key === 'Control' && mode == "mine" && started == true) {
        changeMode();
    }
});

// Event listener for keyup event
document.addEventListener('keyup', function (event) {
    if (event.key === 'Control' && mode == "flag" && started == true) {
        changeMode();
    }
});