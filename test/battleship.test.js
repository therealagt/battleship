const {
  createShips,
  createGameboard,
  createPlayer,
  BOARD_SIZE,
} = require("../battleship");

// Ship Factory Tests
describe("createShips", () => {
  test("should create a ship with correct length", () => {
    const ship = createShips(3);
    expect(ship.length).toBe(3);
  });

  test("should create a ship with 0 initial hits", () => {
    const ship = createShips(4);
    expect(ship.numOfHits).toBe(0);
  });

  test("should create a ship that is not sunk initially", () => {
    const ship = createShips(2);
    expect(ship.sunk).toBe(false);
  });

  test("should increase hits when hit() is called", () => {
    const ship = createShips(3);
    ship.hit();
    expect(ship.numOfHits).toBe(1);
  });

  test("should not be sunk after one hit", () => {
    const ship = createShips(3);
    ship.hit();
    expect(ship.isSunk()).toBe(false);
  });

  test("should be sunk when hits equal length", () => {
    const ship = createShips(2);
    ship.hit();
    ship.hit();
    expect(ship.isSunk()).toBe(true);
  });
});

// Gameboard Placement Tests
describe("placeShips", () => {
  test("should create a ship at correct coordinates", () => {
    const ship = createShips(3);
    ship.place(2, 3, "horizontal");
    expect(ship.coordinates).toEqual([
      [2, 3],
      [2, 4],
      [2, 5],
    ]);
  });
  test("should place ship vertically", () => {
    const ship = createShips(2);
    ship.place(1, 1, "vertical");
    expect(ship.coordinates).toEqual([
      [1, 1],
      [2, 1],
    ]);
  });

  test("should throw error when ship goes outside board horizontally", () => {
    const ship = createShips(3);
    expect(() => {
      ship.place(0, 8, "horizontal");
    }).toThrow();
  });

  test("should throw error when ship goes outside board vertically", () => {
    const ship = createShips(3);
    expect(() => {
      ship.place(8, 0, "vertical");
    }).toThrow();
  });

  test("should throw error for negative coordinates", () => {
    const ship = createShips(2);
    expect(() => {
      ship.place(-1, 5, "horizontal");
    }).toThrow();
  });

  test("should throw error when ships overlap", () => {
    const gameboard = createGameboard();
    const ship1 = createShips(3);
    const ship2 = createShips(2);

    gameboard.placeShip(ship1, 0, 0, "horizontal");
    expect(() => {
      gameboard.placeShip(ship2, 0, 1, "vertical");
    }).toThrow();
  });
});

// Receiving Attacks Tests
describe("receiveAttacks", () => {
  test("should determine if correct ship got hit", () => {
    const gameboard = createGameboard();
    const ship1 = createShips(3);
    const ship2 = createShips(2);

    gameboard.placeShip(ship1, 2, 3, "horizontal");
    gameboard.placeShip(ship2, 5, 5, "vertical");

    gameboard.receivedAttack(2, 4);

    expect(ship1.numOfHits).toBe(1);
    expect(ship2.numOfHits).toBe(0);
  });

  test("should record coordinates if missed", () => {
    const gameboard = createGameboard();
    gameboard.receivedAttack(1, 1);

    expect(gameboard.missedShots).toEqual([[1, 1]]);
  });

  test("should keep track of missed shots", () => {
    const gameboard = createGameboard();
    gameboard.receivedAttack(2, 2);
    gameboard.receivedAttack(4, 4);

    expect(gameboard.missedShots).toEqual([
      [2, 2],
      [4, 4],
    ]);
  });

  test("should not hit same coordinates twice", () => {
    const gameboard = createGameboard();
    const ship = createShips(2);
    gameboard.placeShip(ship, 0, 0, "horizontal");

    gameboard.receivedAttack(0, 0);
    expect(() => {
      gameboard.receivedAttack(0, 0);
    }).toThrow("Already attacked");
  });

  test("should correctly handle attacks outside board", () => {
    const gameboard = createGameboard();
    expect(() => {
      gameboard.receivedAttack(-1, 5);
    }).toThrow();
  });

  test("should be able to report if all ships sunk", () => {
    const gameboard = createGameboard();
    const ship1 = createShips(2);
    const ship2 = createShips(1);

    gameboard.placeShip(ship1, 0, 0, "horizontal");
    gameboard.placeShip(ship2, 1, 0, "horizontal");

    gameboard.receivedAttack(0, 0);
    gameboard.receivedAttack(0, 1);
    gameboard.receivedAttack(1, 0);

    expect(gameboard.allShipsSunk()).toBe(true);
  });

  test("should report false if not all ships sunk", () => {
    const gameboard = createGameboard();
    const ship1 = createShips(2);
    const ship2 = createShips(1);

    gameboard.placeShip(ship1, 0, 0, "horizontal");
    gameboard.placeShip(ship2, 1, 0, "horizontal");

    gameboard.receivedAttack(0, 0);

    expect(gameboard.allShipsSunk()).toBe(false);
  });
});

