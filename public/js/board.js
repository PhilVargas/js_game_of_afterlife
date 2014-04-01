var Board = function( attributes  ){
  this.humanoids = attributes.humanoids || [];
  this.width = attributes.width  || '600px';
  this.height = attributes.height || '400px';
}

Board.prototype = {
  isValidDestination: function( target_position ){
    var result = true
    for(i= 0; i < this.humanoids.lenght; i++ ){
      if( this.humanoids[i].position == target_position ){ result = false }
    }
    return result
  },

  nearest_humanoid: function( humanoid ){
    var x = humanoid.position.x
    var y = humanoid.position.y

    var otherHumanoids = this.findSelfHumanoid( humanoid )
    var otherHumanoids = this.findSimilarHumanoids( otherHumanoids, humanoid )
    var closestPos = this.findClosestPos()
    var closestHumanoid = this.findClosestHumanoid( closetsPos, otherHumanoids  )
    return closestHumanoid
  },

  next_turn: function(){
    for( i=0; i< humanoids.length; i++ ){
      if( humanoids[i].humanType == "infectedHuman" ){
          humanoid[i].incrementTimeSinceInfection
          // skip the rest
      }
        var humanoid = humanoids[i]
        var nearestZombie = this.nearestHumanoid( humanoid, "zombie"  )
        var nearestHuman = this.nearestHumanoid(  humanoid, "human"  )
      if(  nearestHuman === null  ) { var destination = humanoid.moveNearest(  nearestZombie  )}
        else if( humanoid.humanType == "zombie" ){
          if ( Pathfinder.distanceTo( nearestHuman, humanoid ) < Pathfinder.distanceTo( nearestZombie, humanoid ) * 6){
            var destination = humanoid.moveNearest(nearestHuman)
          }
          else {
            var destination = humanoid.moveNearest( nearestZombie )
          }
        }
        else if( humanoid.humanType == "human" ){
          if ( Pathfinder.distanceTo( nearestZombie, humanoid ) < 50 ){
            var destination = humanoid.moveNearest( nearestZombie )
          }
          else {
            var destination = humanoid.moveNearest( nearestHuman )
          }
        }
      }
      destination.x = ( destination.x/this.width )
      destination.y = ( destination.y/this.height )
      if( nearestHuman != null ){
        if( humanoid.humanType == 'infectedHuman' &&  Pathfinder.distanceTo( nearestHuman, humanoid ) < 10 ){
          humanoid.bite(  nearestHuman )
        }
      }
      if( this.isValidDestination( destination ) == true ){
        humanoid.position = destination
      }
    if( humanoids.length > 0 ){
      for(i=0; i < humanoids.length; i++){
        humanoids[i].humanType == "human" ? humanoids : null;
      }
    }
  },

  //nearest HUMANOID PRIVATE METHODS
  findSelfHumanoid: function( humanoid ){
    var otherHumanoids = []
    for( i=0; i < this.humanoids.length; i++ ){
      if( this.humanoids[i].position == humanoid.position ){
        var otherHumanoids = this.humanoids
        otherHumanoids.splice( i, 1 )
      }
    }
    return otherHumanoids
  },
  findSimilarHumanoids: function( otherHumanoids, humanoid ){
    for( i=0; i< otherHumanoids.length; i++ ){
      if( otherHumanoids[i].humanType != humanoid.humanType ){ otherHumanoids.splice( i, 1 )}
    }
    return otherHumanoids
  },
  findClosestPos: function(  ){
    var closestPos = []
    for( i=0; i< otherHumanoids.length; i++ ){
      var dist = Pathfinder.distanceTo( otherHumanoids[i].position, humanoid.position )
      closestPos.push( dist );
    }
    return closestPos
  },
  findClosestHumanoid: function( closestPos, otherHumanoids  ){
    var closestHumanoidValue = Math.min.apply( null, closestPos )
    for( i=0; i < closestPos.length; i++ ){
      if( closestPos[i] == closestHumanoidValue ){ var closestHumanoid = otherHumanoids[i]}
    }
   return closestHumanoid
  }
}