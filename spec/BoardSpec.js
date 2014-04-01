describe("Board", function(){
  var board;

  describe("A board", function(){

    beforeEach(function(){
      human = new Humanoid({'speed': 10, 'humanType': 'human', 'position': {'x': 100, 'y': 100}});
      human2 = new Humanoid({'speed': 10, 'humanType': 'human', 'position': {'x': 101, 'y': 101}});
      human3 = new Humanoid({'speed': 10, 'humanType': 'human', 'position': {'x': 105, 'y': 105}});
      zombie = new Humanoid({'speed': 5, 'humanType': 'zombie'});
      board = new Board({'humanoids': [human, zombie, human2], 'height': '400px', 'width': '600px'});
    });

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
      expect(board.nearest_humanoid(human)).toEqual(human2)
    });
  });



});