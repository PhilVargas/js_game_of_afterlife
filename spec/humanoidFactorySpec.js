describe("HumanoidBuilder", function(){
  describe(".creation", function(){
    it("should create an array of humans",function(){
      expect(HumanoidBuilder.creation(5, 'human', 10).length).toEqual(5)
    })
  })

  describe(".populate", function(){
    it("should create an array of length 15",function(){
      expect(HumanoidBuilder.populate(10,5).length).toEqual(15)
    })

    it("should call .creation", function(){
      spyOn(HumanoidBuilder, 'creation').and.returnValue([1])
      HumanoidBuilder.populate()
      expect(HumanoidBuilder.creation).toHaveBeenCalled()
    })
  })
})