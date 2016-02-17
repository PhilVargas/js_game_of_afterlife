import { default as chai } from 'chai';
import { default as sinon } from 'sinon';

chai.use(require('chai-spies'));
const expect = chai.expect;

import { default as Humanoid } from 'humanoids/humanoid';
import { default as Pathfinder } from 'pathfinder';

describe('Humanoid', function(){
  let humanoid, humanoid2;

  describe('A humanoid', function(){
    beforeEach(function(){
      humanoid = new Humanoid({ id: 0 });
      humanoid2 = new Humanoid({ id: 0 });
    });

    it('should have a default position', function(){
      expect(humanoid.position).to.not.be.undefined();
    });

    it('should have a default lastPosition equal to position', function(){
      expect(humanoid.lastPosition).to.eql(humanoid.position);
    });

    describe('#closeProps', function(){
      it('returns an object with `id`, `position`, and `lastPosition`', function(){
        expect(humanoid.cloneProps()).to.eql(
          { id: humanoid.id, position: humanoid.position, lastPosition: humanoid.lastPosition }
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
      const newPosition = { x: 15, y: 10 };

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
        const closePosition = { x: humanoid.position.x + 0.01, y: humanoid.position.y + 0.01 };

        expect(humanoid.isLastMoveRepeated(closePosition)).to.equal(true);
      });

      it('should return false for distant positions', function(){
        const distantPosition = { x: 10, y: 20 };

        expect(humanoid.isLastMoveRepeated(distantPosition)).to.equal(false);
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
