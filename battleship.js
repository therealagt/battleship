BOARD_SIZE = 10;

FLEET_SIZE = [4, 3, 3, 2, 2, 2, 1, 1, 1, 1];

function createShips(length) {
    return {
        length: length,
        numOfHits: 0,
        sunk: false,
        coordinates: [],
    
        hit() {
            return this.numOfHits++;
        },

        isSunk() {
            return this.numOfHits === this.length;   
        },

        place(x, y, orientation) {
            if (x < 0 || y < 0) {
                throw new Error('Coordinates can`t be negative.');
            }

            if (orientation === 'horizontal') {
                if (y + this.length > BOARD_SIZE) {
                    throw new Error('Ship goes outside the board horizontally.');
                } 
            } else if (orientation === 'vertical') {
                if (x + this.length > BOARD_SIZE) {
                    throw new Error('Ship goes outside the board vertically.');
                }
            }

            this.coordinates = [];
            for (let i = 0; i < this.length; i++) {
                if (orientation === 'horizontal') {
                    this.coordinates.push([x, y + i]);
                } else {
                    this.coordinates.push([x + i, y]);
                }
            }
        
        }
    };
}

function createGameboard() {
    return {
        ships: [],
        missedShots: [], 

        placeShip(ship, x, y, orientation) {
            ship.place(x, y, orientation);
    
            for (let existingShip of this.ships) {
                for (let shipCoord of ship.coordinates) {
                    for (let existingCoord of existingShip.coordinates) {
                        if (shipCoord[0] === existingCoord[0] && shipCoord[1] === existingCoord[1]) {
                            throw new Error('Ships can`t overlap');
                        }
                    }
                }
            }

        this.ships.push(ship);
        },
    
        receivedAttack(x, y) {

        },

        allShipsSunk() {

        }
    }
}


module.exports = {
    createShips,
    createGameboard
};