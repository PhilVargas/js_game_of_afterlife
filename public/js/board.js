var Board = function( attributes ){
  this.humanoid;
  this.score = 0;
  this.dx = 0;
  this.dy = 0;
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

  isAnyHumanRemaining: function(){
    var result = false
    for( var i=0; i < this.humanoids.length; i++ ){
      if(this.humanoids[i].humanType == "human"  || this.humanoids[i].humanType == "player") { result = true; break };
    }
    return result
  },

  nextTurn: function(){
    for( var i=0; i< this.humanoids.length; i++ ){
      this.humanoid = this.humanoids[i]
      if( this.humanoid.humanType == "infectedHuman" ){
          this.humanoid.incrementTimeSinceInfection()
          continue
      }
      if( this.humanoid.humanType == "player" ){
        var targetLoc = { x: this.humanoid.position.x + this.dx*this.humanoid.speed,  y: this.humanoid.position.y + this.dy*this.humanoid.speed }
        var coords = ( Pathfinder.moveTowards(this.humanoid.position, targetLoc, this.humanoid.speed) )
        coords.x = ( (coords.x + this.width) % this.width )
        coords.y = ( (coords.y + this.height) % this.height )
        this.humanoid.position = coords
        continue
      }
      var nearestZombie = this.nearestHumanoid( "zombie" )
      var nearestHuman = this.nearestHumanoid( "human" )
      var player = this.nearestHumanoid( 'player' )
      var destination = this.setDestination( nearestHuman, nearestZombie, player )
      destination.x = ( (destination.x + this.width) % this.width )
      destination.y = ( (destination.y + this.height) % this.height )

      if ( this.humanoid.isAbleToBite( player ) ){
        this.humanoid.bite( player )
      }

      if ( this.humanoid.isAbleToBite( nearestHuman ) ){
        this.humanoid.bite( nearestHuman )
      }

      if( this.isValidDestination( destination ) ){
        this.humanoid.position = destination
      }
    };
    this.incrementStore(player);
  },

  incrementStore: function(player){
    if (player && player.humanType === 'player'){ this.score += 10 }
  },

  setDestination: function( nearestHuman, nearestZombie, player ){
    if( this.humanoid.humanType == "zombie" ){ return this.setZombieDestination( nearestHuman, nearestZombie, player ) }
    else if( this.humanoid.humanType == "human" ){ return this.setHumanDestination( nearestHuman, nearestZombie, player ) }
    else { return this.humanoid.position }
  },

  setZombieDestination: function( nearestHuman, nearestZombie, player ){
    var playerDistance = Number.POSITIVE_INFINITY;
    var humanDistance = Number.POSITIVE_INFINITY;
    var zombieDistance = Pathfinder.distanceTo( nearestZombie.position, this.humanoid.position ) * gameSettings.zombieSpread
    if (player){ playerDistance = Pathfinder.distanceTo( player.position, this.humanoid.position ) }
    if (nearestHuman){ humanDistance = Pathfinder.distanceTo( nearestHuman.position, this.humanoid.position ) }

    if ( playerDistance < humanDistance ){
      if ( playerDistance < zombieDistance ){
        return this.humanoid.moveNearest( player )
      } else {
        return this.humanoid.moveNearest( nearestZombie )
      }
    } else if ( humanDistance < zombieDistance ){
      return this.humanoid.moveNearest( nearestHuman )
    } else {
      return this.humanoid.moveNearest( nearestZombie )
    }
  },

  setHumanDestination: function( nearestHuman, nearestZombie, player ){
    var playerDistance = Number.POSITIVE_INFINITY;
    var humanDistance = Number.POSITIVE_INFINITY;
    var zombieDistance = Pathfinder.distanceTo( nearestZombie.position, this.humanoid.position )
    if (player){ playerDistance = Pathfinder.distanceTo( player.position, this.humanoid.position ) }
    if (nearestHuman){ humanDistance = Pathfinder.distanceTo( nearestHuman.position, this.humanoid.position ) }

    if ( zombieDistance < gameSettings.humanFearRange || ( !player && !nearestHuman ) ){
      return this.humanoid.moveNearest( nearestZombie )
    } else if ( playerDistance < humanDistance ){
      return this.humanoid.moveNearest( player )
    } else {
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
