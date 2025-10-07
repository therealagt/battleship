# 🚢 Battleship Game

A fully functional Battleship game built with vanilla JavaScript using Test-Driven Development (TDD). Play against an intelligent computer opponent with classic Battleship rules.

## 🎮 Features

### Core Gameplay
- **10x10 Grid** with classic Battleship fleet composition
- **Human vs Computer** gameplay
- **Turn-based combat** with "hit and continue" rule
- **Computer AI** with adjacent targeting
- **Auto-reveal** around sunken ships
- **Game Over overlay** with restart functionality

### Fleet Composition
- 1x Aircraft Carrier (4 cells)
- 2x Cruiser (3 cells each)  
- 3x Destroyer (2 cells each)
- 4x Submarine (1 cell each)

## 🏗️ Architecture

### Factory Pattern Implementation

**Ship Factory (`createShips`)**
```javascript
// Creates ship objects with hit tracking and placement logic
const ship = createShips(3); // Creates a 3-cell ship
ship.place(2, 3, 'horizontal'); // Places ship at coordinates
ship.hit(); // Registers a hit
ship.isSunk(); // Returns true when fully destroyed
```

**Gameboard Factory (`createGameboard`)**
```javascript
// Manages ship placement, attack coordination, and game state
const gameboard = createGameboard();
gameboard.placeShip(ship, x, y, orientation);
gameboard.receivedAttack(x, y);
gameboard.allShipsSunk(); // Win condition check
```

**Player Factory (`createPlayer`)**
```javascript
// Creates human or computer players with different capabilities
const human = createPlayer('human');
const computer = createPlayer('computer'); // Includes AI methods
```

## 🤖 Computer AI Implementation

### Smart Targeting System
1. **Random Phase**: Attacks random coordinates until hit
2. **Hunt Phase**: After hitting a ship, targets all 4 adjacent cells
3. **Priority Queue**: Maintains list of high-priority targets
4. **No Duplicates**: Tracks all previous attacks to avoid repetition

```javascript
// Computer attack logic
computer.makeRandomAttack(enemyGameboard);
// 1. Check priority targets first
// 2. If none, generate random coordinates
// 3. On hit, add adjacent cells to priority queue
```

## 🔧 Technical Implementation

### Test-Driven Development
- **100+ comprehensive tests** covering all game logic
- **Jest testing framework** with full coverage
- **Red-Green-Refactor** methodology throughout development

### Validation & Error Handling
- **Boundary checking** for ship placement and attacks
- **Overlap prevention** between ships
- **Adjacent ship prevention** (ships can't touch)
- **Duplicate attack prevention**
- **Input validation** for all coordinates

### Game Rules Implementation

**Ship Placement Rules:**
- Ships must fit within board boundaries
- Ships cannot overlap
- Ships cannot be adjacent (including diagonally)
- Random placement for both players

**Attack Rules:**
- Player continues attacking after successful hit
- Computer uses intelligent targeting after hits
- Invalid coordinates are rejected
- Duplicate attacks are prevented

**Win Conditions:**
- Game ends when all ships of one player are sunk
- Auto-reveal cells around sunken ships
- Game over overlay with restart option

## 📁 Project Structure

```
battleship/
├── battleship.js      # Core game logic (factories & rules)
├── dom.js            # DOM manipulation & UI logic  
├── index.html        # Game structure
├── styles.css        # Battleship-themed styling
├── test/
│   └── battleship.test.js  # Comprehensive test suite
├── package.json      # Dependencies & scripts
└── README.md         # This file
```

## 🎨 Visual Design

### Classic Battleship Aesthetic
- **Navy blue** color scheme with maritime feel
- **Grid-based layout** with clear cell boundaries
- **Visual feedback** for hits (red X), misses (gray dots), ships (blue)
- **Hover effects** for interactive elements
- **Responsive design** for different screen sizes

### UI Elements
- **Dual board display** (player board shows ships, computer board hidden)
- **Game status messages** with real-time feedback
- **Overlay system** for game over states
- **Minimalist design** focusing on gameplay

## 🚀 Getting Started

1. **Clone the repository**
2. **Install dependencies**: `npm install`
3. **Run tests**: `npm test`
4. **Open `index.html`** in your browser to play

## 🧪 Testing

The project includes comprehensive tests covering:
- Ship creation and placement logic
- Gameboard attack coordination
- Player factory functionality  
- Computer AI behavior
- Edge cases and error handling
- Win condition detection

Run tests with: `npm test`

## 🏆 Key Features Implemented

- ✅ **Factory Pattern** for clean object creation
- ✅ **TDD Methodology** with full test coverage
- ✅ **Intelligent Computer AI** with adjacent targeting
- ✅ **Classic Battleship Rules** faithfully implemented
- ✅ **Error Handling** for all edge cases
- ✅ **Responsive UI** with maritime theming
- ✅ **Game State Management** with proper win/lose conditions

-----

*Built with vanilla JavaScript, no frameworks required. Demonstrates clean code principles, TDD methodology, and factory pattern implementation.*
