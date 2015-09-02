let chai, sinon, expect;
chai = require('chai');
sinon = require('sinon');
expect = chai.expect;

let Human, gameSettings, Pathfinder;

Human = require('humanoids/human');
gameSettings = require('settings');
Pathfinder = require('pathfinder');

describe('Human', function(){
  let zombie, human;

  describe('A human', function(){
    beforeEach(function(){
      human = new Human({id: 0, position: {x: 25, y: 25}});
    });

    it('is a Human `#humanType`', function(){
      expect(human.humanType).to.equal('Human');
    });

    it('has a speed equal to the human speed settings', function(){
      expect(human.speed).to.equal(gameSettings.humanSpeed);
    });
  });

  describe('#isAbleToBite', function(){
    it('is always false', function(){
      expect(human.isAbleToBite()).to.equal(false);
    });
  });
});
