var HumanoidBuilder = {
  populate: function(numberOfHumans, numberOfZombies){
    return HumanoidBuilder.creation(numberOfHumans, 'human', 10).concat(HumanoidBuilder.creation(numberOfZombies, 'zombies',5))
  },

  creation: function(number, type, speed){
    var population = []
    for(var i = 0; i < number; i++){
      var newHumanoid = new Humanoid({'humanType': type, 'speed': speed})
      population.push(newHumanoid)
    }
    return population
  }
}