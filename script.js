document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const board = document.getElementById('board');
    const cells = document.querySelectorAll('.cell');
    const status = document.getElementById('status');
    const resetBtn = document.getElementById('resetBtn');
    const pvpBtn = document.getElementById('pvpBtn');
    const pvcBtn = document.getElementById('pvcBtn');

    // Game Variables
    let currentPlayer = 'X';
    let gameState = ['', '', '', '', '', '', '', '', ''];
    let gameActive = true;
    let gameMode = 'pvp'; // 'pvp' or 'pvc'

    // Winning Conditions
    const winningConditions = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
        [0, 3, 6], [1, 4, 7], [2, 5, 8], // columns
        [0, 4, 8], [2, 4, 6]             // diagonals
    ];

    // Event Listeners
    cells.forEach(cell => cell.addEventListener('click', handleCellClick));
    resetBtn.addEventListener('click', resetGame);
    pvpBtn.addEventListener('click', () => setGameMode('pvp'));
    pvcBtn.addEventListener('click', () => setGameMode('pvc'));

    // Functions
    function handleCellClick(e) {
        const clickedCell = e.target;
        const clickedCellIndex = parseInt(clickedCell.getAttribute('data-index'));

        // If cell already used or game not active, ignore
        if (gameState[clickedCellIndex] !== '' || !gameActive) return;

        // Process human player move
        processMove(clickedCell, clickedCellIndex);

        // If in PVC mode and game still active, process computer move
        if (gameMode === 'pvc' && gameActive) {
            setTimeout(computerMove, 500);
        }
    }

    function processMove(cell, index) {
        // Update game state and UI
        gameState[index] = currentPlayer;
        cell.classList.add(currentPlayer.toLowerCase());

        // Check for win or draw
        checkResult();
    }

    function computerMove() {
        // Simple AI - first tries to win, then blocks, then random
        let move = findWinningMove('O') || findWinningMove('X') || findRandomMove();
        
        if (move !== null) {
            const cell = document.querySelector(`.cell[data-index="${move}"]`);
            processMove(cell, move);
        }
    }

    function findWinningMove(player) {
        for (let condition of winningConditions) {
            const [a, b, c] = condition;
            const cells = [gameState[a], gameState[b], gameState[c]];
            
            // If two cells are player's and one is empty
            if (cells.filter(c => c === player).length === 2 && cells.includes('')) {
                return condition[cells.indexOf('')];
            }
        }
        return null;
    }

    function findRandomMove() {
        const emptyCells = gameState.map((cell, index) => cell === '' ? index : null).filter(val => val !== null);
        return emptyCells.length > 0 ? emptyCells[Math.floor(Math.random() * emptyCells.length)] : null;
    }

    function checkResult() {
        let roundWon = false;

        // Check all winning conditions
        for (let condition of winningConditions) {
            const [a, b, c] = condition;
            
            if (gameState[a] === '' || gameState[b] === '' || gameState[c] === '') continue;
            
            if (gameState[a] === gameState[b] && gameState[b] === gameState[c]) {
                roundWon = true;
                // Highlight winning cells
                condition.forEach(index => {
                    document.querySelector(`.cell[data-index="${index}"]`).classList.add('winning-cell');
                });
                break;
            }
        }

        if (roundWon) {
            status.textContent = `Player ${currentPlayer} wins!`;
            gameActive = false;
            return;
        }

        // Check for draw
        if (!gameState.includes('')) {
            status.textContent = "Game ended in a draw!";
            gameActive = false;
            return;
        }

        // Switch player
        currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
        status.textContent = gameMode === 'pvp' 
            ? `Player ${currentPlayer}'s turn` 
            : currentPlayer === 'X' ? "Your turn (X)" : "Computer thinking...";
    }

    function resetGame() {
        currentPlayer = 'X';
        gameState = ['', '', '', '', '', '', '', '', ''];
        gameActive = true;
        status.textContent = gameMode === 'pvp' 
            ? "Player X's turn" 
            : "Your turn (X)";

        // Clear board UI
        cells.forEach(cell => {
            cell.classList.remove('x', 'o', 'winning-cell');
        });
    }

    function setGameMode(mode) {
        gameMode = mode;
        pvpBtn.classList.toggle('active', mode === 'pvp');
        pvcBtn.classList.toggle('active', mode === 'pvc');
        resetGame();
    }
});