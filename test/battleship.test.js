const { createShips, createGameboard } = require('../battleship');

// Ship Factory Tests
describe('createShips', () => {
    test('should create a ship with correct length', () => {
        const ship = createShips(3);
        expect(ship.length).toBe(3);
    });

    test('should create a ship with 0 initial hits', () => {
        const ship = createShips(4);
        expect(ship.numOfHits).toBe(0);
    });

    test('should create a ship that is not sunk initially', () => {
        const ship = createShips(2);
        expect(ship.sunk).toBe(false);
    });

    test('should increase hits when hit() is called', () => {
        const ship = createShips(3);
        ship.hit();
        expect(ship.numOfHits).toBe(1);
    });

    test('should not be sunk after one hit', () => {
        const ship = createShips(3);
        ship.hit();
        expect(ship.isSunk()).toBe(false);
    });

    test('should be sunk when hits equal length', () => {
        const ship = createShips(2);
        ship.hit();
        ship.hit();
        expect(ship.isSunk()).toBe(true);
    });
});

// Gameboard Placement Tests 
describe('placeShips', () => {
    test('should create a ship at correct coordinates', () => {
        const ship = createShips(3);
        ship.place(2, 3, 'horizontal');
        expect(ship.coordinates).toEqual([[2, 3], [2, 4], [2, 5]]);
    });
    test('should place ship vertically', () => {
        const ship = createShips(2);
        ship.place(1, 1, 'vertical');
        expect(ship.coordinates).toEqual([[1,1], [2,1]]);
    });

    test('should throw error when ship goes outside board horizontally', () => {
        const ship = createShips(3);
        expect(() => {
            ship.place(0, 8, 'horizontal'); 
        }).toThrow();
    });

    test('should throw error when ship goes outside board vertically', () => {
        const ship = createShips(3);
        expect(() => {
            ship.place(8, 0, 'vertical'); 
        }).toThrow();
    });

    test('should throw error for negative coordinates', () => {
        const ship = createShips(2);
        expect(() => {
            ship.place(-1, 5, 'horizontal');
        }).toThrow();
    });

    test('should throw error when ships overlap', () => {
        const gameboard = createGameboard();
        const ship1 = createShips(3);
        const ship2 = createShips(2);
        
        gameboard.placeShip(ship1, 0, 0, 'horizontal'); 
        expect(() => {
            gameboard.placeShip(ship2, 0, 1, 'vertical'); 
        }).toThrow();
    });
});

// Receiving Attacks Tests
describe('receiveAttacks', () => {
    test ('should determine if correct ship got hit', () => {
        const gameboard = createGameboard();
        const ship1 = createShips(3)
        const ship2 = createShips(2);

        gameboard.placeShip(ship1, 2, 3, 'horizontal');
        gameboard.placeShip(ship2, 5, 5, 'vertical');

        gameboard.receivedAttack(2, 4);

        expect(ship1.numOfHits).toBe(1);
        expect(ship2.numOfHits).toBe(0);
    });

    test ('should record coordinates if missed', () => {
        const gameboard = createGameboard();
        gameboard.receivedAttack(1, 1);

        expect(gameboard.missedShots).toEqual([1, 1]);
    });

    test ('should keep track of missed shots', () => {
        const gameboard = createGameboard();
        gameboard.receivedAttack(2, 2);
        gameboard.receivedAttack(4, 4);

        expect(gameboard.missedShots).toEqual([[2, 2], [4, 4]]);
    });

    test('should not hit same coordinates twice', () => {
        const gameboard = createGameboard();
        const ship = createShips(2);
        gameboard.placeShip(ship, 0, 0, 'horizontal');
        
        gameboard.receivedAttack(0, 0); 
        expect(() => {
            gameboard.receivedAttack(0, 0); 
        }).toThrow('Already attacked');
    });

    test('should correctly handle attacks outside board', () => {
        const gameboard = createGameboard();
        expect(() => {
            gameboard.receivedAttack(-1, 5);
        }).toThrow();
    });

    test ('should be able to report if all ships sunk', () => {
        const gameboard = createGameboard();
        const ship1 = createShips(2);
        const ship2 = createShips(1);
        
        gameboard.placeShip(ship1, 0, 0, 'horizontal');
        gameboard.placeShip(ship2, 1, 0, 'horizontal');
        
        gameboard.receivedAttack(0, 0); 
        gameboard.receivedAttack(0, 1); 
        gameboard.receivedAttack(1, 0); 
        
        expect(gameboard.allShipsSunk()).toBe(true);
    });

    test ('should report false if not all ships sunk', () => {
        const gameboard = createGameboard();
        const ship1 = createShips(2);
        const ship2 = createShips(1);
        
        gameboard.placeShip(ship1, 0, 0, 'horizontal');
        gameboard.placeShip(ship2, 1, 0, 'horizontal');
        
        gameboard.receivedAttack(0, 0); 
        
        expect(gameboard.allShipsSunk()).toBe(false);
    });
});


