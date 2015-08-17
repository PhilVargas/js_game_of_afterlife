require('babel/register');
var chai, expect;
chai = require('chai');
expect = chai.expect;

var Pathfinder;

Pathfinder = require('pathfinder');

describe('Pathfinder', function(){

  describe('#distanceTo', function(){
    var coord1, coord2;
    beforeEach(function(){
      coord1 = { x:0, y:0 };
      coord2 = { x:1, y:1 };
    });

    it('should give the distance between two points', function(){
      expect(Pathfinder.distanceTo(coord1,coord2)).to.equal(Math.sqrt(2));
    });
  });
});