// Player Factory Tests
describe("createPlayer", () => {
  test("should create a human player with gameboard", () => {
    const player = createPlayer("human");
    expect(player.gameboard).toBeDefined();
    expect(player.type).toBe("human");
  });

  test("should create a computer player with gameboard", () => {
    const player = createPlayer("computer");
    expect(player.gameboard).toBeDefined();
    expect(player.type).toBe("computer");
  });

  test("should be able to attack enemy gameboard", () => {
    const human = createPlayer("human");
    const computer = createPlayer("computer");

    const ship = createShips(2);
    computer.gameboard.placeShip(ship, 0, 0, "horizontal");

    human.attack(computer.gameboard, 0, 0);
    expect(ship.numOfHits).toBe(1);
  });
});

// Computer Player Tests
describe("createPlayer - Computer AI", () => {
  test("should create computer player with makeRandomAttack method", () => {
    const computer = createPlayer("computer");
    expect(computer.type).toBe("computer");
    expect(typeof computer.makeRandomAttack).toBe("function");
  });

  test("should make random attacks on enemy gameboard", () => {
    const computer = createPlayer("computer");
    const enemy = createPlayer("human");

    const ship = createShips(3);
    enemy.gameboard.placeShip(ship, 2, 2, "horizontal");

    const attack = computer.makeRandomAttack(enemy.gameboard);

    expect(attack).toHaveLength(2); // [x, y] coordinates
    expect(attack[0]).toBeGreaterThanOrEqual(0);
    expect(attack[0]).toBeLessThan(BOARD_SIZE);
    expect(attack[1]).toBeGreaterThanOrEqual(0);
    expect(attack[1]).toBeLessThan(BOARD_SIZE);
  });

  test("should not attack same coordinates twice", () => {
    const computer = createPlayer("computer");
    const enemy = createPlayer("human");

    for (let i = 0; i < BOARD_SIZE * BOARD_SIZE - 1; i++) {
      computer.attackedCoordinates.push([
        Math.floor(i / BOARD_SIZE),
        i % BOARD_SIZE,
      ]);
    }

    const attack = computer.makeRandomAttack(enemy.gameboard);
    expect(attack).toEqual([9, 9]);
  });

  test("should target adjacent coordinates after a hit", () => {
    const computer = createPlayer("computer");
    const enemy = createPlayer("human");

    const ship = createShips(3);
    enemy.gameboard.placeShip(ship, 5, 5, "horizontal");

    computer.attack(enemy.gameboard, 5, 5);
    computer.targetAdjacent(5, 5, enemy.gameboard);

    expect(computer.priorityTargets).toContainEqual([4, 5]);
    expect(computer.priorityTargets).toContainEqual([6, 5]);
    expect(computer.priorityTargets).toContainEqual([5, 4]);
    expect(computer.priorityTargets).toContainEqual([5, 6]);
  });

  test("should use priority targets before random attacks", () => {
    const computer = createPlayer("computer");
    const enemy = createPlayer("human");

    computer.priorityTargets = [
      [3, 3],
      [4, 4],
    ];

    const attack1 = computer.makeRandomAttack(enemy.gameboard);
    expect(attack1).toEqual([3, 3]);

    const attack2 = computer.makeRandomAttack(enemy.gameboard);
    expect(attack2).toEqual([4, 4]);
  });

  test("should filter out invalid adjacent coordinates", () => {
    const computer = createPlayer("computer");
    const enemy = createPlayer("human");

    computer.targetAdjacent(0, 0, enemy.gameboard);

    expect(computer.priorityTargets).toContainEqual([1, 0]);
    expect(computer.priorityTargets).toContainEqual([0, 1]);

    const hasInvalid = computer.priorityTargets.some(
      (coord) => coord[0] === -1 || coord[1] === -1
    );
    expect(hasInvalid).toBe(false);
  });

  test("should not target already attacked coordinates", () => {
    const computer = createPlayer("computer");
    const enemy = createPlayer("human");

    computer.attackedCoordinates = [
      [4, 5],
      [6, 5],
    ];
    computer.targetAdjacent(5, 5, enemy.gameboard);

    expect(computer.priorityTargets).not.toContainEqual([4, 5]);
    expect(computer.priorityTargets).not.toContainEqual([6, 5]);
    expect(computer.priorityTargets).toContainEqual([5, 4]);
    expect(computer.priorityTargets).toContainEqual([5, 6]);
  });

  test("should handle hitting a ship correctly", () => {
    const computer = createPlayer("computer");
    const enemy = createPlayer("human");

    const ship = createShips(2);
    enemy.gameboard.placeShip(ship, 3, 3, "horizontal");

    const originalRandom = Math.random;
    Math.random = () => 0.35;

    computer.makeRandomAttack(enemy.gameboard);

    expect(ship.numOfHits).toBe(1);
    expect(enemy.gameboard.hitShots).toContainEqual([3, 3]);

    Math.random = originalRandom;
  });
});
