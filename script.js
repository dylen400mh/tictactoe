// Player constructor
const Player = (sign) => {
    return { sign };
};

// game board module
const gameBoard = (() => {
    const board = ["", "", "", "", "", "", "", "", ""];

    const getBox = (index) => {
        return board[index];
    }

    const setBox = (index, sign) => {
        board[index] = sign;
    }

    const reset = () => {
        for (let i = 0; i < board.length; i++) {
            board[i] = "";
        }
    }

    // returns index of best move on board
    const findBestMove = () => {
        let bestScore = -Infinity; // evaluation score of best move
        let bestMove = -1 // index of best move

        // loop through board looking for empty spots
        for (let i = 0; i < board.length; i++) {
            if (board[i] === "") {
                board[i] = "O"; // try a move for player O (AI)
                const score = minimax(board, 8, false) // "X" plays next and is minimizing
                board[i] = ""; // undo the move

                // overwrite the score and index if it is a better move
                if (score > bestScore) {
                    bestScore = score;
                    bestMove = i;
                }
            }
        }
        return bestMove;
    }

    // used to get the evaluation score of the current state of the board (determines if there is a winner)
    const evaluate = () => {
        // Winning combinations
        const lines = [
            [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
            [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
            [0, 4, 8], [2, 4, 6] // Diagonals
        ];

        // Check if the game is won by any player
        for (let i = 0; i < lines.length; i++) {
            const [a, b, c] = lines[i];
            if (board[a] && board[a] === board[b] && board[a] === board[c]) {
                return board[a] === 'O' ? 1 : -1; // 'O' wins: 1, 'X' wins: -1
            }
        }

        // Check if the game is a draw
        if (!board.includes('')) {
            return 0; // Draw
        }

        // The game is not over yet
        return null;
    }

    // MINIMAX ALGORITHM
    const minimax = (board, depth, isMaximizing) => {
        const result = evaluate(board) // gets evalutation score

        // Base cases: game over or maximum depth reached
        if (result !== null || depth === 0) {
            return result * depth;
        }

        // if maximizing player
        if (isMaximizing) {
            let maxScore = -Infinity;
            for (let i = 0; i < board.length; i++) {
                if (board[i] === '') {
                    board[i] = 'O'; // Try a move for the 'O' player (AI)
                    const score = minimax(board, depth - 1, false); // 'X' is the minimizing player
                    board[i] = ''; // Undo the move
                    maxScore = Math.max(maxScore, score);
                }
            }
            return maxScore;
        }

        // if minimizing player
        else {
            let minScore = Infinity;
            for (let i = 0; i < board.length; i++) {
                if (board[i] === '') {
                    board[i] = 'X'; // Try a move for the 'X' player
                    const score = minimax(board, depth - 1, true); // 'O' is the maximizing player
                    board[i] = ''; // Undo the move
                    minScore = Math.min(minScore, score);
                }
            }
            return minScore;
        }
    }

    return { getBox, setBox, reset, findBestMove, evaluate };
})();

// module to manipulate DOM
const displayController = (() => {
    const boxes = document.querySelectorAll(".box");
    const restartButton = document.querySelector(".restart-button");
    const messageContainer = document.querySelector(".message-container");
    const aiButton = document.querySelector(".ai-button h1");
    const playerButton = document.querySelector(".player-button h1");
    const board = document.querySelector(".board")

    boxes.forEach(box => box.addEventListener("click", () => {
        // play a round if there's no marker in the box or if game isn't over
        if (!box.firstChild && !gameController.checkGameOver()) {
            gameController.playRound(box.getAttribute("index"));
        }
    }));

    // clear board and restart game when reset button is clicked
    restartButton.addEventListener("click", () => {
        clearBoard();
        gameController.reset();
    })

    // switches gamemode to singleplayer
    aiButton.addEventListener("click", () => {
        switchMode(1, aiButton);
    })

    // switches gamemode to multiplayer
    playerButton.addEventListener("click", () => {
        switchMode(2, playerButton);
    })

    // switches displayed gamemode
    const switchMode = (mode, button) => {
        if (gameController.getMode() === 0) {
            // adds board and restart button to screen and changes display message
            board.style.display = "grid";
            restartButton.style.display = "block"
            displayController.setMessage(`PLAYER X'S TURN`)
        }

        else if (gameController.getMode() !== mode) {
            // "unselect" other box

            if (button === playerButton) {
                aiButton.removeAttribute("style");
            } else if (button === aiButton) {
                playerButton.removeAttribute("style");
            }

            //reset game
            clearBoard();
            gameController.reset();
        }

        gameController.setMode(mode);
        button.style.border = "5px solid #eecc50"
    }

    // update boxes on screen with signs based on board array values
    const updateBoard = (index) => {
        const box = boxes[index];

        const sign = document.createElement("div");
        sign.classList.add("sign");
        sign.textContent = gameBoard.getBox(index);

        box.appendChild(sign);
    }

    // clears board for next match
    const clearBoard = () => {
        for (let box of boxes) {
            //if there is a sign in the box, remove it
            if (box.firstChild) {
                box.removeChild(box.firstChild);
            }
        }
    }

    const setMessage = (message) => {
        //remove existing message
        if (messageContainer.firstChild) messageContainer.removeChild(messageContainer.firstChild);

        // add new message
        const h1 = document.createElement("h1");
        h1.textContent = message;
        messageContainer.appendChild(h1);
    }

    return { updateBoard, setMessage }
})();

// game module
const gameController = (() => {
    const playerX = Player("X");
    const playerO = Player("O");
    let round = 1;
    let mode = 0; // gamemode starts as 0 -> changes to 1 or 2 based on the gamemode selected

    displayController.setMessage("SELECT GAMEMODE");

    const playRound = (index) => {

        // multi-player logic

        // make move
        gameBoard.setBox(index, getPlayerSign());

        displayController.updateBoard(index);

        if (checkGameOver()) return;

        round++

        // if single-player, AI takes a turn
        if (mode === 1) {
            let bestIndex = gameBoard.findBestMove();
            gameBoard.setBox(bestIndex, getPlayerSign());

            displayController.updateBoard(bestIndex);


            if (checkGameOver()) return;

            round++
        }

        // set message for next turn
        displayController.setMessage(`PLAYER ${getPlayerSign()}'S TURN`)
    }

    // check if there is a winner or draw and update message accordingly
    // 0: DRAW, 1: O WINS, -1: X WINS
    const checkGameOver = () => {
        if (gameBoard.evaluate() === 0) {
            displayController.setMessage("DRAW!");
            return true;
        }
        if (gameBoard.evaluate() === -1) {
            displayController.setMessage("WINNER: PLAYER X!")
            return true;
        }
        if (gameBoard.evaluate() === 1) {
            displayController.setMessage("WINNER: PLAYER O!")
            return true;
        }
    }

    // get player sign (if the round is odd, X plays. O plays if even round)
    const getPlayerSign = () => {
        return round % 2 === 1 ? playerX.sign : playerO.sign;
    }

    // reset variables for next round
    const reset = () => {
        round = 1;
        isOver = false;

        gameBoard.reset();
        displayController.setMessage(`PLAYER X'S TURN`);
    }

    const getMode = () => {
        return mode;
    }

    const setMode = (md) => {
        mode = md;
    }

    return { playRound, checkGameOver, reset, getMode, setMode }
})();

