

let gameData = {
    boardRows: 60,
    boardCols: 60,
    tO: 500
};

gameData.gameBoard = initBoard(gameData.boardRows, gameData.boardCols);
gameData.boardTable = createBoardTable(gameData);

let rangeSlide = document.querySelector(".range-input__slide");

rangeSlide.addEventListener("input", function(){
    gameData.tO = rangeSlide.value;
});



///////////////BUILD Function////////////

function initBoard(rows, cols) {
    let board = [];
    let i, j;
    for (i = 0; i < rows; i++) {
        board[i] = [];
        for (j = 0; j < cols; j++) {
            board[i][j] = 0;
        }
    }
    return board;
}

function initRandomBoard(rows, cols) {
    let board = [];
    let i, j;
    let random;
    for (i = 0; i < rows; i++) {
        board[i] = [];
        for (j = 0; j < cols; j++) {
            random = Math.floor(Math.random() * 101);
            if(random > 80){
                board[i][j] = 1;
            }

            else{
                board[i][j] = 0;
            }
        }
    }
    return board;
}


function getBoardCopy(board) {
    let newBoard = [];
    let i, j;
    for (i = 0; i < board.length; i++) {
        newBoard[i] = [];
        for (j = 0; j < board[0].length; j++) {
            newBoard[i][j] = board[i][j];
        }
    }
    return newBoard;
}



function createBoardTable(data) {
    let rows = data.boardRows;
    let cols = data.boardCols;
    let table = document.querySelector(".main-content__board");
    let i, j;
    for (i = 0; i < rows; i++) {

        let row = table.insertRow(i);
        for (j = 0; j < cols; j++) {

            let cell = row.insertCell(j);
            cell.addEventListener("click", function () {
                cellClicked(cell, data.gameBoard, table);
            });

            if (data.gameBoard[i][j] === 0) {
                cell.classList.add("dead-cell");
            }

            else {
                cell.classList.add("live-cell");
            }
        }
    }
    return table;
}


function cellClicked(cell, board, table) {
    let indexOfRow = cell.parentNode.rowIndex;
    let indexOfCell = cell.cellIndex;
    if (board[indexOfRow][indexOfCell] === 1) {
        table.rows[indexOfRow].cells[indexOfCell].classList.remove("live-cell");
        table.rows[indexOfRow].cells[indexOfCell].classList.add("dead-cell");
        board[indexOfRow][indexOfCell] = 0;
    }

    else {
        table.rows[indexOfRow].cells[indexOfCell].classList.remove("dead-cell");
        table.rows[indexOfRow].cells[indexOfCell].classList.add("live-cell");
        board[indexOfRow][indexOfCell] = 1;
    }
}

function randomizeBoard(data){
    let i, j;
    let random;
    for (i = 0; i < data.boardRows; i++) {
        for (j = 0; j < data.boardCols; j++) {
            random = Math.floor(Math.random() * 101);
            if(random > 80){
                data.gameBoard[i][j] = 1;
                data.boardTable.rows[i].cells[j].classList.remove("dead-cell");
                data.boardTable.rows[i].cells[j].classList.add("live-cell");
                
            }

            else{
                data.gameBoard[i][j] = 0;
            }
        }
    }
}

//////////////////////////////

function getNewGeneration(currBoard, rows, cols, table) {
    
    let newBoard = getBoardCopy(currBoard);
    let i, j;
    for (i = 0; i < rows; i++) {
        for (j = 0; j < cols; j++) {

            if (currBoard[i][j] === 1) {
                let liveNeighbors = numOfLiveNeighbors(currBoard, i, j);
                if (liveNeighbors < 2 || liveNeighbors > 3) {
                    newBoard[i][j] = 0;
                    table.rows[i].cells[j].classList.remove("live-cell");
                    table.rows[i].cells[j].classList.add("dead-cell");

                }
            }

            if (currBoard[i][j] === 0) {
                let liveNeighbors = numOfLiveNeighbors(currBoard, i, j);
                if (liveNeighbors === 3) {
                    newBoard[i][j] = 1;
                    table.rows[i].cells[j].classList.remove("dead-cell");
                    table.rows[i].cells[j].classList.add("live-cell");

                }
            }
        }
    }

    return newBoard;
}

function numOfLiveNeighbors(board, row, col) {   
    
    let liveNeighbors = 0;

    if (row - 1 >= 0) {
        liveNeighbors += board[row - 1][col]; //top cell
    }

    if (row + 1 < board.length) {
        liveNeighbors += board[row + 1][col]; //bottom cell
    }

    if (col - 1 >= 0) {
        liveNeighbors += board[row][col - 1]; // left cell
    }

    if (col + 1 < board[0].length) {
        liveNeighbors += board[row][col + 1]; // right cell
    }

    if (row - 1 >= 0 && col - 1 >= 0) {
        liveNeighbors += board[row - 1][col - 1]; // top left cell
    }

    if (row - 1 >= 0 && col + 1 < board[0].length) {
        liveNeighbors += board[row - 1][col + 1]; // top right cell
    }

    if (row + 1 < board.length && col - 1 >= 0) {
        liveNeighbors += board[row + 1][col - 1]; // bottom left cell
    }

    if (row + 1 < board.length && col + 1 < board[0].length) {
        liveNeighbors += board[row + 1][col + 1]; // bottom right cel;
    }

    return liveNeighbors;
}


function startGame(data) {
    let rows = data.boardRows;
    let cols = data.boardCols;
    let board = data.gameBoard;
    let table = data.boardTable;
    let newBoard = getNewGeneration(board, rows, cols, table);
    data.gameBoard = getBoardCopy(newBoard);
    data.sTo = setTimeout(() => {
        startGame(data);
    }, data.tO);
}




function stopGame(data) {
    if (typeof data.sTo !== "undefined") {
        clearTimeout(data.sTo);
    }
}

function resetGame(data) {
    stop();
    let i, j;
    for (i = 0; i < data.boardRows; i++) {
        for (j = 0; j < data.boardCols; j++) {
           if (data.gameBoard[i][j] === 1) {
                data.gameBoard[i][j] = 0;
                data.boardTable.rows[i].cells[j].classList.remove("live-cell");
                data.boardTable.rows[i].cells[j].classList.add("dead-cell");
            }
        }
    }
}




function start() {
    let pauseButton = document.querySelector(".pause-button");
    let startButton = document.querySelector(".start-button");
    pauseButton.classList.remove("button--red");
    pauseButton.classList.add("button--white");
    startButton.classList.remove("button--white");
    startButton.classList.add("button--green");

    startGame(gameData);
}


function stop(){
    let pauseButton = document.querySelector(".pause-button");
    let startButton = document.querySelector(".start-button");
    pauseButton.classList.remove("button--white");    
    pauseButton.classList.add("button--red");
    startButton.classList.remove("button--green");
    startButton.classList.add("button--white");

    stopGame(gameData);
}

function reset(){
    resetGame(gameData);
}

function randomize(){
    reset();
    randomizeBoard(gameData);
}