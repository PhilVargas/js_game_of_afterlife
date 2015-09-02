let chai, sinon, expect;
chai = require('chai');
sinon = require('sinon');
chai.use(require('chai-changes'));
expect = chai.expect;

let Human, InfectedHuman, gameSettings, Pathfinder;

Human = require('humanoids/human');
InfectedHuman = require('humanoids/infectedHuman');
gameSettings = require('settings');
Pathfinder = require('pathfinder');

describe('Human', function(){
  let human;

  describe('A human', function(){
    beforeEach(function(){
      human = new Human({id: 0, position: {x: 25, y: 25}});
    });

    it('is a Human `#humanType`', function(){
      expect(human.humanType).to.equal('Human');
    });

    it('has a speed equal to the human speed settings', function(){
      expect(human.speed).to.equal(gameSettings.humanSpeed);
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
            [{position: { x: 0, y: 0 }}, {position: {x: 1, y: 1}}], {x: 0, y: 1}
          )
        ).to.equal(true);
      });
    });

    context('when target destination is identical to a position', function(){
      it('returns false', function(){
        expect(
          human.isValidDestination(
            [{position: { x: 0, y: 0 }}, {position: {x: 1, y: 1}}], {x: 0, y: 0}
          )
        ).to.equal(false);
      });
    });
  });

  describe('#handleNextMove', function(){
    let opts, destination;
    afterEach(function(){
      human.getNextDestination.restore();
      human.isValidDestination.restore();
    });

    context('when the next move is not valid', function(){
      beforeEach(function(){
        destination = { x: 5, y: 5 };
        sinon.stub(human, 'getNextDestination');
        sinon.stub(human, 'isValidDestination').returns(false);
        opts = {getRelativePosition: sinon.stub().returns(destination)};
      });

      it('sets the `human.position` to the destination', function(){
        expect(function(){
          return human.position;
        }).to.not.change.when(function(){
          human.handleNextMove(opts);
        });
      });
    });

    context('when the next move is valid', function(){
      beforeEach(function(){
        destination = { x: 5, y: 5 };
        sinon.stub(human, 'getNextDestination');
        sinon.stub(human, 'isValidDestination').returns(true);
        opts = {getRelativePosition: sinon.stub().returns(destination)};
      });

      it('sets the `human.position` to the destination', function(){
        expect(function(){
          return human.position;
        }).to.change.to(
          destination
        ).when(function(){
          human.handleNextMove(opts);
        });
      });
    });
  });

  xdescribe('#getNextDestination', function(){
    it('tests the refactored method', function(){
    });
  });
});
