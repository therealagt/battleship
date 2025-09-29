const { createShips } = require('../battleship');

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