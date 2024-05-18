let boxes = document.querySelectorAll(".box");
let turn = "X";
let isGameOver = false;

function isBoardFull() {
    return [...boxes].every(box => box.innerHTML !== "");
}

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

function minimax(board, depth, isMaximizing) {
    let result = checkWinner();
    if (result === "X") return -10 + depth;
    if (result === "O") return 10 - depth;
    if (isBoardFull()) return 0;

    if (isMaximizing) {
        let bestScore = -Infinity;
        for (let i = 0; i < 9; i++) {
            if (board[i].innerHTML === "") {
                board[i].innerHTML = "O";
                let score = minimax(board, depth + 1, false);
                board[i].innerHTML = "";
                bestScore = Math.max(score, bestScore);
            }
        }
        return bestScore;
    } else {
        let bestScore = Infinity;
        for (let i = 0; i < 9; i++) {
            if (board[i].innerHTML === "") {
                board[i].innerHTML = "X";
                let score = minimax(board, depth + 1, true);
                board[i].innerHTML = "";
                bestScore = Math.min(score, bestScore);
            }
        }
        return bestScore;
    }
}

function aiMove() {
    let bestScore = -Infinity;
    let bestMove;
    for (let i = 0; i < 9; i++) {
        if (boxes[i].innerHTML === "") {
            boxes[i].innerHTML = "O";
            let score = minimax(boxes, 0, false);
            boxes[i].innerHTML = "";
            if (score > bestScore) {
                bestScore = score;
                bestMove = i;
            }
        }
    }
    boxes[bestMove].innerHTML = "O";
    checkGameStatus();
}

function checkGameStatus() {
    let winner = checkWinner();
    if (winner !== null) {
        isGameOver = true;
        document.querySelector("#results").innerHTML = winner + " wins";
        document.querySelector("#play-again").style.display = "inline";
    } else if (isBoardFull()) {
        isGameOver = true;
        document.querySelector("#results").innerHTML = "Draw";
        document.querySelector("#play-again").style.display = "inline";
    } else {
        changeTurn();
    }
}

function changeTurn() {
    turn = turn === "X" ? "O" : "X";
    if (turn === "O" && !isGameOver) {
        aiMove();
    }
}

boxes.forEach(box => {
    box.innerHTML = "";
    box.addEventListener("click", () => {
        if (!isGameOver && box.innerHTML === "" && turn === "X") {
            box.innerHTML = "X";
            checkGameStatus();
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
        box.style.removeProperty("background-color");
        box.style.color = "#fff";
    });
});

// Initial call to set up the first move if the AI goes first
if (turn === "O") {
    aiMove();
}
