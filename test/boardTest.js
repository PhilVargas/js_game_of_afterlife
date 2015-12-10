import { default as chai } from 'chai';

const expect = chai.expect;

import { default as Player } from 'humanoids/player';
import { default as Human } from 'humanoids/human';
import { default as Zombie } from 'humanoids/zombie';
import { default as Board } from 'board';

describe('Board', function(){
  let human, human2, player, zombie, zombie2, board;

  describe('#isPlayerAlive', function(){
    context('when there is no player remaining', function(){
      beforeEach(function(){
        human = new Human({ id: 0 });
        zombie = new Zombie({ id: 1 });
        board = new Board({ humanoids: [human, zombie] });
      });
      it('returns false', function(){
        expect(board.isPlayerAlive()).to.equal(false);
      });
    });
    context('when there is a player remaining', function(){
      beforeEach(function(){
        player = new Player({ id: 0 });
        zombie = new Zombie({ id: 1 });
        board = new Board({ humanoids: [player, zombie] });
      });
      it('returns true', function(){
        expect(board.isPlayerAlive()).to.equal(true);
      });
    });
  });

  describe('#isGameActive', function(){
    context('when there is a human remaining', function(){
      beforeEach(function(){
        human = new Human({ id: 0 });
        zombie = new Zombie({ id: 1 });
        board = new Board({ humanoids: [human, zombie] });
      });
      it('returns true', function(){
        expect(board.isGameActive()).to.equal(true);
      });
    });
    context('when there is a player remaining', function(){
      beforeEach(function(){
        player = new Player({ id: 0 });
        zombie = new Zombie({ id: 1 });
        board = new Board({ humanoids: [player, zombie] });
      });
      it('returns true', function(){
        expect(board.isGameActive()).to.equal(true);
      });
    });
    context('when there is a human or player remaining', function(){
      beforeEach(function(){
        zombie = new Zombie({ id: 1 });
        board = new Board({ humanoids: [zombie] });
      });
      it('returns false', function(){
        expect(board.isGameActive()).to.equal(false);
      });
    });
  });

  describe('#incrementScore', function(){
    context('when a player is not alive', function(){
      beforeEach(function(){
        board = new Board({ humanoids: [new Human({ id: 0 })] });
      });
      it('does not increment the score', function(){
        expect(board.score).to.equal(0);
        board.incrementScore();
        expect(board.score).to.equal(0);
      });
    });

    context('when a player is alive', function(){
      beforeEach(function(){
        board = new Board({ humanoids: [new Player({ id: 0 })] });
      });
      it('increments the score by 10', function(){
        expect(board.score).to.equal(0);
        board.incrementScore();
        expect(board.score).to.equal(10);
      });
    });
  });

  describe('#otherHumanoids', function(){
    beforeEach(function(){
      human = new Human({ id: 0 });
      zombie = new Zombie({ id: 1 });
      human2 = new Human({ id: 2 });
      board = new Board({ humanoids: [human, zombie, human2] });
      board.humanoid = human;
    });
    it('retrieves all humanoids excepts the current `board.humanoid`', function(){
      expect(board.otherHumanoids()).to.include.members([zombie, human2]);
      expect(board.otherHumanoids()).to.not.include.members([human]);
    });
  });

  describe('#findSimilarHumanoids', function(){
    beforeEach(function(){
      human = new Human({ id: 0 });
      zombie = new Zombie({ id: 1 });
      human2 = new Human({ id: 2 });
      board = new Board({ humanoids: [human, zombie, human2] });
    });

    context('when there are no humanoids of the same humanType', function(){
      beforeEach(function(){
        board.humanoid = zombie;
      });

      it('returns an empty array', function(){
        expect(board.findSimilarHumanoids(zombie.humanType)).to.eql([]);
      });
    });

    context('when there are humanoids of the same humanType', function(){
      beforeEach(function(){
        board.humanoid = human;
      });

      it('does not include the current `board.humanoid`', function(){
        expect(board.findSimilarHumanoids(human.humanType)).to.not.include(human);
      });

      it('finds humanoids of the same type', function(){
        expect(board.findSimilarHumanoids(human.humanType)).to.include(human2);
        expect(board.findSimilarHumanoids(human.humanType)).to.not.include(zombie);
      });
    });
  });

  describe('#findClosestPos', function(){
    beforeEach(function(){
      human = new Human({ id: 0, position: { x: 0, y: 0 } });
      zombie = new Zombie({ id: 1, position: { x: 1, y: 1 } });
      board = new Board({ humanoids: [human, zombie] });
      board.humanoid = human;
    });

    it('returns an array of distances from `board.humanoid`', function(){
      expect(board.findClosestPos([zombie])).to.include(Math.sqrt(2));
    });
  });

  describe('#findClosestHumanoid', function(){
    beforeEach(function(){
      human = new Human({ id: 0, position: { x: 0, y: 0 } });
      zombie = new Zombie({ id: 1, position: { x: 1, y: 1 } });
      player = new Player({ id: 2, position: { x: 5, y: 5 } });
      board = new Board({ humanoids: [human, zombie, player] });
      board.humanoid = human;
    });

    it('returns the closes humanoid to the current `board.humanoid`', function(){
      expect(
        board.findClosestHumanoid(board.findClosestPos(board.humanoids), board.otherHumanoids())
      ).to.eql(zombie);
    });
  });

  describe('#nearestLivingHumanoid', function(){
    beforeEach(function(){
      human = new Human({ id: 0, position: { x: 100, y: 100 } });
      zombie = new Zombie({ id: 1, position: { x: 101, y: 104 } });
      human2 = new Human({ id: 2, position: { x: 100, y: 104 } });
      player = new Player({ id: 3, position: { x: 101, y: 105 } });
      zombie2 = new Zombie({ id: 4, position: { x: 101, y: 106 } });
      board = new Board({ humanoids: [human, zombie, human2, player, zombie2] });
      board.humanoid = null;
    });
    context('when the current `board.humanoid` is a human', function(){
      context('when the closest living humanoid is a player', function(){
        beforeEach(function(){
          board.humanoid = human2;
        });
        it('finds the player', function(){
          expect(board.nearestLivingHumanoid()).to.equal(player);
        });
      });
      context('when the closest living humanoid is a human', function(){
        beforeEach(function(){
          board.humanoid = human;
        });
        it('finds the nearest human', function(){
          expect(board.nearestLivingHumanoid()).to.equal(human2);
        });
      });
    });

    context('when the current `board.humanoid` is a zombie', function(){
      context('when the closest living humanoid is a player', function(){
        beforeEach(function(){
          board.humanoid = zombie2;
        });
        it('finds the player', function(){
          expect(board.nearestLivingHumanoid()).to.equal(player);
        });
      });
      context('when the closest living humanoid is a human', function(){
        beforeEach(function(){
          board.humanoid = zombie;
        });
        it('finds the nearest human', function(){
          expect(board.nearestLivingHumanoid()).to.equal(human2);
        });
      });
    });

    context('when there is no nearest humanoid', function(){
      beforeEach(function(){
        board = new Board({ humanoids: [zombie] });
        board.humanoid = zombie;
      });
      it('returns undefined', function(){
        expect(board.nearestLivingHumanoid()).to.be.undefined();
      });
    });
  });
});
