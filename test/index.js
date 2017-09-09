const _ = require('underscore'),
      expect = require('chai').expect,
      mazemaker = require('../index.js');

describe('mazemaker', function() {
  it('should generate mazes', function() {
    this.slow(2000);
    this.timeout(4000);
    var xDimension = _.random(80, 100);
    var yDimension = _.random(80, 100);
    var maze = mazemaker(xDimension, yDimension);
    for (var x = 0; x < xDimension; x++) {
      for (var y = 0; y < yDimension; y++) {
        expect(maze[x][y]).to.not.be.undefined;
        expect(maze[x][y].x).to.equal(x);
        expect(maze[x][y].y).to.equal(y);
        var borderCount = _.filter(maze[x][y].borders, function (border) {
          return border;
        }).length;
        expect(borderCount).to.be.below(4);
      }
    }
  });
});

// vim: ts=2:sw=2:et:ft=javascript
