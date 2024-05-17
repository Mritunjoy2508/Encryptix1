let boxes = document.querySelectorAll(".box");
let turn = "X";
let isGameOver = false;

// Helper function to check if the board is full
function isBoardFull() {
    return [...boxes].every(box => box.innerHTML !== "");
}

// Helper function to check for a winner
function checkWinner() {
    let winConditions = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8],
        [0, 3, 6], [1, 4, 7], [2, 5, 8],
        [0, 4, 8], [2, 4, 6]
    ];
    for (let condition of winConditions) {
        let [a, b, c] = condition;
        if (boxes[a].innerHTML !== "" && boxes[a].innerHTML === boxes[b].innerHTML && boxes[a].innerHTML === boxes[c].innerHTML) {
            return boxes[a].innerHTML;
        }
    }
    return null;
}

// Minimax algorithm
function minimax(board, depth, isMaximizing) {
    let result = checkWinner();
    if (result !== null) {
        return result === "X" ? 10 - depth : depth - 10;
    }

    if (isBoardFull()) {
        return 0;
    }

    if (isMaximizing) {
        let bestScore = -Infinity;
        for (let i = 0; i < 9; i++) {
            if (board[i].innerHTML === "") {
                board[i].innerHTML = "X";
                bestScore = Math.max(bestScore, minimax(board, depth + 1, false));
                board[i].innerHTML = "";
            }
        }
        return bestScore;
    } else {
        let bestScore = Infinity;
        for (let i = 0; i < 9; i++) {
            if (board[i].innerHTML === "") {
                board[i].innerHTML = "O";
                bestScore = Math.min(bestScore, minimax(board, depth + 1, true));
                board[i].innerHTML = "";
            }
        }
        return bestScore;
    }
}

// AI player's move using minimax
function aiMove() {
    let bestScore = -Infinity;
    let bestMove;
    for (let i = 0; i < 9; i++) {
        if (boxes[i].innerHTML === "") {
            boxes[i].innerHTML = "X";
            let score = minimax(boxes, 0, false);
            boxes[i].innerHTML = "";
            if (score > bestScore) {
                bestScore = score;
                bestMove = i;
            }
        }
    }
    boxes[bestMove].innerHTML = "O";
    changeTurn();
}

boxes.forEach(box => {
    box.innerHTML = "";
    box.addEventListener("click", () => {
        if (!isGameOver && box.innerHTML === "") {
            box.innerHTML = turn;
            if (checkWinner() !== null) {
                isGameOver = true;
                document.querySelector("#results").innerHTML = turn + " win";
                document.querySelector("#play-again").style.display = "inline";
            } else if (isBoardFull()) {
                isGameOver = true;
                document.querySelector("#results").innerHTML = "Draw";
                document.querySelector("#play-again").style.display = "inline";
            } else {
                aiMove();
            }
        }
    });
});

document.querySelector("#play-again").addEventListener("click", () => {
    isGameOver = false;
    turn = "X";
    document.querySelector("#results").innerHTML = "";
    document.querySelector("#play-again").style.display = "none";

    boxes.forEach(box => {
        box.innerHTML = "";
    });
});
