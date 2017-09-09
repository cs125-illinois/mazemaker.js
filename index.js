/**
 * Create a maze.
 * @param {Number} columnCount - number of columns in the maze
 * @param {Number} rowCount - number of rows in the maze
 * @return {Object} Object representing a maze
 */

function makeMaker(xDimension, yDimension) {

  // Mazes with negative dimensions or one cell are not valid
  if (xDimension <= 0 || yDimension <= 0 || xDimension * yDimension <= 1) {
    throw new Error("illegal dimensions");
  }

	// Simple maze data structure. All borders start out set and are cleared
  // below.
  var maze = {}, visited = {};
  for (var x = 0; x < xDimension; x++) {
    maze[x] = {};
    for (var y = 0; y < yDimension; y++) {
      maze[x][y] = {
        x: x,
        y: y,
        top: true,
        right: true,
        bottom: true,
        left: true,
        visited: false
      };
    }
  }

	// Pick a random starting point, store it to the path, and mark it as visited
  var currentCell = maze[Math.floor(Math.random() * xDimension)][Math.floor(Math.random() * yDimension)];
  var path = [ currentCell ];
  currentCell.visited = true;
  var unvisitedCount = xDimension * yDimension - 1;

  // Enumerate the movement options and the associated borders to remove
  var nextDirections = [
    {dx: 0, dy: 1, border: "top" },
    {dx: 1, dy: 0, border: "right" },
    {dx: 0, dy: -1, border: "bottom" },
    {dx: -1, dy: 0, border: "left" }
  ];

  while (unvisitedCount > 0) {
    if (!currentCell) {
      throw new Error("path shouldn't become empty");
    }
    var nextCells = [];

    // Examine all neighboring cells
    for (var i = 0; i < nextDirections.length; i++) {
      var nextDirection = nextDirections[i];
      var nextCell = {
        x: currentCell.x + nextDirection.dx,
        y: currentCell.y + nextDirection.dy,
        border: nextDirection.border
      };

      // Is the cell position valid, and is it unvisited?
      if (nextCell.x >= 0 && nextCell.x < xDimension &&
          nextCell.y >= 0 && nextCell.y < yDimension &&
          maze[nextCell.x][nextCell.y].visited === false) {
        nextCells.push(nextCell);
      }
    }

    // If there are no neigboring cells to visit, backtrack
    if (nextCells.length === 0) {
      path.pop();
      currentCell = path.slice(-1)[0];
      continue;
    }

    // Otherwise, choose a cell at random, take out the border, add it to the
    // path, and mark it as visited.
    var nextCell = nextCells[Math.floor(Math.random() * nextCells.length)];
    currentCell[nextCell.border] = false;
    currentCell = maze[nextCell.x][nextCell.y];
    currentCell.visited = true;
    path.push(currentCell);
    unvisitedCount--;
  }
}

exports = module.exports = makeMaker

// vim: ts=2:sw=2:et:ft=javascript
