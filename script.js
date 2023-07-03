
// Player constructor
const Player = (sign) => {
    this.sign = sign;

    const getSign = () => {
        return this.sign;
    }

    return { getSign };
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

// game module
const gameController = (() => {
    const playerX = Player("X");
    const playerO = Player("O");
    let isOver = false;
    let round = 1;

    const playRound = () => {
        // make move
        gameBoard.setBox(index, getPlayerSign());

        // check if there is a winner or draw
        if (isWinner() || isDraw()) {
            isOver = true;
            return;
        }

        round++

        // check for draw
        isDraw()
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
            return false;
        }
    }

    // draw if 9 rounds are completed and there is no winner
    const isDraw = () => {
        return round === 9 && !isWinner;
    }

    // return boolean for if game is over
    const getIsOver = () => {
        return isOver;
    }

    // get player sign (if the round is odd, X plays. O plays if even round)
    const getPlayerSign = () => {
        return round % 2 === 1 ? playerX.getSign() : playerO.getSign();
    }

    const reset = () => {
        let round = 1;
    }

    return { playRound, getIsOver, reset }
})();













// module to manipulate DOM
const displayController = (() => {
    const boxes = document.querySelectorAll(".box");

    // populates boxes on screen with signs based on board array values
    const populateBoard = () => {

        // loops through each box and adds the sign to it
        for (let i = 0; i < boxes.length; i++) {
            const box = boxes[i];

            const sign = document.createElement("div");
            sign.classList.add("sign");
            sign.textContent = gameBoard.getBox(i);

            box.appendChild(sign);
        }
    }

    populateBoard();
})();

