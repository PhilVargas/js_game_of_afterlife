describe("Humanoid", function(){
  var human;
  var zombie;
  var infected;
  describe("A human", function(){

    beforeEach(function(){
      human = new Humanoid({'speed': 10, 'humanType': 'human', 'position': {'x': 20, 'y': 20}});
      zombie = new Humanoid({'speed': 5, 'humanType': 'zombie', 'position': {'x': 25, 'y': 25}});
      infected = new Humanoid({'speed': 0, 'humanType': 'infectedHuman'});
    });

    it("should have a default position", function(){
      var anotherHuman = new Humanoid({'speed': 10, 'humanType': 'human'});
      expect(anotherHuman.position).toBeTruthy()
    })

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
        expect(human.isAttractedTo(zombie)).toEqual(false)
      });

      it("should not be attracted to an infectedHuman", function(){
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
        var closePosition = {'x': 20.01, 'y': 20.01}
        expect(human.isLastMoveRepeated(closePosition)).toEqual(true)
      });

      it("should return false for distant positions", function(){
        var distantPosition = {'x': 10, 'y': 20}
        expect(human.isLastMoveRepeated(distantPosition)).toEqual(false)
      });
    });

    describe("#getBitten", function(){
      beforeEach(function(){
        human.getBitten()
      })

      it("should change the humantype to an infectedHuman", function(){
        expect(human.humanType).toEqual('infectedHuman')
      })

      it("should set the speed of the humanoid to 0", function(){
        expect(human.speed).toEqual(0)
      })
    })

    describe("#bite", function(){
      describe("a human", function(){
        beforeEach(function(){
          spyOn(human,'getBitten')
          zombie.bite(human)
        })
        it("should call #getBitten", function(){
          expect(human.getBitten).toHaveBeenCalled()
        })
      })

      describe("a zombie", function(){
        beforeEach(function(){
          anotherZombie = new Humanoid({'speed': 5, 'humanType': 'zombie'});
          spyOn(anotherZombie, 'getBitten')
          zombie.bite(anotherZombie)
        })
        it("should call not #getBitten", function(){
          expect(anotherZombie.getBitten).not.toHaveBeenCalled()
        })
      })
    })

    describe("#turnToZombie", function(){
      beforeEach(function(){
        human.turnToZombie()
      })
      it("should change the humanoid type to zombie", function(){
        expect(human.humanType).toEqual('zombie')
      })

      it("should change the speed to 5", function(){
        expect(human.speed).toEqual(gameSettings.zombieSpeed)
      })
    })

    describe("#isAbleToBite", function(){
      it("should return true if the humanoid is a zombie", function(){
        expect(zombie.isAbleToBite()).toEqual(true)
      })

      it("should return false if the humanoid is a human", function(){
        expect(human.isAbleToBite()).toEqual(false)
      })

      it("should return false if the humanoid is an infectedHuman", function(){
        expect(infected.isAbleToBite()).toEqual(false)
      })
    })

    describe("#incrementTimeSinceInfection",function(){
      it("should increase the timeSinceInfection", function(){
        infected.incrementTimeSinceInfection()
        expect(infected.timeSinceInfection).toEqual(1)
      })

      it("should not call turnToZombie if timeSinceInfection is not 4", function(){
        spyOn(infected, 'turnToZombie')
        infected.timeSinceInfection = 0
        infected.incrementTimeSinceInfection()
        expect(infected.turnToZombie).not.toHaveBeenCalled()
      })

      it("should call turnToZombie if timeSinceInfection is 4", function(){
        spyOn(infected, 'turnToZombie')
        infected.timeSinceInfection = 4
        infected.incrementTimeSinceInfection()
        expect(infected.turnToZombie).toHaveBeenCalled()
      })
    })

    describe("#moveNearest", function(){
      describe("is attracted to the nearest", function(){
        beforeEach(function(){
          spyOn(zombie, 'isAttractedTo').and.returnValue(true)
          spyOn(Pathfinder, 'moveTowards').and.returnValue({'x': 20, 'y': 20})
          spyOn(Pathfinder, 'moveRandomly')
        })

        it("should call Pathfinder.moveTowards", function(){
          zombie.moveNearest(human)
          expect(Pathfinder.moveTowards).toHaveBeenCalled()
        })

        describe("and last position is the current position", function(){
          beforeEach(function(){
            zombie.lastPosition = zombie.position
            zombie.moveNearest(human)
          })

          it("should call Pathfinder.moveRandomly", function(){
            expect(Pathfinder.moveRandomly).toHaveBeenCalled()
          })
        })

        describe("and the last move has been repeated", function(){
          beforeEach(function(){
            spyOn(Pathfinder, 'movePerpendicularTo')
            spyOn(zombie, 'isLastMoveRepeated').and.returnValue(true)
            zombie.position.x++
            zombie.moveNearest(human)
          })

          it("should not call Pathfinder.moveRandomly", function(){
            expect(Pathfinder.moveRandomly).not.toHaveBeenCalled()
          })

          it("should call Pathfinder.movePerpendicularTo", function(){
            expect(Pathfinder.movePerpendicularTo).toHaveBeenCalled()
          })
        })

        describe("else", function(){
          beforeEach(function(){
            zombie.position.x++
            spyOn(zombie, 'isLastMoveRepeated').and.returnValue(false)
            spyOn(Pathfinder, 'movePerpendicularTo').and.returnValue(false)
            zombie.moveNearest(human)
          })

          it("should not call Pathfinder.moveRandomly", function(){
            expect(Pathfinder.moveRandomly).not.toHaveBeenCalled()
          })

          it("should not call Pathfinder.movePerpendicularTo", function(){
            expect(Pathfinder.movePerpendicularTo).not.toHaveBeenCalled()
          })
        })
      })


      describe("is not attracted to the nearest", function(){
        beforeEach(function(){
          spyOn(zombie, 'isAttractedTo').and.returnValue(false)
          spyOn(Pathfinder, 'moveAwayFrom').and.returnValue({'x': 20, 'y': 20})
          spyOn(Pathfinder, 'moveRandomly')
        })

        it("should call Pathfinder.moveAwayFrom", function(){
          zombie.moveNearest(human)
          expect(Pathfinder.moveAwayFrom).toHaveBeenCalled()
        })

        describe("and last position is the current position", function(){
          beforeEach(function(){
            zombie.lastPosition = zombie.position
            zombie.moveNearest(human)
          })

          it("should call Pathfinder.moveRandomly", function(){
            expect(Pathfinder.moveRandomly).toHaveBeenCalled()
          })
        })

        describe("and the last move has been repeated", function(){
          beforeEach(function(){
            spyOn(Pathfinder, 'movePerpendicularTo')
            spyOn(zombie, 'isLastMoveRepeated').and.returnValue(true)
            zombie.position.x++
            zombie.moveNearest(human)
          })

          it("should not call Pathfinder.moveRandomly", function(){
            expect(Pathfinder.moveRandomly).not.toHaveBeenCalled()
          })

          it("should call Pathfinder.movePerpendicularTo", function(){
            expect(Pathfinder.movePerpendicularTo).toHaveBeenCalled()
          })
        })

        describe("else", function(){
          beforeEach(function(){
            zombie.position.x++
            spyOn(zombie, 'isLastMoveRepeated').and.returnValue(false)
            spyOn(Pathfinder, 'movePerpendicularTo').and.returnValue(false)
            zombie.moveNearest(human)
          })

          it("should not call Pathfinder.moveRandomly", function(){
            expect(Pathfinder.moveRandomly).not.toHaveBeenCalled()
          })

          it("should not call Pathfinder.movePerpendicularTo", function(){
            expect(Pathfinder.movePerpendicularTo).not.toHaveBeenCalled()
          })
        })
      })
    })
  });
});