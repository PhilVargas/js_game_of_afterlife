let gameSettings, Human, Zombie, Player;
gameSettings = require('settings');
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
    population = population.concat(this.creation(numberOfHumans, 'Human'));
    population = population.concat(
      this.creation(numberOfZombies, 'Zombie', population.length)
    );
    population = population.concat(
      this.creation(1, 'Player', population.length)
    );
    return population;
  }

  static creation(number, type, baseId = 0){
    let population, newHumanoid, map;
    map = this.humanoidMap();
    population = [];
    for(let i = 0; i < number; i++){
      let H = map[type];
      newHumanoid = new H({id: baseId + i});
      population.push(newHumanoid);
    }
    return population;
  }
}

module.exports = HumanoidBuilder;
