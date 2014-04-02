var Board = function( attributes  ){
  this.humanoids = attributes.humanoids || [];
  this.width = attributes.width  || '600px';
  this.height = attributes.height || '400px';
}

Board.prototype = {
  isPositionEqual: function( position1, position2 ){
    return (position1.x == position2.x && position1.y == position2.y )
  },
  isValidDestination: function( target_position ){
    var result = true
    for(i= 0; i < this.humanoids.lenght; i++ ){
      if( this.isPositionEqual( this.humanoids[i].position , target_position ) ){ result = false }
    }
    return result
  },

  nearestHumanoid: function( humanoid, humanoidType ){
    var x = humanoid.position.x
    var y = humanoid.position.y

    var similarHumanoids = this.findSimilarHumanoids( humanoid, humanoidType )
    var closestPos = this.findClosestPos( similarHumanoids, humanoid )
    var closestHumanoid = this.findClosestHumanoid( closestPos, similarHumanoids  )
    return closestHumanoid
  },

  next_turn: function(){
    for( i=0; i< this.humanoids.length; i++ ){
      if( this.humanoids[i].humanType == "infectedHuman" ){
          this.humanoids[i].incrementTimeSinceInfection
          continue
      }
      var humanoid = this.humanoids[i]
      var nearestZombie = this.nearestHumanoid( humanoid, "zombie"  )
      var nearestHuman = this.nearestHumanoid(  humanoid, "human"  )

      setDestination( nearestHuman, nearestZombie, humanoid )

      destination.x = ( destination.x/this.width )
      destination.y = ( destination.y/this.height )

      //guard clause function
      if( nearestHuman != null ){
        if( humanoid.isAbleToBite && Pathfinder.distanceTo( nearestHuman, humanoid ) < 10 ){ humanoid.bite( nearestHuman ) }
      }

      //check on destination -- set destination
      if( this.isValidDestination( destination ) == true ){
        humanoid.position = destination
      }

      //checks if there are any more humans
      if( this.humanoids.length > 0 ){
        var result = false
        for( i=0; i < this.humanoids.length; i++ ){
          if(this.humanoids[i].humanType == "human") { result = true };
        }
        if( result ){ return this.humanoids }
        else { return null };
      };

    };
  },

  //next_turn set destination methods
  setDestination: function( nearestHuman, nearestZombie, humanoid ){
    if( nearestHuman === null ) { return humanoid.moveNearest(  nearestZombie  )}
    else if( humanoid.humanType == "zombie" ){ return this.setZombieDestination( nearestHuman, nearestZombie, humanoid ) }
    else if( humanoid.humanType == "human" ){ return this.setHumanDestination( nearestHuman, nearestZombie, humanoid ) }
  },
  setZombieDestination: function( nearestHuman, nearestZombie, humanoid ){
   if ( Pathfinder.distanceTo( nearestHuman.position, humanoid.position ) < Pathfinder.distanceTo( nearestZombie.position, humanoid.position ) * 6){
      return humanoid.moveNearest( nearestHuman )
    }
    else {
      return humanoid.moveNearest( nearestZombie )
    }
  },
  setHumanDestination: function( nearestHuman, nearestZombie, humanoid  ){
    if ( Pathfinder.distanceTo( nearestZombie.position, humanoid.position ) < 50 ){
      return humanoid.moveNearest( nearestZombie )
    }
    else {
      return humanoid.moveNearest( nearestHuman )
    }
  },

  //nearest HUMANOID PRIVATE METHODS
  deleteSelfHumanoid: function( humanoid ){
    var otherHumanoids = []
    for( i=0; i < this.humanoids.length; i++ ){
      if( this.isPositionEqual( this.humanoids[i].position , humanoid.position ) ){
        var otherHumanoids = this.humanoids
        otherHumanoids.splice( i, 1 )
        break
      }
    }
    return otherHumanoids
  },
  findSimilarHumanoids: function( humanoid, humanoidType ){
    otherHumanoids = this.deleteSelfHumanoid( humanoid )
    for( i=0; i< otherHumanoids.length; i++ ){
      if( otherHumanoids[i].humanType != humanoidType ){ otherHumanoids.splice( i, 1 )}
    }
    return otherHumanoids
  },
  findClosestPos: function( otherHumanoids, humanoid ){
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