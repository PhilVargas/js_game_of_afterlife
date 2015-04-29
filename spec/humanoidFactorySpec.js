describe("HumanoidBuilder", function(){
  describe(".creation", function(){
    it("should create an array of humans",function(){
      expect(HumanoidBuilder.creation(5, 'human', 10).length).toEqual(5)
    })
  })

  describe(".populate", function(){
    // builder creates an array of humanoids 1 greater than the inputs to account for the human
    // player
    it("should create an array of length 16",function(){
      expect(HumanoidBuilder.populate(10,5).length).toEqual(16)
    })

    it("should call .creation", function(){
      spyOn(HumanoidBuilder, 'creation').and.returnValue([1])
      HumanoidBuilder.populate()
      expect(HumanoidBuilder.creation).toHaveBeenCalled()
    })
  })
})
