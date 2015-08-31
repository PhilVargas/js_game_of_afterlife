require('babel/register');
var chai, expect, spies, Human, Zombie, Player, Board;
chai = require('chai');
expect = chai.expect;

Player = require('../public/js/game/humanoids/player');
Human = require('../public/js/game/humanoids/human');
Zombie = require('../public/js/game/humanoids/zombie');
Board = require('../public/js/game/board');

describe('Board', function(){
  var human, human2, player, zombie, board;

  describe('A board', function(){
    beforeEach(function(){
      board = new Board({humanoids: [], height: 400, width: 600});
    });
    it('should have a standard (600x400px) canvas size', function(){
      expect(board.height).to.equal(400);
      expect(board.width).to.equal(600);
    });
  });

  describe('#isPlayerAlive', function(){
    context('when there is no player remaining', function(){
      beforeEach(function(){
        human = new Human({id: 0});
        zombie = new Zombie({id: 1});
        board = new Board({humanoids: [human, zombie], height: 400, width: 600});
      });
      it('returns false', function(){
        expect(board.isPlayerAlive()).to.equal(false);
      });
    });
    context('when there is a player remaining', function(){
      beforeEach(function(){
        player = new Player({id: 0});
        zombie = new Zombie({id: 1});
        board = new Board({humanoids: [player, zombie], height: 400, width: 600});
      });
      it('returns true', function(){
        expect(board.isPlayerAlive()).to.equal(true);
      });
    });
  });

  describe('#isGameActive', function(){
    context('when there is a human remaining', function(){
      beforeEach(function(){
        human = new Human({id: 0});
        zombie = new Zombie({id: 1});
        board = new Board({humanoids: [human, zombie], height: 400, width: 600});
      });
      it('returns true', function(){
        expect(board.isGameActive()).to.equal(true);
      });
    });
    context('when there is a player remaining', function(){
      beforeEach(function(){
        player = new Player({id: 0});
        zombie = new Zombie({id: 1});
        board = new Board({humanoids: [player, zombie], height: 400, width: 600});
      });
      it('returns true', function(){
        expect(board.isGameActive()).to.equal(true);
      });
    });
    context('when there is a human or player remaining', function(){
      beforeEach(function(){
        zombie = new Zombie({id: 1});
        board = new Board({humanoids: [zombie], height: 400, width: 600});
      });
      it('returns false', function(){
        expect(board.isGameActive()).to.equal(false);
      });
    });
  });

  describe('#isPositionEqual', function(){
    beforeEach(function(){
      board = new Board({humanoids: [], height: 400, width: 600});
    });
    it('returns true for equal positions', function(){
      expect(board.isPositionEqual({x: 0, y:0}, {x:0, y:0})).to.equal(true);
    });

    it('returns false for unequal positions', function(){
      expect(board.isPositionEqual({x: 0, y:0}, {x:1, y:1})).to.equal(false);
    });
  });

  describe('#getRelativePosition', function(){
    beforeEach(function(){
      board = new Board({humanoids: [], height: 400, width: 600});
    });
    it('returns the relative board position when exceeding the board boundries', function(){
      expect(board.getRelativePosition({x: 605, y: 410})).to.eql({x:5, y:10});
    });
  });

  describe('#incrementScore', function(){
    context('when a player is not alive', function(){
      beforeEach(function(){
        board = new Board({humanoids: [new Human({id: 0})], height: 400, width: 600});
      });
      it('does not increment the score', function(){
        expect(board.score).to.equal(0);
        board.incrementScore();
        expect(board.score).to.equal(0);
      });
    });

    context('when a player is alive', function(){
      beforeEach(function(){
        board = new Board({humanoids: [new Player({id: 0})], height: 400, width: 600});
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
      human = new Human({id: 0});
      zombie = new Zombie({id: 1});
      human2 = new Human({id: 2});
      board = new Board({humanoids: [human, zombie, human2], height: 400, width: 600});
      board.humanoid = human;
    });
    it('retrieves all humanoids excepts the current `board.humanoid`', function(){
      expect(board.otherHumanoids()).to.include.members([zombie, human2]);
      expect(board.otherHumanoids()).to.not.include.members([human]);
    });
  });

  describe('#findSimilarHumanoids', function(){
    beforeEach(function(){
      human = new Human({id: 0});
      zombie = new Zombie({id: 1});
      human2 = new Human({id: 2});
      board = new Board({humanoids: [human, zombie, human2], height: 400, width: 600});
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
      human = new Human({id: 0, position: {x: 0, y: 0}});
      zombie = new Zombie({id: 1, position: {x: 1, y: 1}});
      board = new Board({humanoids: [human, zombie], height: 400, width: 600});
      board.humanoid = human;
    });

    it('returns an array of distances from `board.humanoid`', function(){
      expect(board.findClosestPos([zombie])).to.include(Math.sqrt(2));
    });
  });

  describe('#findClosestHumanoid', function(){
    beforeEach(function(){
      human = new Human({id: 0, position: {x: 0, y: 0}});
      zombie = new Zombie({id: 1, position: {x: 1, y: 1}});
      player = new Player({id: 2, position: {x: 5, y: 5}});
      board = new Board({humanoids: [human, zombie, player], height: 400, width: 600});
      board.humanoid = human;
    });

    it('returns the closes humanoid to the current `board.humanoid`', function(){
      expect(
        board.findClosestHumanoid(board.findClosestPos(board.humanoids), board.otherHumanoids())
      ).to.eql(zombie);
    });
  });

  describe('#isValidDestination', function(){
    beforeEach(function(){
      human = new Human({id: 0, position: {x: 100, y: 100}});
      zombie = new Zombie({id: 1, position: {x: 101, y: 104}});
      board = new Board({humanoids: [human, zombie], height: 400, width: 600});
      board.humanoid = null;
    });

    context('when there is a humanoid on target position', function(){
      it('returns false', function(){
        expect(board.isValidDestination(human.position)).to.equal(false);
      });
    });

    context('when there is no humanoid on target position', function(){
      it('returns true', function(){
        var targetPosition = {x: 10, y: 20};
        expect(board.isValidDestination(targetPosition)).to.equal(true);
      });
    });
  });

  describe('#nearestHumanoid', function(){
    beforeEach(function(){
      human = new Human({id: 0, position: {x: 100, y: 100}});
      zombie = new Zombie({id: 1, position: {x: 101, y: 104}});
      human2 = new Human({id: 2, position: {x: 101, y: 101}});
      board = new Board({humanoids: [human, zombie, human2], height: 400, width: 600});
      board.humanoid = null;
    });
    context('when the current `board.humanoid` is a human', function(){
      beforeEach(function(){
        board.humanoid = human;
      });

      it('finds the nearest human',function(){
        expect(board.nearestHumanoid('Human')).to.equal(human2);
      });

      it('finds the nearest zombie', function(){
        expect(board.nearestHumanoid('Zombie')).to.equal(zombie);
      });
    });

    context('when the current `board.humanoid` is a zombie', function(){
      beforeEach(function(){
        board.humanoid = zombie;
      });

      it('finds the nearest human', function(){
        expect(board.nearestHumanoid('Human')).to.equal(human2);
      });
    });
    context('when there is no nearest humanoid', function(){
      it('returns undefined', function(){
        board.humanoid = zombie;
        expect(board.nearestHumanoid('Zombie')).to.equal(undefined);
      });
    });
  });
});
