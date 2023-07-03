
// Player constructor
const Player = (sign) => {
    this.sign = sign;

    const getSign = () => {
        return this.sign;
    }

    return { getSign };
};

// populates boxes on screen with signs based on board array values
const populateBoard = () => {

    const boxes = document.querySelectorAll(".box");

    // loops through each box and adds the sign to it
    for (let i = 0; i < boxes.length; i++) {
        const box = boxes[i];

        const sign = document.createElement("div");
        sign.classList.add("sign");
        sign.textContent = gameBoard.getBox(i);

        box.appendChild(sign);
    }
}

// game board module
const gameBoard = (() => {
    const board = ["X", "X", "X", "X", "X", "X", "X", "X", "X"];

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


})();

// module to manipulate DOM
const displayController = (() => {
    populateBoard();


})();

