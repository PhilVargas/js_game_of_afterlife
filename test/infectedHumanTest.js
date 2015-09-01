require('babel/register');
var chai, sinon, expect;
chai = require('chai');
chai.use(require('chai-changes'));
sinon = require('sinon');
expect = chai.expect;

var Zombie, Infected, gameSettings, Pathfinder;

Infected = require('humanoids/infectedHuman');
Zombie = require('humanoids/zombie');
gameSettings = require('settings');
Pathfinder = require('pathfinder');

describe('InfectedHuman', function(){
  var zombie, infected;

  beforeEach(function(){
    infected = new Infected({id: 0});
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
});

