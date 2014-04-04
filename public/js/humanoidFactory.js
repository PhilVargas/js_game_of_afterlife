var HumanoidBuilder = {
  populate: function(numberOfHumans, numberOfZombies){
    return HumanoidBuilder.creation(numberOfHumans, 'human', gameSettings.humanSpeed).concat(HumanoidBuilder.creation(numberOfZombies, 'zombie', gameSettings.zombieSpeed ))
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