import { default as Human } from 'humanoids/human';
import { default as Zombie } from 'humanoids/zombie';
import { default as Player } from 'humanoids/player';

class HumanoidBuilder {
  static humanoidMap(){
    return {
      Human,
      Zombie,
      Player
    };
  }

  static populate(numberOfHumans, numberOfZombies){
    let population;

    population = [];
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
    const map = this.humanoidMap();
    const H = map[type];
    const population = [];

    for (let i = 0; i < number; i++) {
      const newHumanoid = new H({ id: baseId + i });

      population.push(newHumanoid);
    }
    return population;
  }
}

export { HumanoidBuilder as default };
