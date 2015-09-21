let Pathfinder;

Pathfinder = require('pathfinder');

class Board {
  constructor(attributes){
    this.humanoid = null;
    this.score = 0;
    this.dx = 0;
    this.dy = 0;
    this.humanoids = attributes.humanoids || [];
  }

  isGameActive(){
    return this.humanoids.some(function(humanoid){
      return humanoid.isHuman() || humanoid.isPlayer();
    });
  }

  isPlayerAlive(){
    return this.humanoids.some(function(humanoid){
      return humanoid.isPlayer();
    });
  }

  nearestLivingHumanoid(){
    let livingHumanoids, closestPos, closestHumanoid;

    livingHumanoids = this.findSimilarHumanoids('Player')
                          .concat(this.findSimilarHumanoids('Human'));
    closestPos = this.findClosestPos(livingHumanoids);
    closestHumanoid = this.findClosestHumanoid(closestPos, livingHumanoids);
    return closestHumanoid;
  }

  nearestZombie(){
    let similarHumanoids, closestPos, closestHumanoid;

    similarHumanoids = this.findSimilarHumanoids('Zombie');
    closestPos = this.findClosestPos(similarHumanoids);
    closestHumanoid = this.findClosestHumanoid(closestPos, similarHumanoids);
    return closestHumanoid;
  }

  nextTurn(){
    for (let i = 0; i < this.humanoids.length; i++) {
      this.humanoid = this.humanoids[i];
      this.humanoid.handleNextMove({
        nearestHumanoid: this.nearestLivingHumanoid(),
        nearestZombie: this.nearestZombie(),
        dx: this.dx,
        dy: this.dy,
        humanoids: this.humanoids
      });
    }
    this.incrementScore();
  }

  incrementScore(){
    if (this.isPlayerAlive()) { this.score += 10; }
  }

  otherHumanoids(){
    return this.humanoids.filter((currentHumanoid) => {
      return this.humanoid.id !== currentHumanoid.id;
    });
  }

  findSimilarHumanoids(humanoidType){
    return this.otherHumanoids().filter(function(humanoid){
      return humanoid.humanType === humanoidType;
    });
  }

  findClosestPos(otherHumanoids){
    let closestPos, dist;

    closestPos = [];
    for (let i = 0; i < otherHumanoids.length; i++) {
      dist = Pathfinder.distanceTo(otherHumanoids[i].position, this.humanoid.position);
      closestPos.push(dist);
    }
    return closestPos;
  }

  findClosestHumanoid(closestPos, otherHumanoids){
    let closestHumanoidValue, closestHumanoid;

    closestHumanoidValue = Math.min.apply(null, closestPos);
    for (let i = 0; i < closestPos.length; i++) {
      if (closestPos[i] === closestHumanoidValue) { closestHumanoid = otherHumanoids[i]; }
    }
    return closestHumanoid;
  }
}

module.exports = Board;
