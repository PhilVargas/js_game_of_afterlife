import { default as chai } from 'chai';

chai.use(require('chai-changes'));
chai.use(require('chai-spies'));
const expect = chai.expect;

import { default as Infected } from 'humanoids/infectedHuman';
import { default as Zombie } from 'humanoids/zombie';

describe('InfectedHuman', function(){
  let infected;

  beforeEach(function(){
    infected = new Infected({ id: 0 });
  });

  describe('An infectedHuman', function(){
    it('is an InfectedHuman `#humanType`', function(){
      expect(infected.humanType).to.equal('InfectedHuman');
    });

    it('has a speed of 0', function(){
      expect(infected.speed).to.equal(0);
    });

    it('has a `timeSinceInfection` of 0', function(){
      expect(infected.timeSinceInfection).to.equal(0);
    });
  });

  describe('#isAbleToBite', function(){
    it('is false', function(){
      expect(infected.isAbleToBite()).to.equal(false);
    });
  });

  describe('#transform', function(){
    it('transforms into a `Zombie`', function(){
      expect(infected.transform()).to.be.an.instanceOf(Zombie);
    });

    it('maintains the position of the `InfectedHuman`', function(){
      expect(infected.transform().position).to.eql(infected.position);
    });
  });

  describe('#incrementTimeSinceInfection', function(){
    it('increments `timeSinceInfection` by 1', function(){
      expect(function(){
        return infected.timeSinceInfection;
      }).to.change.by(1).when(function(){ infected.incrementTimeSinceInfection(); });
    });
  });

  describe('#handleNextMove', function(){
    beforeEach(function(){
      chai.spy.on(infected, 'incrementTimeSinceInfection');
      chai.spy.on(infected, 'transform');
    });

    it('calls `incrementTimeSinceInfection`', function(){
      infected.handleNextMove({ humanoids: [] });
      expect(infected.incrementTimeSinceInfection).to.have.been.called();
    });

    context('when the `timeSinceInfection` is greater than or equal to `5`', function(){
      let humanoids;

      beforeEach(function(){
        humanoids = [];
        infected.timeSinceInfection = 5;
        infected.handleNextMove({ humanoids });
      });

      it('calls `transform`', function(){
        expect(infected.transform).to.have.been.called();
      });

      it('replaces `humanoids[infected.id]` with the `new Zombie`', function(){
        expect(humanoids[infected.id]).to.be.an.instanceOf(Zombie);
      });
    });
  });
});

