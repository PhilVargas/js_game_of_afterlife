describe("Board", function(){
  var human, human2, human3, zombie, board

  beforeEach(function(){
    human = new Humanoid({'speed': 10, 'humanType': 'human', 'position': {'x': 100, 'y': 100}});
    human2 = new Humanoid({'speed': 10, 'humanType': 'human', 'position': {'x': 101, 'y': 101}});
    zombie = new Humanoid({'speed': 5, 'humanType': 'zombie', 'position': {'x': 101, 'y': 104}});
    board = new Board({'humanoids': [human, zombie, human2], 'height': '400px', 'width': '600px'});
  });
  describe("A board", function(){
    it("should have a standard (600x400px) canvas size", function(){
      expect(board.height).toEqual('400px')
      expect(board.width).toEqual('600px')
    });
    it("should have a zombie and a human in the canvas", function(){
      expect(board.humanoids[0]).toEqual(human)
      expect(board.humanoids[1]).toEqual(zombie)
    });
  });

  describe("#isValidDestination", function(){
    it("should have a method #valid destination that returns true", function(){
      var target_position = {'x': 10, 'y': 20}
      expect(board.isValidDestination(target_position)).toEqual(true)
    });
  });

  describe("#nearestHumanoid", function(){
    it("should have a method #nearest_humanoid method that returns ",function(){
      expect(board.nearestHumanoid(human, "human")).toEqual(human2)
    });

    it("should pass type zombie and expect nearest zombie", function(){
      expect(board.nearestHumanoid(human, "zombie")).toEqual(zombie)
    });

    it("should pass type humans and expect nearest human", function(){
      expect(board.nearestHumanoid(zombie, "human")).toEqual(human2)
    });
  });

  // next turn
  describe("#nextTurn", function(){

  })

  describe("setDestination", function(){
    beforeEach(function(){
      zombie2 = new Humanoid({'speed': 5, 'humanType': 'zombie', 'position': {'x': 101, 'y': 103}});
    })

    it("if nearest human is null it should call w/ nearest Zombie ", function(){
      spyOn(human, 'moveNearest')
      board.setDestination( null, zombie, human )
      expect(human.moveNearest).toHaveBeenCalledWith(zombie)
    });

    it("if nearest humanoid is a zombie ", function(){
      spyOn(board, 'setZombieDestination')
      board.setDestination( human2, zombie2, zombie )
      expect(board.setZombieDestination).toHaveBeenCalled()
    });

    it("if nearest humanoid is a human ", function(){
      spyOn(board, 'setHumanDestination')
      board.setDestination( human2, zombie2, human )
      expect(board.setHumanDestination).toHaveBeenCalled()
    });
  });


  describe("#setZombieDestination", function(){
    it("should set zombie destination to move to nearest human", function(){
      var zombie3 = new Humanoid({'speed': 5, 'humanType': 'zombie', 'position': {'x': 120, 'y': 120}});
      var human3 = new Humanoid({'speed': 10, 'humanType': 'human', 'position': {'x': 121, 'y': 121}});
      var zombie4 = new Humanoid({'speed': 5, 'humanType': 'zombie', 'position': {'x': 1, 'y': 1}});

      spyOn(zombie3, 'moveNearest')
      board.setZombieDestination( human3, zombie4 , zombie3 )
      expect(zombie3.moveNearest).toHaveBeenCalledWith(human3)
    });

    it("should set zombie destination to move to nearest zombie", function(){
      var zombie5 = new Humanoid({'speed': 5, 'humanType': 'zombie', 'position': {'x': 120, 'y': 120}});
      var zombie6 = new Humanoid({'speed': 5, 'humanType': 'zombie', 'position': {'x': 121, 'y': 121}});
      var human5 = new Humanoid({'speed': 10, 'humanType': 'human', 'position': {'x': 1, 'y': 1}});

      spyOn(zombie5, 'moveNearest')
      board.setZombieDestination( human5, zombie6, zombie5 )
      expect(zombie5.moveNearest).toHaveBeenCalledWith(zombie6)
    });
  });


  describe("#setHumanDestination", function(){
    it("should set human destination to move to nearest human", function(){
      var human3 = new Humanoid({'speed': 5, 'humanType': 'human', 'position': {'x': 120, 'y': 120}});
      var human4 = new Humanoid({'speed': 10, 'humanType': 'human', 'position': {'x': 121, 'y': 121}});
      var zombie4 = new Humanoid({'speed': 5, 'humanType': 'zombie', 'position': {'x': 1, 'y': 1}});

      spyOn(human3, 'moveNearest')
      board.setHumanDestination( human4, zombie4 , human3 )
      expect(human3.moveNearest).toHaveBeenCalledWith(human4)
    });

    it("should set human destination to move to nearest zombie", function(){
      var human5 = new Humanoid({'speed': 5, 'humanType': 'human', 'position': {'x': 120, 'y': 120}});
      var zombie5 = new Humanoid({'speed': 5, 'humanType': 'zombie', 'position': {'x': 121, 'y': 121}});
      var human6 = new Humanoid({'speed': 10, 'humanType': 'human', 'position': {'x': 1, 'y': 1}});

      spyOn(human5, 'moveNearest')
      board.setHumanDestination( human6, zombie5, human5 )
      expect(human5.moveNearest).toHaveBeenCalledWith(zombie5)
    });
  });


});