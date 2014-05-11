var Board = function( attributes  ){
  this.humanoid;
  this.humanoids = attributes.humanoids || [];
  this.width = attributes.width  || '600px';
  this.height = attributes.height || '400px';
}

Board.prototype = {
  isPositionEqual: function( position1, position2 ){
    return position1.x === position2.x && position1.y === position2.y 
  },
  isValidDestination: function( target_position ){
    var result = true
    for(var i= 0; i < this.humanoids.length; i++ ){
      if( this.isPositionEqual( this.humanoids[i].position , target_position ) ){ 
        result = false 
      }
    }
    return result
  },

  nearestHumanoid: function( humanoidType ){
    var similarHumanoids = this.findSimilarHumanoids( humanoidType )
    var closestPos = this.findClosestPos( similarHumanoids )
    var closestHumanoid = this.findClosestHumanoid( closestPos, similarHumanoids )
    return closestHumanoid
  },

  nextTurn: function(){
    for( var i=0; i< this.humanoids.length; i++ ){
      if( this.humanoids[i].humanType == "infectedHuman" ){
          this.humanoids[i].incrementTimeSinceInfection()
          continue
      }
      this.humanoid = this.humanoids[i]
      var nearestZombie = this.nearestHumanoid( "zombie" )
      var nearestHuman = this.nearestHumanoid( "human" )
      var destination = this.setDestination( nearestHuman, nearestZombie )
      destination.x = ( (destination.x + this.width) % this.width )
      destination.y = ( (destination.y + this.height) % this.height )
      //guard clause function
      if( nearestHuman != null ){
        if( this.humanoid.isAbleToBite() && (Pathfinder.distanceTo( nearestHuman.position, this.humanoid.position ) < 10) ){ this.humanoid.bite( nearestHuman ) }
      }
      //check on destination -- set destination
      if( this.isValidDestination( destination ) ){
        this.humanoid.position = destination
      }
      //checks if there are any more humans
    };
      if( this.humanoids.length > 0 ){
        var result = false
        for( var i=0; i < this.humanoids.length; i++ ){
          if(this.humanoids[i].humanType == "human") { result = true };
        }
        if( !result ){ return this.humanoids = [] }
      };
  },

  setDestination: function( nearestHuman, nearestZombie ){
    if( nearestHuman === null || nearestHuman === undefined  ) { return this.humanoid.moveNearest(  nearestZombie  )}
    else if( this.humanoid.humanType == "zombie" ){ return this.setZombieDestination( nearestHuman, nearestZombie ) }
    else if( this.humanoid.humanType == "human" ){ return this.setHumanDestination( nearestHuman, nearestZombie ) }
    else { return this.humanoid.position }
  },
  setZombieDestination: function( nearestHuman, nearestZombie ){
   if ( Pathfinder.distanceTo( nearestHuman.position, this.humanoid.position ) < Pathfinder.distanceTo( nearestZombie.position, this.humanoid.position ) * gameSettings.zombieSpread){
      return this.humanoid.moveNearest( nearestHuman )
    }
    else {
      return this.humanoid.moveNearest( nearestZombie )
    }
  },
  setHumanDestination: function( nearestHuman, nearestZombie ){
    if ( Pathfinder.distanceTo( nearestZombie.position, this.humanoid.position ) < gameSettings.humanFearRange ){
      return this.humanoid.moveNearest( nearestZombie )
    }
    else {
      return this.humanoid.moveNearest( nearestHuman )
    }
  },

  deleteSelfHumanoid: function(){
    var otherHumanoids = []
    for( var i=0; i < this.humanoids.length; i++){otherHumanoids.push(this.humanoids[i])}
    
    for( var i=0; i < this.humanoids.length; i++ ){
      if( this.isPositionEqual( this.humanoids[i].position , this.humanoid.position ) ){
        otherHumanoids.splice( i, 1 )
        break
      }
    }
    return otherHumanoids
  },
  findSimilarHumanoids: function( humanoidType ){
    var otherHumanoids = this.deleteSelfHumanoid()
    var similar = [];
    for( var i=0; i< otherHumanoids.length; i++ ){
      if( otherHumanoids[i].humanType === humanoidType ){ similar.push(otherHumanoids[i])}
    }
    return similar
  },
  findClosestPos: function( otherHumanoids ){
    var closestPos = []
    for( var i=0; i< otherHumanoids.length; i++ ){
      var dist = Pathfinder.distanceTo( otherHumanoids[i].position, this.humanoid.position )
      closestPos.push( dist );
    }
    return closestPos
  },
  findClosestHumanoid: function( closestPos, otherHumanoids ){
    var closestHumanoidValue = Math.min.apply( null, closestPos )
    for( var i=0; i < closestPos.length; i++ ){
      if( closestPos[i] == closestHumanoidValue ){ var closestHumanoid = otherHumanoids[i]}
    }
   return closestHumanoid
  }
}