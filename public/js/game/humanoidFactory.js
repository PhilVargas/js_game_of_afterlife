let Humanoid, gameSettings;
gameSettings = require('settings');
Humanoid = require('humanoid');

class HumanoidBuilder {
  static populate(numberOfHumans, numberOfZombies){
    return (
      this.creation(numberOfHumans, 'human', gameSettings.humanSpeed)
        .concat(HumanoidBuilder.creation(numberOfZombies, 'zombie', gameSettings.zombieSpeed))
        .concat(HumanoidBuilder.creation(1, 'player', gameSettings.playerSpeed))
    );
  }

  static creation(number, type, speed){
    let population, newHumanoid;
    population = [];
    for(let i = 0; i < number; i++){
      newHumanoid = new Humanoid({humanType: type, speed: speed, id: i});
      population.push(newHumanoid);
    }
    return population;
  }
}

module.exports = HumanoidBuilder;
