import { default as chai } from 'chai';
import { default as sinon } from 'sinon';
const expect = chai.expect;

import { default as Human } from 'humanoids/human';
import { default as Zombie } from 'humanoids/zombie';
import { default as Settings } from 'settings';
import { default as Pathfinder } from 'pathfinder';

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
      expect(zombie.speed).to.equal(Settings.zombieSpeed);
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
        sinon.stub(Pathfinder, 'distanceTo').returns(Settings.zombieBiteRange - 1);
      });
      it('returns true', function(){
        expect(zombie.isAbleToBite(human)).to.equal(true);
      });
    });

    context('when target is within the `zombieBiteRange`', function(){
      beforeEach(function(){
        sinon.stub(Pathfinder, 'distanceTo').returns(Settings.zombieBiteRange + 1);
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
    let humanoids, otherZombie, opts;

    beforeEach(function(){
      otherZombie = new Zombie({ id: 1 });
      human = new Human({ id: 2 });
      chai.spy.on(human, 'transform');
      chai.spy.on(zombie, 'getNextDestination');
      humanoids = [zombie, otherZombie, human];
      opts = {
        nearestHumanoid: human,
        nearestZombie: otherZombie,
        humanoids
      };
    });

    it('calls getNextDestination with the nearest zombie and humanoid', function(){
      zombie.handleNextMove(opts);
      expect(zombie.getNextDestination).to.have.been.called.with(human, otherZombie);
    });

    context('when the destination is not valid', function(){
      beforeEach(function(){
        const destination = { x: 5, y: 5 };

        sinon.stub(Pathfinder, 'getRelativePosition').returns(destination);
        sinon.stub(zombie, 'isValidDestination').returns(false);
      });

      afterEach(function(){
        Pathfinder.getRelativePosition.restore();
        zombie.isValidDestination.restore();
      });

      it('does not change the zombie position', function(){
        expect(function(){
          return zombie.position;
        }).to.not.change.when(function(){
          zombie.handleNextMove(opts);
        });
      });
    });

    context('when the destination is valid', function(){
      let destination;

      beforeEach(function(){
        destination = { x: 5, y: 5 };
        sinon.stub(Pathfinder, 'getRelativePosition').returns(destination);
        sinon.stub(zombie, 'isValidDestination').returns(true);
      });

      afterEach(function(){
        Pathfinder.getRelativePosition.restore();
        zombie.isValidDestination.restore();
      });

      it('changes the zombie position to the destination', function(){
        expect(function(){
          return zombie.position;
        }).to.change.to(
          destination
        ).when(function(){
          zombie.handleNextMove(opts);
        });
      });
    });

    context('when a zombie is able to bite the nearest humanoid', function(){
      beforeEach(function(){
        sinon.stub(zombie, 'isAbleToBite').returns(true);
      });

      afterEach(function(){
        zombie.isAbleToBite.restore();
      });

      it('calls `nearestHuman.transform`', function(){
        zombie.handleNextMove(opts);
        expect(human.transform).to.have.been.called();
      });

      it('replaces the humanoid with an InfectedHuman', function(){
        expect(function(){
          return humanoids[human.id].humanType;
        }).to.change.to(
          'InfectedHuman'
        ).when(function(){
          zombie.handleNextMove(opts);
        });
      });
    });
  });
});


