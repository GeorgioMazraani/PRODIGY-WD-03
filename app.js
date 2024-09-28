let board = ['', '', '', '', '', '', '', '', ''];
let currentPlayer = 'X';
let isGameActive = true;
let round = 1;
let xWins = 0;
let oWins = 0;

const maxRounds = 3;

const winningConditions = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8],
    [0, 3, 6], [1, 4, 7], [2, 5, 8],
    [0, 4, 8], [2, 4, 6]
];

const statusDisplay = document.getElementById('status');
const resetButton = document.getElementById('reset-btn');
const cells = document.querySelectorAll('.cell');
const xScoreDisplay = document.getElementById('x-score');
const oScoreDisplay = document.getElementById('o-score');
const roundNumberDisplay = document.getElementById('round-number');
const historyDisplay = document.getElementById('round-history');

function handleCellClick(event) {
    const cellIndex = event.target.getAttribute('data-index');
    if (board[cellIndex] !== '' || !isGameActive) {
        return;
    }
    board[cellIndex] = currentPlayer;
    event.target.textContent = currentPlayer;
    checkForWinner();
    swapPlayer();
}

function swapPlayer() {
    currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
    statusDisplay.textContent = `Player ${currentPlayer}'s turn`;
}

function checkForWinner() {
    let roundWon = false;
    for (let i = 0; i < winningConditions.length; i++) {
        const [a, b, c] = winningConditions[i];
        if (board[a] && board[a] === board[b] && board[a] === board[c]) {
            roundWon = true;
            break;
        }
    }

    if (roundWon) {
        statusDisplay.textContent = `Player ${currentPlayer} has won this round!`;
        isGameActive = false;
        recordWin(currentPlayer);
        return;
    }

    if (!board.includes('')) {
        statusDisplay.textContent = "It's a tie!";
        isGameActive = false;
        recordWin('Tie');
        return;
    }
}

function recordWin(winner) {
    const listItem = document.createElement('li');
    listItem.textContent = `Round ${round}: ${winner === 'Tie' ? "It's a tie!" : `Player ${winner} wins`}`;
    historyDisplay.appendChild(listItem);

    if (winner === 'X') {
        xWins++;
        xScoreDisplay.textContent = xWins;
    } else if (winner === 'O') {
        oWins++;
        oScoreDisplay.textContent = oWins;
    }

    round++;
    roundNumberDisplay.textContent = round;

    if (round > maxRounds) {
        declareOverallWinner();
    } else {
        setTimeout(resetBoard, 2000);
    }
}

function declareOverallWinner() {
    let winner = '';

    if (xWins > oWins) {
        statusDisplay.textContent = "Player X wins the game!";
        xScoreDisplay.classList.add('glow');
        winner = 'X';
    } else if (oWins > xWins) {
        statusDisplay.textContent = "Player O wins the game!";
        oScoreDisplay.classList.add('glow');
        winner = 'O';
    } else {
        statusDisplay.textContent = "It's a tie overall!";
    }

    resetButton.style.display = 'block';
    createConfetti();
}

function resetBoard() {
    board = ['', '', '', '', '', '', '', '', ''];
    currentPlayer = 'X';
    isGameActive = true;
    statusDisplay.textContent = `Player X's turn`;
    cells.forEach(cell => {
        cell.textContent = '';
    });
}

function createConfetti() {
    for (let i = 0; i < 100; i++) {
        const confetti = document.createElement('div');
        confetti.classList.add('confetti');
        confetti.style.backgroundColor = `hsl(${Math.random() * 360}, 100%, 50%)`;
        confetti.style.left = `${Math.random() * 100}vw`;
        confetti.style.animationDuration = `${Math.random() * 3 + 2}s`;
        document.body.appendChild(confetti);

        setTimeout(() => {
            confetti.remove();
        }, 5000);
    }
}

function resetGame() {
    board = ['', '', '', '', '', '', '', '', ''];
    currentPlayer = 'X';
    isGameActive = true;
    round = 1;
    xWins = 0;
    oWins = 0;
    xScoreDisplay.textContent = xWins;
    oScoreDisplay.textContent = oWins;
    roundNumberDisplay.textContent = round;
    historyDisplay.innerHTML = '';
    statusDisplay.textContent = `Player X's turn`;

    cells.forEach(cell => {
        cell.textContent = '';
    });

    resetButton.style.display = 'none';

    xScoreDisplay.classList.remove('glow');
    oScoreDisplay.classList.remove('glow');
}

window.onload = resetGame;


cells.forEach(cell => cell.addEventListener('click', handleCellClick));
resetButton.addEventListener('click', resetGame);
