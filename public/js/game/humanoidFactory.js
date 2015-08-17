let Humanoid, gameSettings;
gameSettings = require('settings');
Humanoid = require('humanoid');

class HumanoidBuilder {
  static populate(numberOfHumans, numberOfZombies){
    let population = [];
    population = population.concat(this.creation(numberOfHumans, 'human', gameSettings.humanSpeed));
    population = population.concat(
      this.creation(numberOfZombies, 'zombie', gameSettings.zombieSpeed, population.length)
    );
    population = population.concat(
      this.creation(1, 'player', gameSettings.playerSpeed, population.length)
    );
    return population;
  }

  static creation(number, type, speed, baseId = 0){
    let population, newHumanoid;
    population = [];
    for(let i = 0; i < number; i++){
      newHumanoid = new Humanoid({humanType: type, speed: speed, id: baseId + i});
      population.push(newHumanoid);
    }
    return population;
  }
}

module.exports = HumanoidBuilder;
