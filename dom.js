// Game State
let humanPlayer;
let computerPlayer;
let currentGame;

// Initialize Game
function initGame() {
    humanPlayer = createPlayer('human');
    computerPlayer = createPlayer('computer');
    
    setupGameboards();
    placeShipsRandomly(humanPlayer);
    placeShipsRandomly(computerPlayer);
    
    renderBoards();
    updateGameStatus('Click on computer board to attack!');
}

// Create visual gameboards
function setupGameboards() {
    createBoard('player-board', 'Your Board');
    createBoard('computer-board', 'Computer Board');
}

function createBoard(containerId, title) {
    const container = document.getElementById(containerId);
    container.innerHTML = `<h2>${title}</h2>`;
    
    const board = document.createElement('div');
    board.className = 'board';
    
    for (let x = 0; x < BOARD_SIZE; x++) {
        for (let y = 0; y < BOARD_SIZE; y++) {
            const cell = document.createElement('div');
            cell.className = 'cell';
            cell.dataset.x = x;
            cell.dataset.y = y;
            
            if (containerId === 'computer-board') {
                cell.addEventListener('click', handleAttack);
            }
            
            board.appendChild(cell);
        }
    }
    
    container.appendChild(board);
}

function handleAttack(event) {
    const x = parseInt(event.target.dataset.x);
    const y = parseInt(event.target.dataset.y);
    
    // Human attacks computer
    try {
        humanPlayer.attack(computerPlayer.gameboard, x, y);
        updateGameStatus('Your turn...');
        renderBoards();
        
        if (computerPlayer.gameboard.allShipsSunk()) {
            updateGameStatus('You won! 🎉');
            return;
        }
        
        // Computer counter-attack
        setTimeout(() => {
            const computerAttack = computerPlayer.makeRandomAttack(humanPlayer.gameboard);
            renderBoards();
            
            if (humanPlayer.gameboard.allShipsSunk()) {
                updateGameStatus('Computer won! 😢');
            } else {
                updateGameStatus('Click on computer board to attack!');
            }
        }, 1000);
        
    } catch (error) {
        updateGameStatus(error.message);
    }
}

function placeShipsRandomly(player) {
    FLEET_SIZE.forEach(shipLength => {
        const ship = createShips(shipLength);
        let placed = false;
        
        while (!placed) {
            try {
                const x = Math.floor(Math.random() * BOARD_SIZE);
                const y = Math.floor(Math.random() * BOARD_SIZE);
                const orientation = Math.random() < 0.5 ? 'horizontal' : 'vertical';
                
                player.gameboard.placeShip(ship, x, y, orientation);
                placed = true;
            } catch (error) {
                // Try again if placement fails
            }
        }
    });
}

function renderBoards() {
    renderBoard('player-board', humanPlayer.gameboard, true);
    renderBoard('computer-board', computerPlayer.gameboard, false);
}

function renderBoard(containerId, gameboard, showShips) {
    const container = document.getElementById(containerId);
    const cells = container.querySelectorAll('.cell');
    
    cells.forEach(cell => {
        const x = parseInt(cell.dataset.x);
        const y = parseInt(cell.dataset.y);
        
        cell.className = 'cell';
        
        // Show hits
        if (gameboard.hitShots.some(coord => coord[0] === x && coord[1] === y)) {
            cell.classList.add('hit');
        }
        
        // Show misses
        if (gameboard.missedShots.some(coord => coord[0] === x && coord[1] === y)) {
            cell.classList.add('miss');
        }
        
        // Show ships (only on player board)
        if (showShips) {
            gameboard.ships.forEach(ship => {
                if (ship.coordinates.some(coord => coord[0] === x && coord[1] === y)) {
                    cell.classList.add('ship');
                }
            });
        }
    });
}

function updateGameStatus(message) {
    document.getElementById('game-status').textContent = message;
}

// Start game when page loads
document.addEventListener('DOMContentLoaded', initGame);