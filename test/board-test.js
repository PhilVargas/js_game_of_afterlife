require('babel/register');
var chai, expect, spies;
chai = require('chai');
spies = require('chai-spies');
chai.use(spies);
expect = chai.expect;

var Humanoid, Board;
Humanoid = require('../public/js/game/humanoid');
Board = require('../public/js/game/board');

describe('Board', function(){
  var human, human2, zombie, board;

  beforeEach(function(){
    human = new Humanoid({id: 0, speed: 10, humanType: 'human', position: {x: 100, y: 100}});
    zombie = new Humanoid({id: 1, speed: 5, humanType: 'zombie', position: {x: 101, y: 104}});
    human2 = new Humanoid({id: 2, speed: 10, humanType: 'human', position: {x: 101, y: 101}});
    board = new Board({humanoids: [human, zombie, human2], height: '400px', width: '600px'});
    board.humanoid = null;
  });

  describe('A board', function(){
    it('should have a standard (600x400px) canvas size', function(){
      expect(board.height).to.equal('400px');
      expect(board.width).to.equal('600px');
    });
    it('should have a zombie and a human in the canvas', function(){
      expect(board.humanoids[0]).to.equal(human);
      expect(board.humanoids[1]).to.equal(zombie);
    });
  });

  describe('#isValidDestination', function(){
    it('should have a method #valid destination that returns true', function(){
      var targetPosition = {x: 10, y: 20};
      expect(board.isValidDestination(targetPosition)).to.equal(true);
    });
  });

  describe('#nearestHumanoid', function(){
    it('should have a method #nearestHumanoid method that returns the nears human',function(){
      board.humanoid = human;
      expect(board.nearestHumanoid('human')).to.equal(human2);
    });

    it('should pass type zombie and expect nearest zombie', function(){
      board.humanoid = human;
      expect(board.nearestHumanoid('zombie')).to.equal(zombie);
    });

    it('should pass type humans and expect nearest human', function(){
      board.humanoid = zombie;
      expect(board.nearestHumanoid('human')).to.equal(human2);
    });
  });

  describe('#setDestination', function(){
    var zombie2;
    beforeEach(function(){
      zombie2 = new Humanoid({speed: 5, humanType: 'zombie', position: {x: 101, y: 103}});
    });

    it('if nearest human is null it should call w/ nearest Zombie ', function(){
      board.humanoid = human;
      chai.spy.on(human, 'moveNearest');
      board.setDestination( null, zombie);
      expect(human.moveNearest).to.have.been.called.with(zombie);
    });

    it('if nearest humanoid is a zombie it should call setZombieDestination', function(){
      board.humanoid = zombie;
      chai.spy.on(board, 'setZombieDestination');
      board.setDestination( human2, zombie2 );
      expect(board.setZombieDestination).to.have.been.called();
    });

    it('if nearest humanoid is a human it should call setHumanDestination', function(){
      board.humanoid = human;
      chai.spy.on(board, 'setHumanDestination');
      board.setDestination( human2, zombie2 );
      expect(board.setHumanDestination).to.have.been.called();
    });
  });

  describe('#setZombieDestination', function(){
    it('should set zombie destination to move to nearest human', function(){
      var zombie3,zombie4,human3;
      zombie3 = new Humanoid({speed: 5, humanType: 'zombie', position: {x: 120, y: 120}});
      zombie4 = new Humanoid({speed: 5, humanType: 'zombie', position: {x: 1, y: 1}});
      human3 = new Humanoid({speed: 10, humanType: 'human', position: {x: 130, y: 130}});
      board.humanoid = zombie3;
      chai.spy.on(zombie3, 'moveNearest');
      board.setZombieDestination( human3, zombie4 );
      expect(zombie3.moveNearest).to.have.been.called.with(human3);
    });

    it('should set zombie destination to move to nearest zombie', function(){
      var zombie5,zombie6,human5;
      zombie5 = new Humanoid({speed: 5, humanType: 'zombie', position: {x: 120, y: 120}});
      zombie6 = new Humanoid({speed: 5, humanType: 'zombie', position: {x: 121, y: 121}});
      human5 = new Humanoid({speed: 10, humanType: 'human', position: {x: 1, y: 1}});
      board.humanoid = zombie5;

      chai.spy.on(zombie5, 'moveNearest');
      board.setZombieDestination( human5, zombie6 );
      expect(zombie5.moveNearest).to.have.been.called.with(zombie6);
    });
  });

  describe('#setHumanDestination', function(){
    it('should set human destination to move to nearest human', function(){
      var human3 = new Humanoid({speed: 5, humanType: 'human', position: {x: 120, y: 120}});
      var human4 = new Humanoid({speed: 10, humanType: 'human', position: {x: 121, y: 121}});
      var zombie4 = new Humanoid({speed: 5, humanType: 'zombie', position: {x: 1, y: 1}});
      board.humanoid = human3;

      chai.spy.on(human3, 'moveNearest');
      board.setHumanDestination( human4, zombie4 );
      expect(human3.moveNearest).to.have.been.called.with(human4);
    });

    it('should set human destination to move to nearest zombie', function(){
      var human5 = new Humanoid({speed: 5, humanType: 'human', position: {x: 120, y: 120}});
      var zombie5 = new Humanoid({speed: 5, humanType: 'zombie', position: {x: 121, y: 121}});
      var human6 = new Humanoid({speed: 10, humanType: 'human', position: {x: 1, y: 1}});
      board.humanoid = human5;

      chai.spy.on(human5, 'moveNearest');
      board.setHumanDestination( human6, zombie5 );
      expect(human5.moveNearest).to.have.been.called.with(zombie5);
    });
  });
});
