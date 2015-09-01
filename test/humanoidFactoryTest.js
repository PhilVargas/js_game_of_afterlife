let chai, expect, spies, HumanoidBuilder;
chai = require('chai');
spies = require('chai-spies');
chai.use(spies);
expect = chai.expect;

HumanoidBuilder = require('humanoidFactory');

describe('HumanoidBuilder', function(){
  describe('::creation', function(){
    it('should create the the correct humanType',function(){
      expect(HumanoidBuilder.creation(1, 'Human')[0].humanType).to.equal('Human');
    });

    it('should create the correct amount of humanoids',function(){
      expect(HumanoidBuilder.creation(5, 'Human', 10).length).to.equal(5);
    });
  });

  describe('::populate', function(){
    // builder creates an array of humanoids 1 greater than the inputs to account for the human
    // player
    it('should create an array of length 16',function(){
      expect(HumanoidBuilder.populate(10,5).length).to.equal(16);
    });

    it('should call .creation', function(){
      chai.spy.on(HumanoidBuilder, 'creation');
      HumanoidBuilder.populate();
      expect(HumanoidBuilder.creation).to.have.been.called();
    });
  });
});
