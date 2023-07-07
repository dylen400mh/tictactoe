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

    return { getBox, setBox, reset };
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
        if (!box.firstChild && !gameController.getIsOver()) {
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
            initializeDisplay();
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

    // adds board and restart button to screen and changes message
    const initializeDisplay = () => {
        board.style.display = "grid";
        restartButton.style.display = "block"
        displayController.setMessage(`PLAYER X'S TURN`)
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
    let isOver = false;
    let round = 1;
    let mode = 0; // gamemode starts as 0 -> changes to 1 or 2 based on the gamemode selected

    displayController.setMessage("SELECT GAMEMODE");

    const playRound = (index) => {

        if (mode === 1) {
            console.log("Single player code here")
        }

        // multi-player logic
        else if (mode === 2) {
            // make move
            gameBoard.setBox(index, getPlayerSign());

            displayController.updateBoard(index);

            // check if there is a winner or draw and update message accordingly
            if (isWinner()) {
                displayController.setMessage(`WINNER: PLAYER ${getPlayerSign()}!`)
                isOver = true;
                return;
            } else if (isDraw()) {
                displayController.setMessage("DRAW!")
                isOver = true;
                return;
            }

            round++

            // set message for next turn
            displayController.setMessage(`PLAYER ${getPlayerSign()}'S TURN`)
        }
    }

    const isWinner = () => {

        const winningConditions = [
            [0, 1, 2], // top row
            [3, 4, 5], // middle row
            [6, 7, 8], // bottom row
            [0, 3, 6], // left col
            [1, 4, 7], // middle col
            [2, 5, 8], // right col
            [0, 4, 8], // diagonal top-left to bottom-right
            [2, 4, 6] // diagonal top-right to bottom-left
        ]

        // loops through each condition and checks if the game board has a winning condition
        for (let condition of winningConditions) {
            if (gameBoard.getBox(condition[0]) === gameBoard.getBox(condition[1])
                && gameBoard.getBox(condition[1]) === gameBoard.getBox(condition[2])
                && gameBoard.getBox(condition[0]) !== "") {
                return true;
            }
        }

        return false;
    }

    // draw if 9 rounds are completed and there is no winner
    const isDraw = () => {
        return (round === 9 && !isWinner());
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

    const getIsOver = () => {
        return isOver;
    }

    const getMode = () => {
        return mode;
    }

    const setMode = (md) => {
        mode = md;
    }

    return { playRound, getIsOver, reset, getMode, setMode }
})();

