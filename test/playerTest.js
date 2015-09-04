let chai, sinon, expect;

chai = require('chai');
sinon = require('sinon');
chai.use(require('chai-changes'));
expect = chai.expect;

let Player, Infected, gameSettings, Pathfinder;

Player = require('humanoids/player');
Infected = require('humanoids/infectedHuman');
Pathfinder = require('pathfinder');
gameSettings = require('settings');

describe('Player', function(){
  let player;

  describe('A player', function(){
    beforeEach(function(){
      player = new Player({ id: 0, position: { x: 25, y: 25 } });
    });

    it('is a Player `#humanType`', function(){
      expect(player.humanType).to.equal('Player');
    });

    it('has a speed equal to the player speed settings', function(){
      expect(player.speed).to.equal(gameSettings.playerSpeed);
    });
  });

  describe('#isAbleToBite', function(){
    it('is always false', function(){
      expect(player.isAbleToBite()).to.equal(false);
    });
  });

  describe('#transform', function(){
    it('returns an instance of InfectedHuman', function(){
      expect(player.transform()).to.be.an.instanceOf(Infected);
    });

    it('returns an instance of InfectedHuman with the same position as the player', function(){
      expect(player.transform().position).to.eql(player.position);
    });

    it('returns an instance of InfectedHuman with the same id as the player', function(){
      expect(player.transform().id).to.equal(player.id);
    });
  });

  describe('#handleNextMove', function(){
    let destination, opts;

    beforeEach(function(){
      opts = { getRelativePosition: sinon.stub().returnsArg(0) };
      destination = { x: 5, y: 5 };
      sinon.stub(Pathfinder, 'moveTowards').returns(destination);
    });

    it('changes the player position to the relative destination', function(){
      expect(function(){
        return player.position;
      }).to.change.to(
        destination
      ).when(function(){
        player.handleNextMove(opts);
      });
    });
  });
});

