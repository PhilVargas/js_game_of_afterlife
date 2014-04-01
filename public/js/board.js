var Board = function(attributes){
  this.humanoids = attributes.humanoids || [];
  this.width = attributes.width  || '600px';
  this.height = attributes.height || '400px';
}

Board.prototype = {
  isValidDestination: function(target_position){
    var result = true
    for(i= 0; i < this.humanoids.lenght; i++){
      if(this.humanoids[i].position == target_position){ result = false }
    }
    return result
  },

  nearest_humanoid: function(humanoid){
    var x = humanoid.position.x
    var y = humanoid.position.y

    var otherHumanoids = this.findSelfHumanoid(humanoid)
    var otherHumanoids = this.findSimilarHumanoids(otherHumanoids, humanoid)
    //find distance from pos
    var closestPos = []
    for(i=0; i< otherHumanoids.length; i++){
      var dist = Pathfinder.distanceTo(otherHumanoids[i].position, humanoid.position)
      closestPos.push(dist);
    }
    //find closest humanoid
    var closestHumanoidValue = Math.min.apply(null, closestPos)
    for(i=0; i < closestPos.length; i++){
      if(closestPos[i] == closestHumanoidValue){ var closestHumanoid = otherHumanoids[i]}
    }
    return closestHumanoid
  },

  next_turn: function(){

  },
  findSelfHumanoid: function(humanoid){
    var otherHumanoids = []
    for(i=0; i < this.humanoids.length; i++){
      if(this.humanoids[i].position == humanoid.position){
        var otherHumanoids = this.humanoids
        otherHumanoids.splice(i, 1)
      }
    }
    return otherHumanoids
  },
  findSimilarHumanoids: function(otherHumanoids, humanoid){
    //find humanoids that are similar to the humanoid
    for(i=0; i< otherHumanoids.length; i++){
      if(otherHumanoids[i].humanType != humanoid.humanType){ otherHumanoids.splice(i, 1)}
    }
    return otherHumanoids
  }

}