BOARD_SIZE = 10;

FLEET_SIZE = [4, 3, 3, 2, 2, 2, 1, 1, 1, 1];

function createShips(length) {
    return {
        length: length,
        numOfHits: 0,
        sunk: false,
    
        hit() {
            return this.numOfHits++;
        },

        isSunk() {
            return this.numOfHits === this.length;   
        }
    };
}



let currentPlayer;
let gameOver = false;

module.exports = {
    createShips
};