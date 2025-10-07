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
        renderBoards();
        
        // Check if ship was sunk and mark surrounding areas
        checkForSunkShips(computerPlayer.gameboard);
        
        if (computerPlayer.gameboard.allShipsSunk()) {
            showGameOverOverlay('You won! 🎉');
            return;
        }
        
        // Check if hit - if hit, player continues
        const wasHit = computerPlayer.gameboard.hitShots.some(coord => coord[0] === x && coord[1] === y);
        
        if (wasHit) {
            updateGameStatus('Hit! Your turn again!');
            return; // Player gets another turn
        } else {
            updateGameStatus('Miss! Computer\'s turn...');
            // Computer counter-attack after miss
            setTimeout(computerTurn, 1000);
        }
        
    } catch (error) {
        updateGameStatus(error.message);
    }
}

function computerTurn() {
    const computerAttack = computerPlayer.makeRandomAttack(humanPlayer.gameboard);
    renderBoards();
    
    // Check if ship was sunk and mark surrounding areas
    checkForSunkShips(humanPlayer.gameboard);
    
    if (humanPlayer.gameboard.allShipsSunk()) {
        showGameOverOverlay('Computer won! 😢');
        return;
    }
    
    // Check if computer hit - if hit, computer continues
    const wasHit = humanPlayer.gameboard.hitShots.some(coord => 
        coord[0] === computerAttack[0] && coord[1] === computerAttack[1]
    );
    
    if (wasHit) {
        updateGameStatus('Computer hit! Computer\'s turn again...');
        setTimeout(computerTurn, 1000); // Computer gets another turn
    } else {
        updateGameStatus('Computer missed! Your turn!');
    }
}

function checkForSunkShips(gameboard) {
    gameboard.ships.forEach(ship => {
        if (ship.isSunk()) {
            // Mark surrounding coordinates as missed if not already attacked
            ship.coordinates.forEach(([shipX, shipY]) => {
                // Check all 8 surrounding positions
                for (let dx = -1; dx <= 1; dx++) {
                    for (let dy = -1; dy <= 1; dy++) {
                        const surroundingX = shipX + dx;
                        const surroundingY = shipY + dy;
                        
                        // Skip the ship coordinate itself
                        if (dx === 0 && dy === 0) continue;
                        
                        // Check if coordinates are within board
                        if (surroundingX >= 0 && surroundingX < BOARD_SIZE && 
                            surroundingY >= 0 && surroundingY < BOARD_SIZE) {
                            
                            // Check if not already hit or missed
                            const alreadyHit = gameboard.hitShots.some(coord => 
                                coord[0] === surroundingX && coord[1] === surroundingY
                            );
                            const alreadyMissed = gameboard.missedShots.some(coord => 
                                coord[0] === surroundingX && coord[1] === surroundingY
                            );
                            
                            if (!alreadyHit && !alreadyMissed) {
                                gameboard.missedShots.push([surroundingX, surroundingY]);
                            }
                        }
                    }
                }
            });
        }
    });
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

function showGameOverOverlay(message) {
    // Disable all computer board clicks
    const computerCells = document.querySelectorAll('#computer-board .cell');
    computerCells.forEach(cell => {
        cell.style.pointerEvents = 'none';
    });
    
    // Create overlay
    const overlay = document.createElement('div');
    overlay.className = 'game-over-overlay';
    overlay.innerHTML = `
        <div class="game-over-content">
            <h2>${message}</h2>
            <button onclick="restartGame()">Play Again</button>
        </div>
    `;
    
    document.body.appendChild(overlay);
    updateGameStatus('Game Over');
}

function restartGame() {
    // Remove overlay
    const overlay = document.querySelector('.game-over-overlay');
    if (overlay) {
        overlay.remove();
    }
    
    // Clear boards
    document.getElementById('player-board').innerHTML = '';
    document.getElementById('computer-board').innerHTML = '';
    
    // Restart game
    initGame();
}

// Start game when page loads
document.addEventListener('DOMContentLoaded', initGame);