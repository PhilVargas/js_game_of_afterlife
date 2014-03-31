describe("Humanoid", function(){
  var human;

  describe("A human", function(){

    beforeEach(function(){
      human = new Humanoid({'speed': 10, 'humanType': 'human', 'position': {'x': 20, 'y': 20}});
    });

    it("should have a default position", function(){
      var anotherHuman = new Humanoid({'speed': 10, 'humanType': 'human'});
      expect(anotherHuman.position).toBeTruthy()  
    })

    it("should have a speed of 10", function(){
      expect(human.speed).toEqual(10)
    });

    it("should have a humanType of human", function(){
      expect(human.humanType).toEqual('human')
    });

    it("should have a default lastPosition equal to position", function(){
      expect(human.lastPosition).toEqual(human.position)
    });

    it("should have a timeSinceInfection equal to 0", function(){
      expect(human.timeSinceInfection).toEqual(0)
    });

    describe("#isAttractedTo", function(){

      it("should be attracted to a human", function(){
        var anotherHuman = new Humanoid({'speed': 10, 'humanType': 'human'});
        expect(human.isAttractedTo(anotherHuman)).toEqual(true)
      });

      it("should not be attracted to a zombie", function(){
        var zombie = new Humanoid({'speed': 5, 'humanType': 'zombie'});
        expect(human.isAttractedTo(zombie)).toEqual(false)
      });

      it("should not be attracted to an infectedHuman", function(){
        var infected = new Humanoid({'speed': 5, 'humanType': 'infectedHuman'});
        expect(human.isAttractedTo(infected)).toEqual(false)
      });
    });

    describe("#storeLastPosition", function(){
      var newPosition = {'x': 15, 'y': 10}
      beforeEach(function(){
        human.position = newPosition;
        human.storeLastPosition();
      })

      it("should change the lastPosition to this.position", function(){
        expect(human.lastPosition).toEqual(newPosition)
      })
    })

    describe("#isLastMoveRepeated", function(){
      it("should return true for close positions", function(){
        var closePosition = {'x': 21, 'y': 21}
        expect(human.isLastMoveRepeated(closePosition)).toEqual(true)
      });

      it("should return false for distant positions", function(){
        var distantPosition = {'x': 10, 'y': 20}
        expect(human.isLastMoveRepeated(distantPosition)).toEqual(false)
      });
    });

  });
});