const _ = require('underscore'),
      expect = require('chai').expect,
      debug = require('debug')('mazemaker');

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
/**
 * Create a maze.
 * @param {Number} columnCount - number of columns in the maze
 * @param {Number} rowCount - number of rows in the maze
 * @return {Object} Object representing a maze
 */

function mazeMaker(xDimension, yDimension) {

  // Mazes with negative dimensions or one cell are not valid
  expect(xDimension).to.be.at.least(1);
  expect(yDimension).to.be.at.least(1);
  expect(xDimension * yDimension).to.be.at.least(1);

	// Simple maze data structure. All borders start out set and are cleared
  // below.
  var maze = {}, visited = {};
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
      _.each(directions, function (direction) {
        try {
          var neighbor =
            maze[cell.x + direction.dx][cell.y + direction.dy];
          if (neighbor) {
            cell.neighbors[direction.direction] = neighbor;
          }
        } catch (err) { };
      });
    }
  }

	// Pick a random starting point and store it to the path
  var currentCell = maze[_.random(0, xDimension - 1)][_.random(0, yDimension - 1)];
  var path = [ currentCell ];
  var unvisitedCount = xDimension * yDimension - 1;

  while (unvisitedCount > 0) {
    currentCell = _.last(path);
    expect(currentCell).to.not.be.undefined;
    currentCell.visited = true;
    debug(`At ${currentCell.x}, ${currentCell.y}`);

    var nextCells = _.chain(currentCell.neighbors)
      .each(function (cell, direction) {
        cell.direction = direction;
      })
      .filter(function (cell) {
        return cell.visited === false;
      })
      .value();

    // If there are no neighboring cells to visit, backtrack
    if (nextCells.length === 0) {
      debug('backtracking');
      path.pop();
      continue;
    }

    // Otherwise, choose a cell at random, take out the borders, mark it as
    // visited, and add it to the path
    var nextCell = _.sample(nextCells);

    debug(`removing ${nextCell.direction} border from [${currentCell.x}, ${currentCell.y}]`);
    expect(currentCell.borders[nextCell.direction]).to.be.true;
    currentCell.borders[nextCell.direction] = false;

    var oppositeBorder = oppositeDirections[nextCell.direction];
    debug(`removing ${oppositeBorder} border from [${nextCell.x}, ${nextCell.y}]`);
    expect(nextCell.borders[oppositeBorder]).to.be.true;
    nextCell.borders[oppositeBorder] = false;

    unvisitedCount--;
    path.push(nextCell);
  }

  // Validate that the maze is correct by checking if borders match
  for (var x = 0; x < xDimension; x++) {
    for (var y = 0; y < yDimension; y++) {
      var cell = maze[x][y];
      if (x === 0) {
        expect(cell.borders).to.have.property('left', true);
      }
      if (x === xDimension - 1) {
        expect(cell.borders).to.have.property('right', true);
      }
      if (y === 0) {
        expect(cell.borders).to.have.property('down', true);
      }
      if (y === yDimension - 1) {
        expect(cell.borders).to.have.property('up', true);
      }
      _.each(cell.neighbors, function (neighbor, direction) {
        expect(cell.borders[direction]).to.equal(neighbor.borders[oppositeDirections[direction]]);
      });
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
