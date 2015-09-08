let Pathfinder, Settings, Humanoid, InfectedHuman;

Settings = require('settings');
Pathfinder = require('pathfinder');
Humanoid = require('humanoids/humanoid');
InfectedHuman = require('humanoids/infectedHuman');

class Player extends Humanoid {
  constructor(opts) {
    super(opts);
    this.speed = Settings.playerSpeed;
  }

  isAbleToBite() {
    return false;
  }

  transform() {
    return(
      new InfectedHuman(this.cloneProps())
    );
  }

  handleNextMove(opts){
    let targetLoc, coords;
    let { dx, dy } = opts;

    targetLoc = {
      x: this.position.x + dx * this.speed,
      y: this.position.y + dy * this.speed
    };
    coords = (Pathfinder.moveTowards(this.position, targetLoc, this.speed));
    this.position = Pathfinder.getRelativePosition(coords);
  }
}

module.exports = Player;

