import { default as Pathfinder } from 'pathfinder';
import { default as Settings } from 'settings';
import { default as Humanoid } from 'humanoids/humanoid';
import { default as InfectedHuman } from 'humanoids/infectedHuman';

class Player extends Humanoid {
  constructor(opts){
    super(opts);
    this.speed = Settings.playerSpeed;
  }

  isAbleToBite(){
    return false;
  }

  transform(){
    return (
      new InfectedHuman(this.cloneProps())
    );
  }

  handleNextMove(opts){
    let targetLoc, coords;
    const { dx, dy } = opts;

    targetLoc = {
      x: this.position.x + dx * this.speed,
      y: this.position.y + dy * this.speed
    };
    coords = (Pathfinder.moveTowards(this.position, targetLoc, this.speed));
    this.position = Pathfinder.getRelativePosition(coords);
  }
}

export { Player as default };
