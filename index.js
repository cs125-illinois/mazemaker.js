var extend = function(obj, src) {
  for (var key in src) {
    if (src.hasOwnProperty(key)) obj[key] = src[key];
  }
  return obj;
}

/**
 * Create a maze.
 * @param {Number} columnCount - number of columns in the maze
 * @param {Number} rowCount - number of rows in the maze
 * @return {Object} Object representing a maze
 */
var mazeMaker = function(xDimension, yDimension, config) {

  const defaults = {
    loops: 0,
    verbose: false
  }
  config = extend(defaults, config);

  // Enumerate the movement options and the associated borders to remove
  const directions = [
  {dx: 0, dy: 1, direction: "up" },
  {dx: 1, dy: 0, direction: "right" },
  {dx: 0, dy: -1, direction: "down" },
  {dx: -1, dy: 0, direction: "left" }
  ];
  const oppositeDirections = {
    up: "down",
    down: "up",
    left: "right",
    right: "left"
  };

  // Mazes with negative dimensions or one cell are not valid
  if (xDimension < 1) {
    throw new Error("xDimension too small");
  }
  if (xDimension < 1) {
    throw new Error("yDimension too small");
  }
  if ((xDimension * yDimension) <= 1) {
    throw new Error("combined dimensions too small");
  }

	// Simple maze data structure. All borders start out set and are cleared
  // below.
  var maze = {};
  for (var x = 0; x < xDimension; x++) {
    maze[x] = {};
    for (var y = 0; y < yDimension; y++) {
      maze[x][y] = {
        x: x,
        y: y,
        visited: false,
        borders: {
          up: true,
          right: true,
          down: true,
          left: true
        },
        neighbors: {}
      };
    }
  }

  // Set neighbors as a convenience for several functions below
  for (var x = 0; x < xDimension; x++) {
    for (var y = 0; y < yDimension; y++) {
      var cell = maze[x][y];
      for (var i = 0; i < directions.length; i++) {
        var direction = directions[i];
        try {
          var neighbor =
            maze[cell.x + direction.dx][cell.y + direction.dy];
          if (neighbor) {
            cell.neighbors[direction.direction] = neighbor;
          }
        } catch (err) { };
      }
    }
  }

	// Pick a random starting point and store it to the path
  var currentCell = maze[Math.floor(Math.random() * xDimension)][Math.floor(Math.random() * yDimension)]
  var path = [ currentCell ];
  var unvisitedCount = xDimension * yDimension - 1;

  while (unvisitedCount > 0) {
    currentCell = path.slice(-1)[0];
    if (typeof(currentCell) === 'undefined') {
      throw new Error("current cell should not be undefined");
    }
    currentCell.visited = true;
    if (config.verbose) {
      console.log("At [" + currentCell.x + ", " + currentCell.y + "]");
    }

    var nextCells = [];
    for (direction in currentCell.neighbors) {
      var cell = currentCell.neighbors[direction];
      if (cell.visited === false) {
        cell.direction = direction;
        nextCells.push(cell);
      }
    }

    // If there are no neighboring cells to visit, backtrack
    if (nextCells.length === 0) {
      if (config.verbose) {
        console.log('backtracking');
      }
      path.pop();
      continue;
    }

    // Otherwise, choose a cell at random, take out the borders, mark it as
    // visited, and add it to the path
    var nextCell = nextCells[Math.floor(Math.random() * nextCells.length)];

    if (config.verbose) {
      console.log("removing " + nextCell.direction + " border from [" + currentCell.x + ", " + currentCell.y + "]");
    }
    if (currentCell.borders[nextCell.direction] !== true) {
      throw new Error("current cell should have this border");
    }
    currentCell.borders[nextCell.direction] = false;

    var oppositeBorder = oppositeDirections[nextCell.direction];
    if (config.verbose) {
      console.log("removing " + oppositeBorder + " border from [" + nextCell.x + ", " + nextCell.y + "]");
    }
    if (nextCell.borders[oppositeBorder] !== true) {
      throw new Error("next cell should have his border");
    }
    nextCell.borders[oppositeBorder] = false;

    unvisitedCount--;
    path.push(nextCell);
  }

  // Validate that the maze is correct by checking if borders match
  for (var x = 0; x < xDimension; x++) {
    for (var y = 0; y < yDimension; y++) {
      var cell = maze[x][y];
      if (x === 0) {
        if (cell.borders.left !== true) {
          throw new Error("cell should have this border");
        }
      }
      if (x === xDimension - 1) {
        if (cell.borders.right !== true) {
          throw new Error("cell should have this border");
        }
      }
      if (y === 0) {
        if (cell.borders.down !== true) {
          throw new Error("cell should have this border");
        }
      }
      if (y === yDimension - 1) {
        if (cell.borders.up !== true) {
          throw new Error("cell should have this border");
        }
      }
      for (direction in cell.neighbors) {
        var neighbor = cell.neighbors[direction];
        if (cell.borders[direction] !== neighbor.borders[oppositeDirections[direction]]) {
          throw new Error("mismatched borders");
        }
      }
    }
  }

  // Clean up the maze structure
  for (var x = 0; x < xDimension; x++) {
    for (var y = 0; y < yDimension; y++) {
      var cell = maze[x][y];
      delete(cell.neighbors);
      delete(cell.visited);
    }
  }

  return maze;
}

exports = module.exports = mazeMaker

// vim: ts=2:sw=2:et:ft=javascript
