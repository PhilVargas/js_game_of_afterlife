let Humanoid, gameSettings, Human, Zombie, Player;
gameSettings = require('settings');
Humanoid = require('humanoid');
Human = require('humanoids/human');
Zombie = require('humanoids/zombie');
Player = require('humanoids/player');

class HumanoidBuilder {
  static humanoidMap(){
    return {
      Human,
      Zombie,
      Player
    };
  }

  static populate(numberOfHumans, numberOfZombies){
    let population = [];
    population = population.concat(this.creation(numberOfHumans, 'Human', gameSettings.humanSpeed));
    population = population.concat(
      this.creation(numberOfZombies, 'Zombie', gameSettings.zombieSpeed, population.length)
    );
    population = population.concat(
      this.creation(1, 'Player', gameSettings.playerSpeed, population.length)
    );
    return population;
  }

  static creation(number, type, speed, baseId = 0){
    let population, newHumanoid, map;
    map = this.humanoidMap();
    population = [];
    for(let i = 0; i < number; i++){
      let H = map[type];
      newHumanoid = new H({speed: speed, id: baseId + i});
      population.push(newHumanoid);
    }
    return population;
  }
}

module.exports = HumanoidBuilder;
