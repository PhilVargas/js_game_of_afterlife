import { default as chai } from 'chai';
import { default as sinon } from 'sinon';

chai.use(require('chai-changes'));
const expect = chai.expect;

import { default as Player } from 'humanoids/player';
import { default as Infected } from 'humanoids/infectedHuman';
import { default as Pathfinder } from 'pathfinder';
import { default as Settings } from 'settings';

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
      expect(player.speed).to.equal(Settings.playerSpeed);
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
    let destination;

    beforeEach(function(){
      destination = { x: 5, y: 5 };
      sinon.stub(Pathfinder, 'moveTowards').returns(destination);
      sinon.stub(Pathfinder, 'getRelativePosition').returnsArg(0);
    });

    afterEach(function(){
      Pathfinder.moveTowards.restore();
      Pathfinder.getRelativePosition.restore();
    });

    it('changes the player position to the relative destination', function(){
      expect(function(){
        return player.position;
      }).to.change.to(
        destination
      ).when(function(){
        player.handleNextMove({});
      });
    });
  });
});

