let Humanoid, gameSettings, Human, Zombie, Player;
gameSettings = require('settings');
Humanoid = require('humanoid');
Human = require('humanoids/human');
Zombie = require('humanoids/zombie');

class HumanoidBuilder {
  static humanoidMap(){
    return {
      human: Human,
      zombie: Zombie,
      player: Player
    };
  }

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
      if (type === 'human' || type === 'zombie') {
        let H = this.humanoidMap()[type];
        newHumanoid = new H({speed: speed, id: baseId + i});
      // } else if (type === 'zombie'){
      //   newHumanoid = new Zombie({speed: speed, id: baseId + i});
      } else {
        newHumanoid = new Humanoid({humanType: type, speed: speed, id: baseId + i});
      }
      population.push(newHumanoid);
    }
    return population;
  }
}

module.exports = HumanoidBuilder;
