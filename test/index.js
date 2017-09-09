const _ = require('underscore'),
      expect = require('chai').expect,
      mazemaker = require('../index.js');

describe('mazemaker', function() {
  it('should generate mazes', function() {
    this.slow(1000);
    this.timeout(2000);
    var maze = mazemaker(_.random(80, 100), _.random(80, 100));
  });
});

// vim: ts=2:sw=2:et:ft=javascript
