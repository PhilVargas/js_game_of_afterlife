require('babel/register');
var chai, sinon, expect;
chai = require('chai');
chai.use(require('chai-spies'));
sinon = require('sinon');
expect = chai.expect;

var Humanoid, gameSettings, Pathfinder;

Humanoid = require('humanoid');
gameSettings = require('settings');
Pathfinder = require('pathfinder');

describe('Humanoid', function(){
  var human, zombie, infected;
  describe('A human', function(){
    beforeEach(function(){
      human = new Humanoid({speed: 10, humanType: 'human', position: {x: 20, y: 20}});
      zombie = new Humanoid({speed: 5, humanType: 'zombie', position: {x: 25, y: 25}});
      infected = new Humanoid({speed: 0, humanType: 'infectedHuman', position: {x: 21, y: 21}});
    });

    it('should have a default position', function(){
      var anotherHuman = new Humanoid({speed: 10, humanType: 'human'});
      expect(anotherHuman.position).to.be.ok;
    });

    it('should have a default lastPosition equal to position', function(){
      expect(human.lastPosition).to.eql(human.position);
    });

    it('should have a timeSinceInfection equal to 0', function(){
      expect(human.timeSinceInfection).to.equal(0);
    });

    describe('#isAttractedTo', function(){

      it('should be attracted to a human', function(){
        var anotherHuman = new Humanoid({speed: 10, humanType: 'human'});
        expect(human.isAttractedTo(anotherHuman)).to.equal(true);
      });

      it('should not be attracted to a zombie', function(){
        expect(human.isAttractedTo(zombie)).to.equal(false);
      });

      it('should not be attracted to an infectedHuman', function(){
        expect(human.isAttractedTo(infected)).to.equal(false);
      });
    });

    describe('#storeLastPosition', function(){
      var newPosition = {x: 15, y: 10};
      beforeEach(function(){
        human.position = newPosition;
        human.storeLastPosition();
      });

      it('should change the lastPosition to this.position', function(){
        expect(human.lastPosition).to.eql(newPosition);
      });
    });

    describe('#isLastMoveRepeated', function(){
      it('should return true for close positions', function(){
        var closePosition = {x: 20.01, y: 20.01};
        expect(human.isLastMoveRepeated(closePosition)).to.equal(true);
      });

      it('should return false for distant positions', function(){
        var distantPosition = {x: 10, y: 20};
        expect(human.isLastMoveRepeated(distantPosition)).to.equal(false);
      });
    });

    describe('#getBitten', function(){
      beforeEach(function(){
        human.getBitten();
      });

      it('should change the humantype to an infectedHuman', function(){
        expect(human.humanType).to.equal('infectedHuman');
      });

      it('should set the speed of the humanoid to 0', function(){
        expect(human.speed).to.equal(0);
      });
    });

    describe('#bite', function(){
      describe('a human', function(){
        beforeEach(function(){
          chai.spy.on(human,'getBitten');
          zombie.bite(human);
        });
        it('should call #getBitten', function(){
          expect(human.getBitten).to.have.been.called();
        });
      });
    });

    describe('#turnToZombie', function(){
      beforeEach(function(){
        human.turnToZombie();
      });
      it('should change the humanoid type to zombie', function(){
        expect(human.humanType).to.equal('zombie');
      });

      it('should change the speed to 5', function(){
        expect(human.speed).to.equal(gameSettings.zombieSpeed);
      });
    });

    describe('#isAbleToBite', function(){
      it('should return true if the humanoid is a zombie', function(){
        expect(zombie.isAbleToBite(human)).to.equal(true);
      });

      it('should return false if the humanoid is a human', function(){
        var anotherHuman = new Humanoid({speed: 10, humanType: 'human', position: {x: 21, y: 21}});
        expect(human.isAbleToBite(anotherHuman)).to.equal(false);
      });

      it('should return false if the humanoid is an infectedHuman', function(){
        expect(infected.isAbleToBite(human)).to.equal(false);
      });
    });

    describe('#incrementTimeSinceInfection',function(){
      it('should increase the timeSinceInfection', function(){
        infected.incrementTimeSinceInfection();
        expect(infected.timeSinceInfection).to.equal(1);
      });

      it('should not call turnToZombie if timeSinceInfection is not 4', function(){
        chai.spy.on(infected, 'turnToZombie');
        infected.timeSinceInfection = 0;
        infected.incrementTimeSinceInfection();
        expect(infected.turnToZombie).to.not.have.been.called();
      });

      it('should call turnToZombie if timeSinceInfection is 4', function(){
        chai.spy.on(infected, 'turnToZombie');
        infected.timeSinceInfection = 4;
        infected.incrementTimeSinceInfection();
        expect(infected.turnToZombie).to.have.been.called();
      });
    });

    describe('#moveNearest', function(){
      describe('is attracted to the nearest', function(){
        beforeEach(function(){
          sinon.stub(zombie, 'isAttractedTo').returns(true);
          chai.spy.on(Pathfinder, 'moveTowards');
          chai.spy.on(Pathfinder, 'moveRandomly');
        });

        it('should call Pathfinder.moveTowards', function(){
          zombie.moveNearest(human);
          expect(Pathfinder.moveTowards).to.have.been.called();
        });

        describe('and last position is the current position', function(){
          beforeEach(function(){
            zombie.lastPosition = zombie.position;
            zombie.moveNearest(human);
          });

          it('should call Pathfinder.moveRandomly', function(){
            expect(Pathfinder.moveRandomly).to.have.been.called();
          });
        });

        describe('and the last move has been repeated', function(){
          beforeEach(function(){
            chai.spy.on(Pathfinder, 'movePerpendicularTo');
            sinon.stub(zombie, 'isLastMoveRepeated').returns(true);
            zombie.position.x++;
            zombie.moveNearest(human);
          });

          it('should not call Pathfinder.moveRandomly', function(){
            expect(Pathfinder.moveRandomly).not.to.have.been.called();
          });

          it('should call Pathfinder.movePerpendicularTo', function(){
            expect(Pathfinder.movePerpendicularTo).to.have.been.called();
          });
        });

        describe('else', function(){
          beforeEach(function(){
            zombie.position.x++;
            sinon.stub(zombie, 'isLastMoveRepeated').returns(false);
            chai.spy.on(Pathfinder, 'movePerpendicularTo');
            zombie.moveNearest(human);
          });

          it('should not call Pathfinder.moveRandomly', function(){
            expect(Pathfinder.moveRandomly).not.to.have.been.called();
          });

          it('should not call Pathfinder.movePerpendicularTo', function(){
            expect(Pathfinder.movePerpendicularTo).not.to.have.been.called();
          });
        });
      });


      describe('is not attracted to the nearest', function(){
        beforeEach(function(){
          sinon.stub(zombie, 'isAttractedTo').returns(false);
          chai.spy.on(Pathfinder, 'moveAwayFrom');
          chai.spy.on(Pathfinder, 'moveRandomly');
        });

        it('should call Pathfinder.moveAwayFrom', function(){
          zombie.moveNearest(human);
          expect(Pathfinder.moveAwayFrom).to.have.been.called();
        });

        describe('and last position is the current position', function(){
          beforeEach(function(){
            zombie.lastPosition = zombie.position;
            zombie.moveNearest(human);
          });

          it('should call Pathfinder.moveRandomly', function(){
            expect(Pathfinder.moveRandomly).to.have.been.called();
          });
        });

        describe('and the last move has been repeated', function(){
          beforeEach(function(){
            chai.spy.on(Pathfinder, 'movePerpendicularTo');
            sinon.stub(zombie, 'isLastMoveRepeated').returns(true);
            zombie.position.x++;
            zombie.moveNearest(human);
          });

          it('should not call Pathfinder.moveRandomly', function(){
            expect(Pathfinder.moveRandomly).not.to.have.been.called();
          });

          it('should call Pathfinder.movePerpendicularTo', function(){
            expect(Pathfinder.movePerpendicularTo).to.have.been.called();
          });
        });

        describe('else', function(){
          beforeEach(function(){
            zombie.position.x++;
            chai.spy.on(zombie, 'isLastMoveRepeated');
            chai.spy.on(Pathfinder, 'movePerpendicularTo');
            zombie.moveNearest(human);
          });

          it('should not call Pathfinder.moveRandomly', function(){
            expect(Pathfinder.moveRandomly).not.to.have.been.called();
          });

          it('should not call Pathfinder.movePerpendicularTo', function(){
            expect(Pathfinder.movePerpendicularTo).not.to.have.been.called();
          });
        });
      });
    });
  });
});
