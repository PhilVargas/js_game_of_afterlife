import { default as chai } from 'chai';
import { default as sinon } from 'sinon';

chai.use(require('chai-changes'));
const expect = chai.expect;

import { default as Human } from 'humanoids/human';
import { default as Player } from 'humanoids/player';
import { default as Zombie } from 'humanoids/zombie';
import { default as InfectedHuman } from 'humanoids/infectedHuman';
import { default as Settings } from 'settings';
import { default as Pathfinder } from 'pathfinder';

describe('Human', function(){
  let human;

  describe('A human', function(){
    beforeEach(function(){
      human = new Human({ id: 0, position: { x: 25, y: 25 } });
    });

    it('is a Human `#humanType`', function(){
      expect(human.humanType).to.equal('Human');
    });

    it('has a speed equal to the human speed settings', function(){
      expect(human.speed).to.equal(Settings.humanSpeed);
    });
  });

  describe('#isAbleToBite', function(){
    it('is always false', function(){
      expect(human.isAbleToBite()).to.equal(false);
    });
  });

  describe('#transform', function(){
    it('returns an instance of InfectedHuman', function(){
      expect(human.transform()).to.be.an.instanceOf(InfectedHuman);
    });

    it('returns an instance of InfectedHuman with the same position as the human', function(){
      expect(human.transform().position).to.eql(human.position);
    });

    it('returns an instance of InfectedHuman with the same id as the human', function(){
      expect(human.transform().id).to.equal(human.id);
    });
  });

  describe('#isValidDestination', function(){
    context('when target destination is not identical to a position', function(){
      it('returns true', function(){
        expect(
          human.isValidDestination(
            [{ position: { x: 0, y: 0 } }, { position: { x: 1, y: 1 } }], { x: 0, y: 1 }
          )
        ).to.equal(true);
      });
    });

    context('when target destination is identical to a position', function(){
      it('returns false', function(){
        expect(
          human.isValidDestination(
            [{ position: { x: 0, y: 0 } }, { position: { x: 1, y: 1 } }], { x: 0, y: 0 }
          )
        ).to.equal(false);
      });
    });
  });

  describe('#handleNextMove', function(){
    let destination;

    beforeEach(function(){
      destination = { x: 5, y: 5 };
      sinon.stub(human, 'getNextDestination');
      sinon.stub(Pathfinder, 'getRelativePosition').returns(destination);
    });

    afterEach(function(){
      human.getNextDestination.restore();
      human.isValidDestination.restore();
      Pathfinder.getRelativePosition.restore();
    });

    context('when the next move is not valid', function(){
      beforeEach(function(){
        sinon.stub(human, 'isValidDestination').returns(false);
      });

      it('sets the `human.position` to the destination', function(){
        expect(function(){
          return human.position;
        }).to.not.change.when(function(){
          human.handleNextMove({});
        });
      });
    });

    context('when the next move is valid', function(){
      beforeEach(function(){
        sinon.stub(human, 'isValidDestination').returns(true);
      });

      it('sets the `human.position` to the destination', function(){
        expect(function(){
          return human.position;
        }).to.change.to(
          destination
        ).when(function(){
          human.handleNextMove({});
        });
      });
    });
  });

  describe('#getNextDestination', function(){
    let zombie, player, otherHuman;

    beforeEach(function(){
      chai.spy.on(human, 'moveNearest');
      zombie = new Zombie({ id: 1 });
      player = new Player({ id: 2 });
      otherHuman = new Human({ id: 3 });
    });

    afterEach(function(){
      human.isZombieNearest.restore();
    });

    context('when a human is closests', function(){
      beforeEach(function(){
        sinon.stub(human, 'isZombieNearest').returns(false);
        human.getNextDestination(otherHuman, zombie);
      });

      it('calls `moveNearest` with the human', function(){
        expect(human.moveNearest).to.have.been.called.with(otherHuman);
      });
    });

    context('when a player is closests', function(){
      beforeEach(function(){
        sinon.stub(human, 'isZombieNearest').returns(false);
        human.getNextDestination(player, zombie);
      });

      it('calls `moveNearest` with the player', function(){
        expect(human.moveNearest).to.have.been.called.with(player);
      });
    });

    context('when a zombie is closests', function(){
      beforeEach(function(){
        sinon.stub(human, 'isZombieNearest').returns(true);
        human.getNextDestination(otherHuman, zombie);
      });

      it('calls `moveNearest` with the zombie', function(){
        expect(human.moveNearest).to.have.been.called.with(zombie);
      });
    });
  });

  describe('#isZombieNearest', function(){
    let zombie, player, otherHuman;

    beforeEach(function(){
      zombie = new Zombie({ id: 1 });
      player = new Player({ id: 2 });
      otherHuman = new Human({ id: 3 });
    });

    afterEach(function(){
      Pathfinder.distanceTo.restore();
    });

    context('when a zombie is within the `humanFearRange`', function(){
      beforeEach(function(){
        sinon.stub(Pathfinder, 'distanceTo').returns(Number.NEGATIVE_INFINITY);
      });

      it('returns true', function(){
        expect(human.isZombieNearest(zombie)).to.equal(true);
      });
    });

    context('when a zombie is not within the `humanFearRange`', function(){
      beforeEach(function(){
        sinon.stub(Pathfinder, 'distanceTo').returns(Number.POSITIVE_INFINITY);
      });

      context('when the `nearestHuman` remains', function(){
        it('returns false', function(){
          expect(human.isZombieNearest(zombie, otherHuman)).to.equal(false);
        });
      });

      context('when the `player` remains', function(){
        it('returns false', function(){
          expect(human.isZombieNearest(zombie, player)).to.equal(false);
        });
      });

      context('when the current humanoid is the only human remaining', function(){
        it('returns true', function(){
          expect(human.isZombieNearest(zombie)).to.equal(true);
        });
      });
    });
  });
});
