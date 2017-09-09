const _ = require('underscore'),
      assert = require('chai').assert,
      debug = require('debug')('mazemaker');

'use strict';

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

const defaults = {
  loops: 0
}
var mazeMaker = function(xDimension, yDimension, config) {
  config = _.extend(_.clone(defaults), config);

  // Mazes with negative dimensions or one cell are not valid
  assert(xDimension >= 1, 'xDimension too small');
  assert(yDimension >= 1, 'yDimension too small');
  assert((xDimension * yDimension) > 1, 'combined dimensions too small');

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
    assert.notTypeOf(currentCell, 'undefined', 'current cell should not be undefined');
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
    assert(currentCell.borders[nextCell.direction] === true, 'current cell should have this border');
    currentCell.borders[nextCell.direction] = false;

    var oppositeBorder = oppositeDirections[nextCell.direction];
    debug(`removing ${oppositeBorder} border from [${nextCell.x}, ${nextCell.y}]`);
    assert(nextCell.borders[oppositeBorder] === true, 'next cell should have his border');
    nextCell.borders[oppositeBorder] = false;

    unvisitedCount--;
    path.push(nextCell);
  }

  // Validate that the maze is correct by checking if borders match
  for (var x = 0; x < xDimension; x++) {
    for (var y = 0; y < yDimension; y++) {
      var cell = maze[x][y];
      if (x === 0) {
        assert(cell.borders.left === true);
      }
      if (x === xDimension - 1) {
        assert(cell.borders.right === true);
      }
      if (y === 0) {
        assert(cell.borders.down === true);
      }
      if (y === yDimension - 1) {
        assert(cell.borders.up === true);
      }
      _.each(cell.neighbors, function (neighbor, direction) {
        assert(cell.borders[direction] === neighbor.borders[oppositeDirections[direction]]);
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

exports = module.exports = global.mazeMaker = mazeMaker

// vim: ts=2:sw=2:et:ft=javascript
