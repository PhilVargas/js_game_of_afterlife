import { default as chai } from 'chai';
const expect = chai.expect;

import { default as Pathfinder } from 'pathfinder';

describe('Pathfinder', function(){
  describe('#distanceTo', function(){
    let coord1, coord2;

    beforeEach(function(){
      coord1 = { x: 0, y: 0 };
      coord2 = { x: 1, y: 1 };
    });

    it('should give the distance between two points', function(){
      expect(Pathfinder.distanceTo(coord1, coord2)).to.equal(Math.sqrt(2));
    });
  });

  describe('::arePositionsEqual', function(){
    context('comparing two unequal positions', function(){
      it('returns false', function(){
        expect(Pathfinder.arePositionsEqual({ x: 10, y: 10 }, { x: 5, y: 5 })).to.equal(false);
      });
    });

    context('comparing two equal positions', function(){
      it('returns true', function(){
        expect(Pathfinder.arePositionsEqual({ x: 5, y: 5 }, { x: 5, y: 5 })).to.equal(true);
      });
    });
  });

  describe('::getRelativePosition', function(){
    context('when not exceeding the board boundries', function(){
      it('returns the position', function(){
        expect(Pathfinder.getRelativePosition({ x: 60, y: 40 })).to.eql({ x: 60, y: 40 });
      });
    });

    context('when exceeding the board boundries', function(){
      it('returns the relative board position', function(){
        expect(Pathfinder.getRelativePosition({ x: 605, y: 410 })).to.eql({ x: 5, y: 10 });
      });
    });
  });
});
