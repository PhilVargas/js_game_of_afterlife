var HumandoidBuilder = {
  populate: function(numberOfHumans, zombies){
    return (create(numberOfHumans, 'human', 10).push(create(zombies, 'zombies',5))
  }

  creation: function(number, type, speed){
    var population = []
    for(var i = 0; i < number; i++){
      var newHumanoid = new Humanoid({'humanType': type, 'speed': speed})
      population.push(newHumanoid)
    }
    return population
  }
}