const expect = require('chai').expect,
      mazemaker = require('../index.js');

describe('mazemaker', function() {
  it('should generate a small maze', function() {
    mazemaker(4, 4);
  });
});

// vim: ts=2:sw=2:et:ft=javascript
