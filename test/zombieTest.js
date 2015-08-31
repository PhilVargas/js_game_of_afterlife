require('babel/register');
var chai, sinon, expect;
chai = require('chai');
chai.use(require('chai-spies'));
sinon = require('sinon');
expect = chai.expect;

var Zombie, Human, gameSettings, Pathfinder;

Human = require('humanoids/human');
Zombie = require('humanoids/zombie');
gameSettings = require('settings');
Pathfinder = require('pathfinder');

describe('Zombie', function(){
  var zombie, human;
  describe('A zombie', function(){
    beforeEach(function(){
      zombie = new Zombie({id: 0, position: {x: 25, y: 25}});
    });

    it('is a Zombie `#humanType`', function(){
      expect(zombie.humanType).to.equal('Zombie');
    });

    it('has a speed equal to the zombie speed settings', function(){
      expect(zombie.speed).to.equal(gameSettings.zombieSpeed);
    });
  });

  describe('#isAbleToBite', function(){
    beforeEach(function(){
      human = new Human({id: 1});
    });

    afterEach(function(){
      Pathfinder.distanceTo.restore();
    });

    context('when target is within the `zombieBiteRange`', function(){
      beforeEach(function(){
        sinon.stub(Pathfinder, 'distanceTo').returns(gameSettings.zombieBiteRange - 1);
      });
      it('returns true', function(){
        expect(zombie.isAbleToBite(human)).to.equal(true);
      });
    });

    context('when target is within the `zombieBiteRange`', function(){
      beforeEach(function(){
        sinon.stub(Pathfinder, 'distanceTo').returns(gameSettings.zombieBiteRange + 1);
      });
      it('returns false', function(){
        expect(zombie.isAbleToBite(human)).to.equal(false);
      });
    });
  });

  describe('#transform', function(){
    // transform should not be called on zombies, but if it is, it should just return the current
    // zombie.
    it('returns the zombie', function(){
      expect(zombie.transform()).to.equal(zombie);
    });
  });
});


