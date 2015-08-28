let Humanoid, gameSettings, Human;
gameSettings = require('settings');
Humanoid = require('humanoid');
Human = require('humanoids/human');

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
    console.log(population)
    return population;
  }

  static creation(number, type, speed, baseId = 0){
    let population, newHumanoid;
    population = [];
    console.log(type)
    for(let i = 0; i < number; i++){
      if (type === 'human') {
        newHumanoid = new Human({speed: speed, id: baseId + i});
      } else {
        newHumanoid = new Humanoid({humanType: type, speed: speed, id: baseId + i});
      }
      population.push(newHumanoid);
    }
    return population;
  }
}

module.exports = HumanoidBuilder;
