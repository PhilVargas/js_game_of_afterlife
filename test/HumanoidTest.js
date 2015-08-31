require('babel/register');
var chai, sinon, expect;
chai = require('chai');
chai.use(require('chai-spies'));
sinon = require('sinon');
expect = chai.expect;

var Humanoid, gameSettings, Pathfinder;

Humanoid = require('humanoids/humanoid');
gameSettings = require('settings');
Pathfinder = require('pathfinder');

describe('Humanoid', function(){
  var humanoid, humanoid2;
  describe('A humanoid', function(){
    beforeEach(function(){
      humanoid = new Humanoid({id: 0});
      humanoid2 = new Humanoid({id: 0});
    });

    it('should have a default position', function(){
      expect(humanoid.position).to.be.defined;
    });

    it('should have a default lastPosition equal to position', function(){
      expect(humanoid.lastPosition).to.eql(humanoid.position);
    });

    // move to zombie
    xit('should have a timeSinceInfection equal to 0', function(){
      expect(human.timeSinceInfection).to.equal(0);
    });

    describe('#closeProps', function(){
      it('returns an object with `id`, `position`, and `lastPosition`', function(){
        expect(humanoid.cloneProps()).to.eql(
          {id: humanoid.id, position: humanoid.position, lastPosition: humanoid.lastPosition}
        );
      });
    });

    describe('#isAttractedTo', function(){
      it('is attracted to a human', function(){
        sinon.stub(humanoid2, 'isHuman').returns(true);
        expect(humanoid.isAttractedTo(humanoid2)).to.equal(true);
      });

      it('is attracted to a player', function(){
        sinon.stub(humanoid2, 'isPlayer').returns(true);
        expect(humanoid.isAttractedTo(humanoid2)).to.equal(true);
      });

      it('is not attracted to a zombie', function(){
        sinon.stub(humanoid2, 'isZombie').returns(true);
        sinon.stub(humanoid2, 'isPlayer').returns(false);
        sinon.stub(humanoid2, 'isHuman').returns(false);
        expect(humanoid.isAttractedTo(humanoid2)).to.equal(false);
      });

      it('is not attracted to an infectedHuman', function(){
        sinon.stub(humanoid2, 'isZombie').returns(false);
        sinon.stub(humanoid2, 'isPlayer').returns(false);
        sinon.stub(humanoid2, 'isHuman').returns(false);
        expect(humanoid.isAttractedTo(humanoid2)).to.equal(false);
      });
    });

    describe('#storeLastPosition', function(){
      var newPosition = {x: 15, y: 10};
      beforeEach(function(){
        humanoid.position = newPosition;
        humanoid.storeLastPosition();
      });

      it('changes the lastPosition to this.position', function(){
        expect(humanoid.lastPosition).to.eql(newPosition);
      });
    });

    describe('#isLastMoveRepeated', function(){
      it('should return true for close positions', function(){
        var closePosition = {x: humanoid.position.x + 0.01, y: humanoid.position.y + 0.01};
        expect(humanoid.isLastMoveRepeated(closePosition)).to.equal(true);
      });

      it('should return false for distant positions', function(){
        var distantPosition = {x: 10, y: 20};
        expect(humanoid.isLastMoveRepeated(distantPosition)).to.equal(false);
      });
    });

    xdescribe('#turnToZombie', function(){
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

    xdescribe('#incrementTimeSinceInfection',function(){
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
          sinon.stub(humanoid, 'isAttractedTo').returns(true);
          chai.spy.on(Pathfinder, 'moveTowards');
          chai.spy.on(Pathfinder, 'moveRandomly');
        });

        it('should call Pathfinder.moveTowards', function(){
          humanoid.moveNearest(humanoid2);
          expect(Pathfinder.moveTowards).to.have.been.called();
        });

        describe('and last position is the current position', function(){
          beforeEach(function(){
            humanoid.lastPosition = humanoid.position;
            humanoid.moveNearest(humanoid2);
          });

          it('should call Pathfinder.moveRandomly', function(){
            expect(Pathfinder.moveRandomly).to.have.been.called();
          });
        });

        describe('and the last move has been repeated', function(){
          beforeEach(function(){
            chai.spy.on(Pathfinder, 'movePerpendicularTo');
            sinon.stub(humanoid, 'isLastMoveRepeated').returns(true);
            humanoid.position.x++;
            humanoid.moveNearest(humanoid2);
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
            humanoid.position.x++;
            sinon.stub(humanoid, 'isLastMoveRepeated').returns(false);
            chai.spy.on(Pathfinder, 'movePerpendicularTo');
            humanoid.moveNearest(humanoid2);
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
          sinon.stub(humanoid, 'isAttractedTo').returns(false);
          chai.spy.on(Pathfinder, 'moveAwayFrom');
          chai.spy.on(Pathfinder, 'moveRandomly');
        });

        it('should call Pathfinder.moveAwayFrom', function(){
          humanoid.moveNearest(humanoid2);
          expect(Pathfinder.moveAwayFrom).to.have.been.called();
        });

        describe('and last position is the current position', function(){
          beforeEach(function(){
            humanoid.lastPosition = humanoid.position;
            humanoid.moveNearest(humanoid2);
          });

          it('should call Pathfinder.moveRandomly', function(){
            expect(Pathfinder.moveRandomly).to.have.been.called();
          });
        });

        describe('and the last move has been repeated', function(){
          beforeEach(function(){
            chai.spy.on(Pathfinder, 'movePerpendicularTo');
            sinon.stub(humanoid, 'isLastMoveRepeated').returns(true);
            humanoid.position.x++;
            humanoid.moveNearest(humanoid2);
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
            humanoid.position.x++;
            chai.spy.on(humanoid, 'isLastMoveRepeated');
            chai.spy.on(Pathfinder, 'movePerpendicularTo');
            humanoid.moveNearest(humanoid2);
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
