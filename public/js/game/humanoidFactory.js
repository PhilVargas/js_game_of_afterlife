let HumnanoidBuilder, Humanoid, gameSettings;
gameSettings = require('settings')
Humanoid = require('humanoid')

let HumanoidBuilder = {
  populate(numberOfHumans, numberOfZombies){
    return (
      HumanoidBuilder.creation(numberOfHumans, 'human', gameSettings.humanSpeed)
        .concat(HumanoidBuilder.creation(numberOfZombies, 'zombie', gameSettings.zombieSpeed))
        .concat(HumanoidBuilder.creation(1, 'player', gameSettings.playerSpeed))
    )
  },

  creation(number, type, speed){
    let population, newHumanoid;
    population = [];
    for(let i = 0; i < number; i++){
      newHumanoid = new Humanoid({'humanType': type, 'speed': speed});
      population.push(newHumanoid);
    }
    return population
  }
}

module.exports = HumanoidBuilder
