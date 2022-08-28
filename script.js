const gameBoard = (() => {
    const items = document.querySelectorAll('.gameboard-item');
    const array = [];

    // adds mark (O or X) to the array, sets it as a data-mark attribute in html, displays the mark
    const arrayChange = (boxNo, mark) => {
        array[boxNo] = mark;
        items[boxNo].setAttribute('data-mark', mark);
        items[boxNo].textContent = mark;
    };

    const determineWinner = (mark) => {
        // vertical
        if (array[0] === mark && array[3] === mark && array[6] === mark) {
            return true;
        } else if (array[1] === mark && array[4] === mark && array[7] === mark) {
            return true;
        } else if (array[2] === mark && array[5] === mark && array[8] === mark) {
            return true;
            // horizontal
        } else if (array[0] === mark && array[1] === mark && array[2] === mark) {
            return true;
        } else if (array[3] === mark && array[4] === mark && array[5] === mark) {
            return true;
        } else if (array[6] === mark && array[7] === mark && array[8] === mark) {
            return true;
            // diagonal
        } else if (array[0] === mark && array[4] === mark && array[8] === mark) {
            return true;
        } else if (array[2] === mark && array[4] === mark && array[6] === mark) {
            return true;
        }
    };

    // changes background color of gameboard items when hovered
    const changeBackground = () => {
        for (let i = 0; i < gameBoard.items.length; i++) {
            if (gameBoard.items[i].textContent === '') {
                gameBoard.items[i].onmouseover = function () {
                    gameBoard.items[i].classList.add('hovered');
                };
                gameBoard.items[i].onmouseout = function () {
                    gameBoard.items[i].classList.remove('hovered');
                };
            };
        };
    };

    const selectionDisplay = document.getElementById('selection-container');
    const gameboardDisplay = document.getElementById('gameboard-container');
    const resultsDisplay = document.getElementById('results-container');
    const resultsText = document.getElementById('results');

    // modifies the select elements 
    const displayManagement = (displayName, displayValue) => {
        if (displayName === 'selectionDisplay') {
            selectionDisplay.style.display = displayValue;
        } else if (displayName === 'gameboardDisplay') {
            gameboardDisplay.style.display = displayValue;
        } else if (displayName === 'resultsDisplay') {
            resultsDisplay.style.display = displayValue;
        } else if (displayName === 'resultsText') {
            resultsText.textContent = displayValue;
        }
    };

    displayManagement('gameboardDisplay', 'none');
    displayManagement('resultsDisplay', 'none');

    return { items, arrayChange, determineWinner, changeBackground, displayManagement };
})();

const playerFactory = (name, mark) => {
    return { name, mark }
};

const Players = (() => {
    const playersArray = [];
    const selectButtons = document.querySelectorAll('.player-button');
    selectButtons.forEach(button => button.addEventListener('click', setPlayers));

    // assigns each player their mark and adds them to the array as objects
    function setPlayers(e) {
        const playerNameValues = document.querySelectorAll('.player-input');
        let options = ['X', 'O'];
        if (options[0] === e.target.value) {
            playersArray.push(playerFactory(playerNameValues[0].value, options[0]));
            playersArray.push(playerFactory(playerNameValues[1].value, options[1]));
        } else {
            playersArray.push(playerFactory(playerNameValues[0].value, options[1]));
            playersArray.push(playerFactory(playerNameValues[1].value, options[0]));
        }
        gameBoard.displayManagement('selectionDisplay', 'none');
        gameBoard.displayManagement('gameboardDisplay', 'flex');
        gameBoard.changeBackground();
    };

    function playersArrayMark(position) {
        if (position === 0 || position === 1) {
            return playersArray[position].mark;
        };
    };

    function playersArrayName(position) {
        if (position === 0 || position === 1) {
            return playersArray[position].name;
        };
    };
    // O & X buttons
    const buttonHover = () => {
        for (let i = 0; i < selectButtons.length; i++) {
            selectButtons[i].onmouseover = function () {
                selectButtons[i].classList.add('hovered');
            };
            selectButtons[i].onmouseout = function () {
                selectButtons[i].classList.remove('hovered');
            };
        };
    };
    buttonHover();

    return { playersArrayMark, playersArrayName }
})();

const Game = (() => {
    gameBoard.items.forEach(box => box.addEventListener('click', markItem));
    let currentPlayerMark = '';
    let roundCount = 1;

    function markItem(e) {
        if (gameBoard.determineWinner(currentPlayerMark) === true) {
            return; // the winner has already been determined
        } else { // changes the player based on the odd or even value of roundCount
            if (roundCount % 2 === 0) {
                currentPlayerMark = Players.playersArrayMark(1);
            } else if (roundCount % 2 !== 0) {
                currentPlayerMark = Players.playersArrayMark(0);
            }
            let dataMarkValue = e.target.getAttribute('data-mark');
            let dataBoxNumber = parseInt(e.target.getAttribute('data-box'));
            // checks if a box is already taken and if not (i.e. data-mark is empty) changes the box and iterates roundCount
            if (dataMarkValue === '') {
                gameBoard.arrayChange(dataBoxNumber, currentPlayerMark);
                roundCount++;
                if (currentPlayerMark === 'O') {
                    gameBoard.items[dataBoxNumber].classList.add('color1');
                } else {
                    gameBoard.items[dataBoxNumber].classList.add('color2');
                }
            };
            if (gameBoard.determineWinner(currentPlayerMark) === true) {
                if (Players.playersArrayMark(0) === currentPlayerMark) {
                    gameBoard.displayManagement('resultsText', `${Players.playersArrayName(0)} playing ${currentPlayerMark} won`);
                } else {
                    gameBoard.displayManagement('resultsText', `${Players.playersArrayName(1)} playing ${currentPlayerMark} won`);
                }
                gameBoard.displayManagement('resultsDisplay', 'flex');
            } else if (gameBoard.determineWinner(currentPlayerMark) !== true && roundCount >= 10) {
                gameBoard.displayManagement('resultsText', `It's a tie`);
                gameBoard.displayManagement('resultsDisplay', 'flex');
            };
        };
    };

    const resetButton = document.getElementById('reset-button');
    // reloads the page and thereby resets the game
    resetButton.addEventListener('click', function () { window.location.reload() });

    const resetButtonHover = () => {
        resetButton.onmouseover = function () {
            resetButton.classList.add('hovered');
        };
        resetButton.onmouseout = function () {
            resetButton.classList.remove('hovered');
        };
    };
    resetButtonHover();
})();