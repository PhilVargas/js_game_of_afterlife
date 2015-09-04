let chai, sinon, expect;

chai = require('chai');
sinon = require('sinon');
expect = chai.expect;

let Zombie, Human, gameSettings, Pathfinder;

Human = require('humanoids/human');
Zombie = require('humanoids/zombie');
gameSettings = require('settings');
Pathfinder = require('pathfinder');

describe('Zombie', function(){
  let zombie, human;

  describe('A zombie', function(){
    beforeEach(function(){
      zombie = new Zombie({ id: 0, position: { x: 25, y: 25 } });
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
      human = new Human({ id: 1 });
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

  describe('#isValidDestination', function(){
    context('when target destination is not identical to a position', function(){
      it('returns true', function(){
        expect(
          zombie.isValidDestination(
            [{ position: { x: 0, y: 0 } }, { position: { x: 1, y: 1 } }], { x: 0, y: 1 }
          )
        ).to.equal(true);
      });
    });

    context('when target destination is identical to a position', function(){
      it('returns false', function(){
        expect(
          zombie.isValidDestination(
            [{ position: { x: 0, y: 0 } }, { position: { x: 1, y: 1 } }], { x: 0, y: 0 }
          )
        ).to.equal(false);
      });
    });
  });

  describe('#getNextDestination', function(){
    let otherZombie;

    beforeEach(function(){
      chai.spy.on(zombie, 'moveNearest');
      otherZombie = new Zombie({ id: 2 });
      human = new Human({ id: 3 });
    });

    afterEach(function(){
      Pathfinder.distanceTo.restore();
    });

    context('a zombie is closer than the nearestHuman', function(){
      beforeEach(function(){
        sinon.stub(Pathfinder, 'distanceTo');
        Pathfinder.distanceTo.withArgs(otherZombie.position, zombie.position).returns(1);
        Pathfinder.distanceTo.withArgs(human.position, zombie.position).returns(10);
        zombie.getNextDestination(human, otherZombie);
      });

      it('calls `zombie.moveNearest`, with the zombie', function(){
        expect(zombie.moveNearest).to.have.been.called.with(otherZombie);
      });
    });

    context('a living humanoid is is closer than the nearest zombie', function(){
      beforeEach(function(){
        sinon.stub(Pathfinder, 'distanceTo');
        Pathfinder.distanceTo.withArgs(otherZombie.position, zombie.position).returns(10);
        Pathfinder.distanceTo.withArgs(human.position, zombie.position).returns(1);
        zombie.getNextDestination(human, otherZombie);
      });

      it('calls `zombie.moveNearest`, with the humanoid', function(){
        expect(zombie.moveNearest).to.have.been.called.with(human);
      });
    });
  });

  describe('#handleNextMove', function(){
    it('tests the refactored method', function(){
    });
  });
});


