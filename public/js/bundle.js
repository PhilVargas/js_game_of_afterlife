(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({"/Users/philipavargas/Desktop/js_game_of_afterlife/public/js/game/board.js":[function(require,module,exports){
'use strict';

var Board = undefined,
    Pathfinder = undefined,
    gameSettings = undefined;

Pathfinder = require('pathfinder');
gameSettings = require('settings');

Board = function (attributes) {
  this.humanoid;
  this.score = 0;
  this.dx = 0;
  this.dy = 0;
  this.humanoids = attributes.humanoids || [];
  this.width = attributes.width || '600px';
  this.height = attributes.height || '400px';
};

Board.prototype = {
  isGameActive: function isGameActive() {
    var activeStatus = false;
    for (var i = 0; i < this.humanoids.length; i++) {
      if (this.humanoids[i].humanType === 'human' || this.humanoids[i].humanType === 'player') {
        activeStatus = true;
      }
    }
    return activeStatus;
  },

  isPlayerAlive: function isPlayerAlive() {
    var activeStatus = false;
    for (var i = 0; i < this.humanoids.length; i++) {
      if (this.humanoids[i].humanType === 'player') {
        activeStatus = true;
      }
    }
    return activeStatus;
  },

  isPositionEqual: function isPositionEqual(position1, position2) {
    return position1.x === position2.x && position1.y === position2.y;
  },

  isValidDestination: function isValidDestination(target_position) {
    var result = true;
    for (var i = 0; i < this.humanoids.length; i++) {
      if (this.isPositionEqual(this.humanoids[i].position, target_position)) {
        result = false;
      }
    }
    return result;
  },

  nearestHumanoid: function nearestHumanoid(humanoidType) {
    var similarHumanoids = this.findSimilarHumanoids(humanoidType);
    var closestPos = this.findClosestPos(similarHumanoids);
    var closestHumanoid = this.findClosestHumanoid(closestPos, similarHumanoids);
    return closestHumanoid;
  },

  isAnyHumanRemaining: function isAnyHumanRemaining() {
    var result = false;
    for (var i = 0; i < this.humanoids.length; i++) {
      if (this.humanoids[i].humanType == "human" || this.humanoids[i].humanType == "player") {
        result = true;break;
      };
    }
    return result;
  },

  nextTurn: function nextTurn() {
    for (var i = 0; i < this.humanoids.length; i++) {
      this.humanoid = this.humanoids[i];
      if (this.humanoid.humanType == "infectedHuman") {
        this.humanoid.incrementTimeSinceInfection();
        continue;
      }
      if (this.humanoid.humanType == "player") {
        var targetLoc = { x: this.humanoid.position.x + this.dx * this.humanoid.speed, y: this.humanoid.position.y + this.dy * this.humanoid.speed };
        var coords = Pathfinder.moveTowards(this.humanoid.position, targetLoc, this.humanoid.speed);
        coords.x = (coords.x + this.width) % this.width;
        coords.y = (coords.y + this.height) % this.height;
        this.humanoid.position = coords;
        continue;
      }
      var nearestZombie = this.nearestHumanoid("zombie");
      var nearestHuman = this.nearestHumanoid("human");
      var player = this.nearestHumanoid('player');
      var destination = this.setDestination(nearestHuman, nearestZombie, player);
      destination.x = (destination.x + this.width) % this.width;
      destination.y = (destination.y + this.height) % this.height;

      if (this.humanoid.isAbleToBite(player)) {
        this.humanoid.bite(player);
      }

      if (this.humanoid.isAbleToBite(nearestHuman)) {
        this.humanoid.bite(nearestHuman);
      }

      if (this.isValidDestination(destination)) {
        this.humanoid.position = destination;
      }
    };
    this.incrementStore(player);
  },

  incrementStore: function incrementStore(player) {
    if (player && player.humanType === 'player') {
      this.score += 10;
    }
  },

  setDestination: function setDestination(nearestHuman, nearestZombie, player) {
    if (this.humanoid.humanType == "zombie") {
      return this.setZombieDestination(nearestHuman, nearestZombie, player);
    } else if (this.humanoid.humanType == "human") {
      return this.setHumanDestination(nearestHuman, nearestZombie, player);
    } else {
      return this.humanoid.position;
    }
  },

  setZombieDestination: function setZombieDestination(nearestHuman, nearestZombie, player) {
    var playerDistance = Number.POSITIVE_INFINITY;
    var humanDistance = Number.POSITIVE_INFINITY;
    var zombieDistance = Pathfinder.distanceTo(nearestZombie.position, this.humanoid.position) * gameSettings.zombieSpread;
    if (player) {
      playerDistance = Pathfinder.distanceTo(player.position, this.humanoid.position);
    }
    if (nearestHuman) {
      humanDistance = Pathfinder.distanceTo(nearestHuman.position, this.humanoid.position);
    }

    if (playerDistance < humanDistance) {
      if (playerDistance < zombieDistance) {
        return this.humanoid.moveNearest(player);
      } else {
        return this.humanoid.moveNearest(nearestZombie);
      }
    } else if (humanDistance < zombieDistance) {
      return this.humanoid.moveNearest(nearestHuman);
    } else {
      return this.humanoid.moveNearest(nearestZombie);
    }
  },

  setHumanDestination: function setHumanDestination(nearestHuman, nearestZombie, player) {
    var playerDistance = Number.POSITIVE_INFINITY;
    var humanDistance = Number.POSITIVE_INFINITY;
    var zombieDistance = Pathfinder.distanceTo(nearestZombie.position, this.humanoid.position);
    if (player) {
      playerDistance = Pathfinder.distanceTo(player.position, this.humanoid.position);
    }
    if (nearestHuman) {
      humanDistance = Pathfinder.distanceTo(nearestHuman.position, this.humanoid.position);
    }

    if (zombieDistance < gameSettings.humanFearRange || !player && !nearestHuman) {
      return this.humanoid.moveNearest(nearestZombie);
    } else if (playerDistance < humanDistance) {
      return this.humanoid.moveNearest(player);
    } else {
      return this.humanoid.moveNearest(nearestHuman);
    }
  },

  deleteSelfHumanoid: function deleteSelfHumanoid() {
    var otherHumanoids = [];
    for (var i = 0; i < this.humanoids.length; i++) {
      otherHumanoids.push(this.humanoids[i]);
    }

    for (var i = 0; i < this.humanoids.length; i++) {
      if (this.isPositionEqual(this.humanoids[i].position, this.humanoid.position)) {
        otherHumanoids.splice(i, 1);
        break;
      }
    }
    return otherHumanoids;
  },
  findSimilarHumanoids: function findSimilarHumanoids(humanoidType) {
    var otherHumanoids = this.deleteSelfHumanoid();
    var similar = [];
    for (var i = 0; i < otherHumanoids.length; i++) {
      if (otherHumanoids[i].humanType === humanoidType) {
        similar.push(otherHumanoids[i]);
      }
    }
    return similar;
  },
  findClosestPos: function findClosestPos(otherHumanoids) {
    var closestPos = [];
    for (var i = 0; i < otherHumanoids.length; i++) {
      var dist = Pathfinder.distanceTo(otherHumanoids[i].position, this.humanoid.position);
      closestPos.push(dist);
    }
    return closestPos;
  },
  findClosestHumanoid: function findClosestHumanoid(closestPos, otherHumanoids) {
    var closestHumanoidValue = Math.min.apply(null, closestPos);
    for (var i = 0; i < closestPos.length; i++) {
      if (closestPos[i] == closestHumanoidValue) {
        var closestHumanoid = otherHumanoids[i];
      }
    }
    return closestHumanoid;
  }
};

module.exports = Board;

},{"pathfinder":"/Users/philipavargas/Desktop/js_game_of_afterlife/public/js/game/pathfinder.js","settings":"/Users/philipavargas/Desktop/js_game_of_afterlife/public/js/game/settings.js"}],"/Users/philipavargas/Desktop/js_game_of_afterlife/public/js/game/game.js":[function(require,module,exports){
'use strict';

var Board = require('board');
var HumanoidBuilder = require('humanoidFactory');
var gameSettings = require('settings');

function initialize() {
  var canvas = document.getElementsByTagName('canvas')[0];
  var width = canvas.width;
  var height = canvas.height;
  var ctx = canvas.getContext('2d');
  var allHumanoids = HumanoidBuilder.populate(gameSettings.humanCount, gameSettings.zombieCount);
  var board = new Board({ humanoids: allHumanoids, width: width, height: height });

  document.addEventListener("keyup", function (e) {
    // s = 83
    // w = 87
    // a = 65
    // d = 68
    if (e.which === 68 || e.which === 65) {
      board.dx = 0;
    }
    if (e.which === 83 || e.which === 87) {
      board.dy = 0;
    }
  });

  document.addEventListener("keydown", function (e) {
    if (e.which === 65) {
      board.dx = -1;
    } else if (e.which === 68) {
      board.dx = 1;
    } else if (e.which === 87) {
      board.dy = -1;
    } else if (e.which === 83) {
      board.dy = 1;
    }
  });

  function drawHumanoids() {
    ctx.clearRect(0, 0, width, height);
    for (var i = 0; i < board.humanoids.length; i++) {
      ctx.beginPath();
      var player = board.humanoids[i];
      var x = player.position.x,
          y = player.position.y;
      ctx.arc(x, y, 5, 0, 2 * Math.PI);

      if (player.humanType === 'human') {
        player.color = '#00aaaa';
      } else if (player.humanType === 'zombie') {
        player.color = '#ff0000';
      } else if (player.humanType === 'player') {
        player.color = '#00cc00';
      } else {
        player.color = '#770000';
      }

      ctx.fillStyle = player.color;
      ctx.fill();
      ctx.stroke();
    }
  }

  function callNextTurn(board) {
    var delay, nextRequest;
    nextRequest = function () {
      drawHumanoids();
      if (board.isGameActive()) {
        document.getElementById('score').innerHTML = board.score;
        board.nextTurn();
        delay = board.isPlayerAlive() ? gameSettings.turnDelay.normal : gameSettings.turnDelay.fast;
        setTimeout(nextRequest, delay);
      } else {
        alert('EVERYBODY IS DEAD!!!\nYour score was: ' + board.score);
      }
    };
    setTimeout(nextRequest, gameSettings.turnDelay.normal);
  }
  callNextTurn(board);
}

module.exports = initialize;

},{"board":"/Users/philipavargas/Desktop/js_game_of_afterlife/public/js/game/board.js","humanoidFactory":"/Users/philipavargas/Desktop/js_game_of_afterlife/public/js/game/humanoidFactory.js","settings":"/Users/philipavargas/Desktop/js_game_of_afterlife/public/js/game/settings.js"}],"/Users/philipavargas/Desktop/js_game_of_afterlife/public/js/game/humanoid.js":[function(require,module,exports){
'use strict';

var Humanoid = undefined,
    Pathfinder = undefined,
    gameSettings = undefined;

Pathfinder = require('pathfinder');
gameSettings = require('settings');

Humanoid = function (attributes) {
  this.position = attributes.position || { 'x': 5 + Math.floor(Math.random() * 591), 'y': 5 + Math.floor(Math.random() * 391) };
  this.speed = attributes.speed;
  this.humanType = attributes.humanType;
  this.timeSinceInfection = 0;
  this.lastPosition = { 'x': this.position.x, 'y': this.position.y };
};

Humanoid.prototype = {
  isAttractedTo: function isAttractedTo(nearestObject) {
    return nearestObject.humanType === 'human' || nearestObject.humanType === 'player';
  },

  storeLastPosition: function storeLastPosition() {
    this.lastPosition = { 'x': this.position.x, 'y': this.position.y };
  },

  isLastMoveRepeated: function isLastMoveRepeated(potentialMove) {
    return Math.abs(potentialMove.x - this.lastPosition.x) < gameSettings.repitionTolerance && Math.abs(potentialMove.y - this.lastPosition.y) < gameSettings.repitionTolerance;
  },

  getBitten: function getBitten() {
    this.humanType = 'infectedHuman';
    this.speed = 0;
  },

  bite: function bite(human) {
    if (human) human.getBitten();
  },

  turnToZombie: function turnToZombie() {
    this.humanType = 'zombie';
    this.speed = gameSettings.zombieSpeed;
  },

  isAbleToBite: function isAbleToBite(human) {
    if (human) {
      return this.humanType === 'zombie' && Pathfinder.distanceTo(human.position, this.position) < 10;
    }
  },

  incrementTimeSinceInfection: function incrementTimeSinceInfection() {
    this.timeSinceInfection++;
    if (this.timeSinceInfection === 5) {
      this.turnToZombie();
    }
  },

  moveNearest: function moveNearest(nearestObject) {
    var potentialMove;
    if (this.isAttractedTo(nearestObject)) {
      potentialMove = Pathfinder.moveTowards(this.position, nearestObject.position, this.speed);
    } else {
      potentialMove = Pathfinder.moveAwayFrom(this.position, nearestObject.position, this.speed);
    }
    if (this.lastPosition.x === this.position.x && this.lastPosition.y === this.position.y) {
      this.storeLastPosition();
      return Pathfinder.moveRandomly(this.position, this.speed);
    } else if (this.isLastMoveRepeated(potentialMove)) {
      this.storeLastPosition();
      return Pathfinder.movePerpendicularTo(this.position, nearestObject.position, this.speed);
    } else {
      this.storeLastPosition();
      return potentialMove;
    }
  }
};

module.exports = Humanoid;

},{"pathfinder":"/Users/philipavargas/Desktop/js_game_of_afterlife/public/js/game/pathfinder.js","settings":"/Users/philipavargas/Desktop/js_game_of_afterlife/public/js/game/settings.js"}],"/Users/philipavargas/Desktop/js_game_of_afterlife/public/js/game/humanoidFactory.js":[function(require,module,exports){
'use strict';

var HumnanoidBuilder = undefined,
    Humanoid = undefined,
    gameSettings = undefined;
gameSettings = require('settings');
Humanoid = require('humanoid');

var HumanoidBuilder = {
  populate: function populate(numberOfHumans, numberOfZombies) {
    return HumanoidBuilder.creation(numberOfHumans, 'human', gameSettings.humanSpeed).concat(HumanoidBuilder.creation(numberOfZombies, 'zombie', gameSettings.zombieSpeed)).concat(HumanoidBuilder.creation(1, 'player', gameSettings.playerSpeed));
  },

  creation: function creation(number, type, speed) {
    var population = [];
    for (var i = 0; i < number; i++) {
      var newHumanoid = new Humanoid({ 'humanType': type, 'speed': speed });
      population.push(newHumanoid);
    }
    return population;
  }
};

module.exports = HumanoidBuilder;

},{"humanoid":"/Users/philipavargas/Desktop/js_game_of_afterlife/public/js/game/humanoid.js","settings":"/Users/philipavargas/Desktop/js_game_of_afterlife/public/js/game/settings.js"}],"/Users/philipavargas/Desktop/js_game_of_afterlife/public/js/game/initialize.js":[function(require,module,exports){
'use strict';

var init = require('game');
init();

},{"game":"/Users/philipavargas/Desktop/js_game_of_afterlife/public/js/game/game.js"}],"/Users/philipavargas/Desktop/js_game_of_afterlife/public/js/game/pathfinder.js":[function(require,module,exports){
'use strict';

var Pathfinder = {
  moveTowards: function moveTowards(currentPosition, friendlyLocation, speed) {
    var deltaY = friendlyLocation.y - currentPosition.y;
    var deltaX = friendlyLocation.x - currentPosition.x;
    var length = Pathfinder.distanceTo(friendlyLocation, currentPosition);
    if (speed !== 0 && length < speed) {
      return friendlyLocation;
    } else {
      return { 'x': currentPosition.x + deltaX / length * speed, 'y': currentPosition.y + deltaY / length * speed };
    }
  },

  movePerpendicularTo: function movePerpendicularTo(currentPosition, friendlyLocation, speed) {
    var deltaY = friendlyLocation.y - currentPosition.y;
    var deltaX = friendlyLocation.x - currentPosition.x;
    var length = Pathfinder.distanceTo(friendlyLocation, currentPosition);
    if (speed !== 0 && length < speed) {
      return friendlyLocation;
    } else {
      return { 'x': currentPosition.x + deltaX / length * speed, 'y': currentPosition.y - deltaY / length * speed };
    }
  },

  moveAwayFrom: function moveAwayFrom(currentPosition, hostileLocation, speed) {
    return Pathfinder.moveTowards(currentPosition, hostileLocation, -speed);
  },

  distanceTo: function distanceTo(targetLocation, currentPosition) {
    var deltaY = targetLocation.y - currentPosition.y;
    var deltaX = targetLocation.x - currentPosition.x;
    return Math.sqrt(Math.pow(deltaY, 2) + Math.pow(deltaX, 2));
  },

  moveRandomly: function moveRandomly(currentPosition, speed) {
    var angle = undefined;
    angle = Math.random() * 2 * Math.PI;
    return { 'x': currentPosition.x + Math.cos(angle) * speed, 'y': currentPosition.y + Math.sin(angle) * speed };
  }
};

module.exports = Pathfinder;

},{}],"/Users/philipavargas/Desktop/js_game_of_afterlife/public/js/game/settings.js":[function(require,module,exports){
"use strict";

var gameSettings = {
  humanSpeed: 7,
  playerSpeed: 6,
  zombieSpeed: 4,
  humanCount: 30,
  zombieCount: 3,
  turnDelay: { normal: 100, fast: 25 },
  //sets the timeout between turns
  repitionTolerance: 1,
  //the range in which a move is considered repetitive
  //lower values will reduce the size of the range.
  zombieSpread: 3,
  //lower zombieSpread values will cause zombies to spread out more
  humanFearRange: 20
  //the range at which humans start running from zombies.
};

module.exports = gameSettings;

},{}]},{},["/Users/philipavargas/Desktop/js_game_of_afterlife/public/js/game/initialize.js"])
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL25vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIvVXNlcnMvcGhpbGlwYXZhcmdhcy9EZXNrdG9wL2pzX2dhbWVfb2ZfYWZ0ZXJsaWZlL3B1YmxpYy9qcy9nYW1lL2JvYXJkLmpzIiwiL1VzZXJzL3BoaWxpcGF2YXJnYXMvRGVza3RvcC9qc19nYW1lX29mX2FmdGVybGlmZS9wdWJsaWMvanMvZ2FtZS9nYW1lLmpzIiwiL1VzZXJzL3BoaWxpcGF2YXJnYXMvRGVza3RvcC9qc19nYW1lX29mX2FmdGVybGlmZS9wdWJsaWMvanMvZ2FtZS9odW1hbm9pZC5qcyIsIi9Vc2Vycy9waGlsaXBhdmFyZ2FzL0Rlc2t0b3AvanNfZ2FtZV9vZl9hZnRlcmxpZmUvcHVibGljL2pzL2dhbWUvaHVtYW5vaWRGYWN0b3J5LmpzIiwiL1VzZXJzL3BoaWxpcGF2YXJnYXMvRGVza3RvcC9qc19nYW1lX29mX2FmdGVybGlmZS9wdWJsaWMvanMvZ2FtZS9pbml0aWFsaXplLmpzIiwiL1VzZXJzL3BoaWxpcGF2YXJnYXMvRGVza3RvcC9qc19nYW1lX29mX2FmdGVybGlmZS9wdWJsaWMvanMvZ2FtZS9wYXRoZmluZGVyLmpzIiwiL1VzZXJzL3BoaWxpcGF2YXJnYXMvRGVza3RvcC9qc19nYW1lX29mX2FmdGVybGlmZS9wdWJsaWMvanMvZ2FtZS9zZXR0aW5ncy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7O0FDQUEsSUFBSSxLQUFLLFlBQUE7SUFBRSxVQUFVLFlBQUE7SUFBRSxZQUFZLFlBQUEsQ0FBQzs7QUFFcEMsVUFBVSxHQUFHLE9BQU8sQ0FBQyxZQUFZLENBQUMsQ0FBQztBQUNuQyxZQUFZLEdBQUcsT0FBTyxDQUFDLFVBQVUsQ0FBQyxDQUFDOztBQUVuQyxLQUFLLEdBQUcsVUFBVSxVQUFVLEVBQUU7QUFDNUIsTUFBSSxDQUFDLFFBQVEsQ0FBQztBQUNkLE1BQUksQ0FBQyxLQUFLLEdB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QUFDbEMsV0FBTyxFQUFDLEdBQUcsRUFBRyxlQUFlLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLEdBQUcsS0FBSyxBQUFDLEVBQUMsR0FBRyxFQUFHLGVBQWUsQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsR0FBRyxLQUFLLEFBQUMsRUFBQyxDQUFBO0dBQ2pIO0NBQ0YsQ0FBQTs7QUFFRCxNQUFNLENBQUMsT0FBTyxHQUFHLFVBQVUsQ0FBQTs7Ozs7QUN4QzNCLElBQUksWUFBWSxHQUFHO0FBQ2pCLFlBQVUsRUFBRSxDQUFDO0FBQ2IsYUFBVyxFQUFFLENBQUM7QUFDZCxhQUFXLEVBQUUsQ0FBQztBQUNkLFlBQVUsRUFBRSxFQUFFO0FBQ2QsYUFBVyxFQUFFLENBQUM7QUFDZCxXQUFTLEVBQUUsRUFBRSxNQUFNLEVBQUUsR0FBRyxFQUFFLElBQUksRUFBRSxFQUFFLEVBQUU7O0FBRXBDLG1CQUFpQixFQUFFLENBQUM7OztBQUdwQixjQUFZLEVBQUUsQ0FBQzs7QUFFZixnQkFBYyxFQUFFLEVBQUU7O0NBRW5CLENBQUM7O0FBRUYsTUFBTSxDQUFDLE9BQU8sR0FBRyxZQUFZLENBQUEiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwibGV0IEJvYXJkLCBQYXRoZmluZGVyLCBnYW1lU2V0dGluZ3M7XG5cblBhdGhmaW5kZXIgPSByZXF1aXJlKCdwYXRoZmluZGVyJyk7XG5nYW1lU2V0dGluZ3MgPSByZXF1aXJlKCdzZXR0aW5ncycpO1xuXG5Cb2FyZCA9IGZ1bmN0aW9uKCBhdHRyaWJ1dGVzICl7XG4gIHRoaXMuaHVtYW5vaWQ7XG4gIHRoaXMuc2NvcmUgPSAwO1xuICB0aGlzLmR4ID0gMDtcbiAgdGhpcy5keSA9IDA7XG4gIHRoaXMuaHVtYW5vaWRzID0gYXR0cmlidXRlcy5odW1hbm9pZHMgfHwgW107XG4gIHRoaXMud2lkdGggPSBhdHRyaWJ1dGVzLndpZHRoICB8fCAnNjAwcHgnO1xuICB0aGlzLmhlaWdodCA9IGF0dHJpYnV0ZXMuaGVpZ2h0IHx8ICc0MDBweCc7XG59XG5cbkJvYXJkLnByb3RvdHlwZSA9IHtcbiAgaXNHYW1lQWN0aXZlOiBmdW5jdGlvbigpe1xuICAgIHZhciBhY3RpdmVTdGF0dXMgPSBmYWxzZTtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRoaXMuaHVtYW5vaWRzLmxlbmd0aDsgaSsrKXtcbiAgICAgIGlmICh0aGlzLmh1bWFub2lkc1tpXS5odW1hblR5cGUgPT09ICdodW1hbicgfHwgdGhpcy5odW1hbm9pZHNbaV0uaHVtYW5UeXBlID09PSAncGxheWVyJyl7XG4gICAgICAgIGFjdGl2ZVN0YXR1cyA9IHRydWU7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBhY3RpdmVTdGF0dXM7XG4gIH0sXG5cbiAgaXNQbGF5ZXJBbGl2ZTogZnVuY3Rpb24oKXtcbiAgICB2YXIgYWN0aXZlU3RhdHVzID0gZmFsc2U7XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLmh1bWFub2lkcy5sZW5ndGg7IGkrKyl7XG4gICAgICBpZiAodGhpcy5odW1hbm9pZHNbaV0uaHVtYW5UeXBlID09PSAncGxheWVyJyl7XG4gICAgICAgIGFjdGl2ZVN0YXR1cyA9IHRydWU7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBhY3RpdmVTdGF0dXM7XG4gIH0sXG5cbiAgaXNQb3NpdGlvbkVxdWFsOiBmdW5jdGlvbiggcG9zaXRpb24xLCBwb3NpdGlvbjIgKXtcbiAgICByZXR1cm4gcG9zaXRpb24xLnggPT09IHBvc2l0aW9uMi54ICYmIHBvc2l0aW9uMS55ID09PSBwb3NpdGlvbjIueVxuICB9LFxuXG4gIGlzVmFsaWREZXN0aW5hdGlvbjogZnVuY3Rpb24oIHRhcmdldF9wb3NpdGlvbiApe1xuICAgIHZhciByZXN1bHQgPSB0cnVlXG4gICAgZm9yKHZhciBpPSAwOyBpIDwgdGhpcy5odW1hbm9pZHMubGVuZ3RoOyBpKysgKXtcbiAgICAgIGlmKCB0aGlzLmlzUG9zaXRpb25FcXVhbCggdGhpcy5odW1hbm9pZHNbaV0ucG9zaXRpb24gLCB0YXJnZXRfcG9zaXRpb24gKSApe1xuICAgICAgICByZXN1bHQgPSBmYWxzZVxuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gcmVzdWx0XG4gIH0sXG5cbiAgbmVhcmVzdEh1bWFub2lkOiBmdW5jdGlvbiggaHVtYW5vaWRUeXBlICl7XG4gICAgdmFyIHNpbWlsYXJIdW1hbm9pZHMgPSB0aGlzLmZpbmRTaW1pbGFySHVtYW5vaWRzKCBodW1hbm9pZFR5cGUgKVxuICAgIHZhciBjbG9zZXN0UG9zID0gdGhpcy5maW5kQ2xvc2VzdFBvcyggc2ltaWxhckh1bWFub2lkcyApXG4gICAgdmFyIGNsb3Nlc3RIdW1hbm9pZCA9IHRoaXMuZmluZENsb3Nlc3RIdW1hbm9pZCggY2xvc2VzdFBvcywgc2ltaWxhckh1bWFub2lkcyApXG4gICAgcmV0dXJuIGNsb3Nlc3RIdW1hbm9pZFxuICB9LFxuXG4gIGlzQW55SHVtYW5SZW1haW5pbmc6IGZ1bmN0aW9uKCl7XG4gICAgdmFyIHJlc3VsdCA9IGZhbHNlXG4gICAgZm9yKCB2YXIgaT0wOyBpIDwgdGhpcy5odW1hbm9pZHMubGVuZ3RoOyBpKysgKXtcbiAgICAgIGlmKHRoaXMuaHVtYW5vaWRzW2ldLmh1bWFuVHlwZSA9PSBcImh1bWFuXCIgIHx8IHRoaXMuaHVtYW5vaWRzW2ldLmh1bWFuVHlwZSA9PSBcInBsYXllclwiKSB7IHJlc3VsdCA9IHRydWU7IGJyZWFrIH07XG4gICAgfVxuICAgIHJldHVybiByZXN1bHRcbiAgfSxcblxuICBuZXh0VHVybjogZnVuY3Rpb24oKXtcbiAgICBmb3IoIHZhciBpPTA7IGk8IHRoaXMuaHVtYW5vaWRzLmxlbmd0aDsgaSsrICl7XG4gICAgICB0aGlzLmh1bWFub2lkID0gdGhpcy5odW1hbm9pZHNbaV1cbiAgICAgIGlmKCB0aGlzLmh1bWFub2lkLmh1bWFuVHlwZSA9PSBcImluZmVjdGVkSHVtYW5cIiApe1xuICAgICAgICAgIHRoaXMuaHVtYW5vaWQuaW5jcmVtZW50VGltZVNpbmNlSW5mZWN0aW9uKClcbiAgICAgICAgICBjb250aW51ZVxuICAgICAgfVxuICAgICAgaWYoIHRoaXMuaHVtYW5vaWQuaHVtYW5UeXBlID09IFwicGxheWVyXCIgKXtcbiAgICAgICAgdmFyIHRhcmdldExvYyA9IHsgeDogdGhpcy5odW1hbm9pZC5wb3NpdGlvbi54ICsgdGhpcy5keCp0aGlzLmh1bWFub2lkLnNwZWVkLCAgeTogdGhpcy5odW1hbm9pZC5wb3NpdGlvbi55ICsgdGhpcy5keSp0aGlzLmh1bWFub2lkLnNwZWVkIH1cbiAgICAgICAgdmFyIGNvb3JkcyA9ICggUGF0aGZpbmRlci5tb3ZlVG93YXJkcyh0aGlzLmh1bWFub2lkLnBvc2l0aW9uLCB0YXJnZXRMb2MsIHRoaXMuaHVtYW5vaWQuc3BlZWQpIClcbiAgICAgICAgY29vcmRzLnggPSAoIChjb29yZHMueCArIHRoaXMud2lkdGgpICUgdGhpcy53aWR0aCApXG4gICAgICAgIGNvb3Jkcy55ID0gKCAoY29vcmRzLnkgKyB0aGlzLmhlaWdodCkgJSB0aGlzLmhlaWdodCApXG4gICAgICAgIHRoaXMuaHVtYW5vaWQucG9zaXRpb24gPSBjb29yZHNcbiAgICAgICAgY29udGludWVcbiAgICAgIH1cbiAgICAgIHZhciBuZWFyZXN0Wm9tYmllID0gdGhpcy5uZWFyZXN0SHVtYW5vaWQoIFwiem9tYmllXCIgKVxuICAgICAgdmFyIG5lYXJlc3RIdW1hbiA9IHRoaXMubmVhcmVzdEh1bWFub2lkKCBcImh1bWFuXCIgKVxuICAgICAgdmFyIHBsYXllciA9IHRoaXMubmVhcmVzdEh1bWFub2lkKCAncGxheWVyJyApXG4gICAgICB2YXIgZGVzdGluYXRpb24gPSB0aGlzLnNldERlc3RpbmF0aW9uKCBuZWFyZXN0SHVtYW4sIG5lYXJlc3Rab21iaWUsIHBsYXllciApXG4gICAgICBkZXN0aW5hdGlvbi54ID0gKCAoZGVzdGluYXRpb24ueCArIHRoaXMud2lkdGgpICUgdGhpcy53aWR0aCApXG4gICAgICBkZXN0aW5hdGlvbi55ID0gKCAoZGVzdGluYXRpb24ueSArIHRoaXMuaGVpZ2h0KSAlIHRoaXMuaGVpZ2h0IClcblxuICAgICAgaWYgKCB0aGlzLmh1bWFub2lkLmlzQWJsZVRvQml0ZSggcGxheWVyICkgKXtcbiAgICAgICAgdGhpcy5odW1hbm9pZC5iaXRlKCBwbGF5ZXIgKVxuICAgICAgfVxuXG4gICAgICBpZiAoIHRoaXMuaHVtYW5vaWQuaXNBYmxlVG9CaXRlKCBuZWFyZXN0SHVtYW4gKSApe1xuICAgICAgICB0aGlzLmh1bWFub2lkLmJpdGUoIG5lYXJlc3RIdW1hbiApXG4gICAgICB9XG5cbiAgICAgIGlmKCB0aGlzLmlzVmFsaWREZXN0aW5hdGlvbiggZGVzdGluYXRpb24gKSApe1xuICAgICAgICB0aGlzLmh1bWFub2lkLnBvc2l0aW9uID0gZGVzdGluYXRpb25cbiAgICAgIH1cbiAgICB9O1xuICAgIHRoaXMuaW5jcmVtZW50U3RvcmUocGxheWVyKTtcbiAgfSxcblxuICBpbmNyZW1lbnRTdG9yZTogZnVuY3Rpb24ocGxheWVyKXtcbiAgICBpZiAocGxheWVyICYmIHBsYXllci5odW1hblR5cGUgPT09ICdwbGF5ZXInKXsgdGhpcy5zY29yZSArPSAxMCB9XG4gIH0sXG5cbiAgc2V0RGVzdGluYXRpb246IGZ1bmN0aW9uKCBuZWFyZXN0SHVtYW4sIG5lYXJlc3Rab21iaWUsIHBsYXllciApe1xuICAgIGlmKCB0aGlzLmh1bWFub2lkLmh1bWFuVHlwZSA9PSBcInpvbWJpZVwiICl7IHJldHVybiB0aGlzLnNldFpvbWJpZURlc3RpbmF0aW9uKCBuZWFyZXN0SHVtYW4sIG5lYXJlc3Rab21iaWUsIHBsYXllciApIH1cbiAgICBlbHNlIGlmKCB0aGlzLmh1bWFub2lkLmh1bWFuVHlwZSA9PSBcImh1bWFuXCIgKXsgcmV0dXJuIHRoaXMuc2V0SHVtYW5EZXN0aW5hdGlvbiggbmVhcmVzdEh1bWFuLCBuZWFyZXN0Wm9tYmllLCBwbGF5ZXIgKSB9XG4gICAgZWxzZSB7IHJldHVybiB0aGlzLmh1bWFub2lkLnBvc2l0aW9uIH1cbiAgfSxcblxuICBzZXRab21iaWVEZXN0aW5hdGlvbjogZnVuY3Rpb24oIG5lYXJlc3RIdW1hbiwgbmVhcmVzdFpvbWJpZSwgcGxheWVyICl7XG4gICAgdmFyIHBsYXllckRpc3RhbmNlID0gTnVtYmVyLlBPU0lUSVZFX0lORklOSVRZO1xuICAgIHZhciBodW1hbkRpc3RhbmNlID0gTnVtYmVyLlBPU0lUSVZFX0lORklOSVRZO1xuICAgIHZhciB6b21iaWVEaXN0YW5jZSA9IFBhdGhmaW5kZXIuZGlzdGFuY2VUbyggbmVhcmVzdFpvbWJpZS5wb3NpdGlvbiwgdGhpcy5odW1hbm9pZC5wb3NpdGlvbiApICogZ2FtZVNldHRpbmdzLnpvbWJpZVNwcmVhZFxuICAgIGlmIChwbGF5ZXIpeyBwbGF5ZXJEaXN0YW5jZSA9IFBhdGhmaW5kZXIuZGlzdGFuY2VUbyggcGxheWVyLnBvc2l0aW9uLCB0aGlzLmh1bWFub2lkLnBvc2l0aW9uICkgfVxuICAgIGlmIChuZWFyZXN0SHVtYW4peyBodW1hbkRpc3RhbmNlID0gUGF0aGZpbmRlci5kaXN0YW5jZVRvKCBuZWFyZXN0SHVtYW4ucG9zaXRpb24sIHRoaXMuaHVtYW5vaWQucG9zaXRpb24gKSB9XG5cbiAgICBpZiAoIHBsYXllckRpc3RhbmNlIDwgaHVtYW5EaXN0YW5jZSApe1xuICAgICAgaWYgKCBwbGF5ZXJEaXN0YW5jZSA8IHpvbWJpZURpc3RhbmNlICl7XG4gICAgICAgIHJldHVybiB0aGlzLmh1bWFub2lkLm1vdmVOZWFyZXN0KCBwbGF5ZXIgKVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuaHVtYW5vaWQubW92ZU5lYXJlc3QoIG5lYXJlc3Rab21iaWUgKVxuICAgICAgfVxuICAgIH0gZWxzZSBpZiAoIGh1bWFuRGlzdGFuY2UgPCB6b21iaWVEaXN0YW5jZSApe1xuICAgICAgcmV0dXJuIHRoaXMuaHVtYW5vaWQubW92ZU5lYXJlc3QoIG5lYXJlc3RIdW1hbiApXG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiB0aGlzLmh1bWFub2lkLm1vdmVOZWFyZXN0KCBuZWFyZXN0Wm9tYmllIClcbiAgICB9XG4gIH0sXG5cbiAgc2V0SHVtYW5EZXN0aW5hdGlvbjogZnVuY3Rpb24oIG5lYXJlc3RIdW1hbiwgbmVhcmVzdFpvbWJpZSwgcGxheWVyICl7XG4gICAgdmFyIHBsYXllckRpc3RhbmNlID0gTnVtYmVyLlBPU0lUSVZFX0lORklOSVRZO1xuICAgIHZhciBodW1hbkRpc3RhbmNlID0gTnVtYmVyLlBPU0lUSVZFX0lORklOSVRZO1xuICAgIHZhciB6b21iaWVEaXN0YW5jZSA9IFBhdGhmaW5kZXIuZGlzdGFuY2VUbyggbmVhcmVzdFpvbWJpZS5wb3NpdGlvbiwgdGhpcy5odW1hbm9pZC5wb3NpdGlvbiApXG4gICAgaWYgKHBsYXllcil7IHBsYXllckRpc3RhbmNlID0gUGF0aGZpbmRlci5kaXN0YW5jZVRvKCBwbGF5ZXIucG9zaXRpb24sIHRoaXMuaHVtYW5vaWQucG9zaXRpb24gKSB9XG4gICAgaWYgKG5lYXJlc3RIdW1hbil7IGh1bWFuRGlzdGFuY2UgPSBQYXRoZmluZGVyLmRpc3RhbmNlVG8oIG5lYXJlc3RIdW1hbi5wb3NpdGlvbiwgdGhpcy5odW1hbm9pZC5wb3NpdGlvbiApIH1cblxuICAgIGlmICggem9tYmllRGlzdGFuY2UgPCBnYW1lU2V0dGluZ3MuaHVtYW5GZWFyUmFuZ2UgfHwgKCAhcGxheWVyICYmICFuZWFyZXN0SHVtYW4gKSApe1xuICAgICAgcmV0dXJuIHRoaXMuaHVtYW5vaWQubW92ZU5lYXJlc3QoIG5lYXJlc3Rab21iaWUgKVxuICAgIH0gZWxzZSBpZiAoIHBsYXllckRpc3RhbmNlIDwgaHVtYW5EaXN0YW5jZSApe1xuICAgICAgcmV0dXJuIHRoaXMuaHVtYW5vaWQubW92ZU5lYXJlc3QoIHBsYXllciApXG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiB0aGlzLmh1bWFub2lkLm1vdmVOZWFyZXN0KCBuZWFyZXN0SHVtYW4gKVxuICAgIH1cbiAgfSxcblxuICBkZWxldGVTZWxmSHVtYW5vaWQ6IGZ1bmN0aW9uKCl7XG4gICAgdmFyIG90aGVySHVtYW5vaWRzID0gW11cbiAgICBmb3IoIHZhciBpPTA7IGkgPCB0aGlzLmh1bWFub2lkcy5sZW5ndGg7IGkrKyl7b3RoZXJIdW1hbm9pZHMucHVzaCh0aGlzLmh1bWFub2lkc1tpXSl9XG5cbiAgICBmb3IoIHZhciBpPTA7IGkgPCB0aGlzLmh1bWFub2lkcy5sZW5ndGg7IGkrKyApe1xuICAgICAgaWYoIHRoaXMuaXNQb3NpdGlvbkVxdWFsKCB0aGlzLmh1bWFub2lkc1tpXS5wb3NpdGlvbiAsIHRoaXMuaHVtYW5vaWQucG9zaXRpb24gKSApe1xuICAgICAgICBvdGhlckh1bWFub2lkcy5zcGxpY2UoIGksIDEgKVxuICAgICAgICBicmVha1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gb3RoZXJIdW1hbm9pZHNcbiAgfSxcbiAgZmluZFNpbWlsYXJIdW1hbm9pZHM6IGZ1bmN0aW9uKCBodW1hbm9pZFR5cGUgKXtcbiAgICB2YXIgb3RoZXJIdW1hbm9pZHMgPSB0aGlzLmRlbGV0ZVNlbGZIdW1hbm9pZCgpXG4gICAgdmFyIHNpbWlsYXIgPSBbXTtcbiAgICBmb3IoIHZhciBpPTA7IGk8IG90aGVySHVtYW5vaWRzLmxlbmd0aDsgaSsrICl7XG4gICAgICBpZiggb3RoZXJIdW1hbm9pZHNbaV0uaHVtYW5UeXBlID09PSBodW1hbm9pZFR5cGUgKXsgc2ltaWxhci5wdXNoKG90aGVySHVtYW5vaWRzW2ldKX1cbiAgICB9XG4gICAgcmV0dXJuIHNpbWlsYXJcbiAgfSxcbiAgZmluZENsb3Nlc3RQb3M6IGZ1bmN0aW9uKCBvdGhlckh1bWFub2lkcyApe1xuICAgIHZhciBjbG9zZXN0UG9zID0gW11cbiAgICBmb3IoIHZhciBpPTA7IGk8IG90aGVySHVtYW5vaWRzLmxlbmd0aDsgaSsrICl7XG4gICAgICB2YXIgZGlzdCA9IFBhdGhmaW5kZXIuZGlzdGFuY2VUbyggb3RoZXJIdW1hbm9pZHNbaV0ucG9zaXRpb24sIHRoaXMuaHVtYW5vaWQucG9zaXRpb24gKVxuICAgICAgY2xvc2VzdFBvcy5wdXNoKCBkaXN0ICk7XG4gICAgfVxuICAgIHJldHVybiBjbG9zZXN0UG9zXG4gIH0sXG4gIGZpbmRDbG9zZXN0SHVtYW5vaWQ6IGZ1bmN0aW9uKCBjbG9zZXN0UG9zLCBvdGhlckh1bWFub2lkcyApe1xuICAgIHZhciBjbG9zZXN0SHVtYW5vaWRWYWx1ZSA9IE1hdGgubWluLmFwcGx5KCBudWxsLCBjbG9zZXN0UG9zIClcbiAgICBmb3IoIHZhciBpPTA7IGkgPCBjbG9zZXN0UG9zLmxlbmd0aDsgaSsrICl7XG4gICAgICBpZiggY2xvc2VzdFBvc1tpXSA9PSBjbG9zZXN0SHVtYW5vaWRWYWx1ZSApeyB2YXIgY2xvc2VzdEh1bWFub2lkID0gb3RoZXJIdW1hbm9pZHNbaV19XG4gICAgfVxuICAgcmV0dXJuIGNsb3Nlc3RIdW1hbm9pZFxuICB9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gQm9hcmRcbiIsImxldCBCb2FyZCA9IHJlcXVpcmUoJ2JvYXJkJylcbmxldCBIdW1hbm9pZEJ1aWxkZXIgPSByZXF1aXJlKCdodW1hbm9pZEZhY3RvcnknKVxubGV0IGdhbWVTZXR0aW5ncyA9IHJlcXVpcmUoJ3NldHRpbmdzJylcblxuZnVuY3Rpb24gaW5pdGlhbGl6ZSgpe1xuICB2YXIgY2FudmFzID0gZG9jdW1lbnQuZ2V0RWxlbWVudHNCeVRhZ05hbWUoJ2NhbnZhcycpWzBdO1xuICB2YXIgd2lkdGggPSBjYW52YXMud2lkdGhcbiAgdmFyIGhlaWdodCA9IGNhbnZhcy5oZWlnaHRcbiAgdmFyIGN0eCA9IGNhbnZhcy5nZXRDb250ZXh0KCcyZCcpO1xuICB2YXIgYWxsSHVtYW5vaWRzID0gSHVtYW5vaWRCdWlsZGVyLnBvcHVsYXRlKGdhbWVTZXR0aW5ncy5odW1hbkNvdW50ICwgZ2FtZVNldHRpbmdzLnpvbWJpZUNvdW50KVxuICB2YXIgYm9hcmQgPSBuZXcgQm9hcmQoe2h1bWFub2lkczogYWxsSHVtYW5vaWRzLCB3aWR0aDogd2lkdGgsIGhlaWdodDogaGVpZ2h0fSlcblxuICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKFwia2V5dXBcIiwgZnVuY3Rpb24oZSl7XG4gICAgLy8gcyA9IDgzXG4gICAgLy8gdyA9IDg3XG4gICAgLy8gYSA9IDY1XG4gICAgLy8gZCA9IDY4XG4gICAgaWYgKGUud2hpY2ggPT09IDY4IHx8IGUud2hpY2ggPT09IDY1KXsgYm9hcmQuZHggPSAwOyB9XG4gICAgaWYgKGUud2hpY2ggPT09IDgzIHx8IGUud2hpY2ggPT09IDg3KXsgYm9hcmQuZHkgPSAwOyB9XG4gIH0pXG5cbiAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihcImtleWRvd25cIiwgZnVuY3Rpb24oZSl7XG4gICAgaWYgKGUud2hpY2ggPT09IDY1KXsgYm9hcmQuZHggPSAtMTsgfVxuICAgIGVsc2UgaWYgKGUud2hpY2ggPT09IDY4KXsgYm9hcmQuZHggPSAxOyB9XG4gICAgZWxzZSBpZiAoZS53aGljaCA9PT0gODcpeyBib2FyZC5keSA9IC0xOyB9XG4gICAgZWxzZSBpZiAoZS53aGljaCA9PT0gODMpeyBib2FyZC5keSA9IDE7IH1cbiAgfSlcblxuICBmdW5jdGlvbiBkcmF3SHVtYW5vaWRzKCl7XG4gICAgY3R4LmNsZWFyUmVjdCgwLDAsd2lkdGgsaGVpZ2h0KVxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgYm9hcmQuaHVtYW5vaWRzLmxlbmd0aDsgaSsrKXtcbiAgICAgIGN0eC5iZWdpblBhdGgoKTtcbiAgICAgIHZhciBwbGF5ZXIgPSBib2FyZC5odW1hbm9pZHNbaV1cbiAgICAgIHZhciB4ID0gcGxheWVyLnBvc2l0aW9uLngsIHkgPSBwbGF5ZXIucG9zaXRpb24ueVxuICAgICAgY3R4LmFyYyh4LHksNSwwLDIqTWF0aC5QSSk7XG5cbiAgICAgIGlmIChwbGF5ZXIuaHVtYW5UeXBlID09PSAnaHVtYW4nKSB7XG4gICAgICAgIHBsYXllci5jb2xvciA9ICcjMDBhYWFhJ1xuICAgICAgfSBlbHNlIGlmIChwbGF5ZXIuaHVtYW5UeXBlID09PSAnem9tYmllJykge1xuICAgICAgICBwbGF5ZXIuY29sb3IgPSAnI2ZmMDAwMCdcbiAgICAgIH0gZWxzZSBpZiAocGxheWVyLmh1bWFuVHlwZSA9PT0gJ3BsYXllcicpIHtcbiAgICAgICAgcGxheWVyLmNvbG9yID0gJyMwMGNjMDAnXG4gICAgICB9IGVsc2Uge1xuICAgICAgICBwbGF5ZXIuY29sb3IgPSAnIzc3MDAwMCdcbiAgICAgIH1cblxuICAgICAgY3R4LmZpbGxTdHlsZSA9IHBsYXllci5jb2xvcjtcbiAgICAgIGN0eC5maWxsKCk7XG4gICAgICBjdHguc3Ryb2tlKCk7XG4gICAgfVxuICB9XG5cbiAgZnVuY3Rpb24gY2FsbE5leHRUdXJuKGJvYXJkKXtcbiAgICB2YXIgZGVsYXksIG5leHRSZXF1ZXN0O1xuICAgIG5leHRSZXF1ZXN0ID0gZnVuY3Rpb24oKXtcbiAgICAgIGRyYXdIdW1hbm9pZHMoKTtcbiAgICAgIGlmIChib2FyZC5pc0dhbWVBY3RpdmUoKSl7XG4gICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdzY29yZScpLmlubmVySFRNTCA9IGJvYXJkLnNjb3JlXG4gICAgICAgIGJvYXJkLm5leHRUdXJuKClcbiAgICAgICAgZGVsYXkgPSAoIGJvYXJkLmlzUGxheWVyQWxpdmUoKSA/IGdhbWVTZXR0aW5ncy50dXJuRGVsYXkubm9ybWFsIDogZ2FtZVNldHRpbmdzLnR1cm5EZWxheS5mYXN0IClcbiAgICAgICAgc2V0VGltZW91dChuZXh0UmVxdWVzdCwgZGVsYXkpXG4gICAgICB9IGVsc2Uge1xuICAgICAgICBhbGVydCgnRVZFUllCT0RZIElTIERFQUQhISFcXG5Zb3VyIHNjb3JlIHdhczogJyArIGJvYXJkLnNjb3JlKVxuICAgICAgfVxuICAgIH1cbiAgICBzZXRUaW1lb3V0KG5leHRSZXF1ZXN0LCBnYW1lU2V0dGluZ3MudHVybkRlbGF5Lm5vcm1hbClcbiAgfVxuICBjYWxsTmV4dFR1cm4oYm9hcmQpXG59XG5cbm1vZHVsZS5leHBvcnRzID0gaW5pdGlhbGl6ZVxuIiwibGV0IEh1bWFub2lkLCBQYXRoZmluZGVyLCBnYW1lU2V0dGluZ3M7XG5cblBhdGhmaW5kZXIgPSByZXF1aXJlKCdwYXRoZmluZGVyJylcbmdhbWVTZXR0aW5ncyA9IHJlcXVpcmUoJ3NldHRpbmdzJylcblxuSHVtYW5vaWQgPSBmdW5jdGlvbihhdHRyaWJ1dGVzKXtcbiAgdGhpcy5wb3NpdGlvbiA9IGF0dHJpYnV0ZXMucG9zaXRpb24gfHwgeyd4JzogKDUrIE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSo1OTEpKSwneSc6ICg1KyBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkqMzkxKSl9O1xuICB0aGlzLnNwZWVkID0gYXR0cmlidXRlcy5zcGVlZDtcbiAgdGhpcy5odW1hblR5cGUgPSBhdHRyaWJ1dGVzLmh1bWFuVHlwZTtcbiAgdGhpcy50aW1lU2luY2VJbmZlY3Rpb24gPSAwO1xuICB0aGlzLmxhc3RQb3NpdGlvbiA9IHsneCc6IHRoaXMucG9zaXRpb24ueCwgJ3knOiB0aGlzLnBvc2l0aW9uLnl9O1xufVxuXG5IdW1hbm9pZC5wcm90b3R5cGUgPSB7XG4gIGlzQXR0cmFjdGVkVG86IGZ1bmN0aW9uKG5lYXJlc3RPYmplY3Qpe1xuICAgIHJldHVybiBuZWFyZXN0T2JqZWN0Lmh1bWFuVHlwZSA9PT0gJ2h1bWFuJyB8fCBuZWFyZXN0T2JqZWN0Lmh1bWFuVHlwZSA9PT0gJ3BsYXllcic7XG4gIH0sXG5cbiAgc3RvcmVMYXN0UG9zaXRpb246IGZ1bmN0aW9uKCl7XG4gICAgdGhpcy5sYXN0UG9zaXRpb24gPSB7J3gnOiB0aGlzLnBvc2l0aW9uLngsICd5JzogdGhpcy5wb3NpdGlvbi55fTtcbiAgfSxcblxuICBpc0xhc3RNb3ZlUmVwZWF0ZWQ6IGZ1bmN0aW9uKHBvdGVudGlhbE1vdmUpe1xuICAgIHJldHVybiAoKE1hdGguYWJzKHBvdGVudGlhbE1vdmUueCAtIHRoaXMubGFzdFBvc2l0aW9uLngpIDwgZ2FtZVNldHRpbmdzLnJlcGl0aW9uVG9sZXJhbmNlKSAmJiAoTWF0aC5hYnMocG90ZW50aWFsTW92ZS55IC0gdGhpcy5sYXN0UG9zaXRpb24ueSkgPCBnYW1lU2V0dGluZ3MucmVwaXRpb25Ub2xlcmFuY2UpKTtcbiAgfSxcblxuICBnZXRCaXR0ZW46IGZ1bmN0aW9uKCl7XG4gICAgdGhpcy5odW1hblR5cGUgPSAnaW5mZWN0ZWRIdW1hbidcbiAgICB0aGlzLnNwZWVkID0gMFxuICB9LFxuXG4gIGJpdGU6IGZ1bmN0aW9uKGh1bWFuKXtcbiAgICBpZiAoIGh1bWFuICkgaHVtYW4uZ2V0Qml0dGVuKCk7XG4gIH0sXG5cbiAgdHVyblRvWm9tYmllOiBmdW5jdGlvbigpe1xuICAgIHRoaXMuaHVtYW5UeXBlID0gJ3pvbWJpZSdcbiAgICB0aGlzLnNwZWVkID0gZ2FtZVNldHRpbmdzLnpvbWJpZVNwZWVkXG4gIH0sXG5cbiAgaXNBYmxlVG9CaXRlOiBmdW5jdGlvbihodW1hbil7XG4gICAgaWYgKCBodW1hbiApIHtcbiAgICAgIHJldHVybiB0aGlzLmh1bWFuVHlwZSA9PT0gJ3pvbWJpZScgJiYgKFBhdGhmaW5kZXIuZGlzdGFuY2VUbyggaHVtYW4ucG9zaXRpb24sIHRoaXMucG9zaXRpb24gKSA8IDEwKTtcbiAgICB9XG4gIH0sXG5cbiAgaW5jcmVtZW50VGltZVNpbmNlSW5mZWN0aW9uOiBmdW5jdGlvbigpe1xuICAgIHRoaXMudGltZVNpbmNlSW5mZWN0aW9uICsrO1xuICAgIGlmICh0aGlzLnRpbWVTaW5jZUluZmVjdGlvbiA9PT0gNSl7XG4gICAgICB0aGlzLnR1cm5Ub1pvbWJpZSgpO1xuICAgIH1cbiAgfSxcblxuICBtb3ZlTmVhcmVzdDogZnVuY3Rpb24obmVhcmVzdE9iamVjdCl7XG4gICAgdmFyIHBvdGVudGlhbE1vdmU7XG4gICAgaWYgKHRoaXMuaXNBdHRyYWN0ZWRUbyhuZWFyZXN0T2JqZWN0KSl7XG4gICAgICBwb3RlbnRpYWxNb3ZlID0gUGF0aGZpbmRlci5tb3ZlVG93YXJkcyh0aGlzLnBvc2l0aW9uLCBuZWFyZXN0T2JqZWN0LnBvc2l0aW9uLCB0aGlzLnNwZWVkKVxuICAgIH0gZWxzZSB7XG4gICAgICBwb3RlbnRpYWxNb3ZlID0gUGF0aGZpbmRlci5tb3ZlQXdheUZyb20odGhpcy5wb3NpdGlvbiwgbmVhcmVzdE9iamVjdC5wb3NpdGlvbiwgdGhpcy5zcGVlZClcbiAgICB9XG4gICAgaWYgKHRoaXMubGFzdFBvc2l0aW9uLnggPT09IHRoaXMucG9zaXRpb24ueCAmJiB0aGlzLmxhc3RQb3NpdGlvbi55ID09PSB0aGlzLnBvc2l0aW9uLnkpe1xuICAgICAgdGhpcy5zdG9yZUxhc3RQb3NpdGlvbigpO1xuICAgICAgcmV0dXJuIFBhdGhmaW5kZXIubW92ZVJhbmRvbWx5KHRoaXMucG9zaXRpb24sIHRoaXMuc3BlZWQpO1xuICAgIH0gZWxzZSBpZiAodGhpcy5pc0xhc3RNb3ZlUmVwZWF0ZWQocG90ZW50aWFsTW92ZSkpe1xuICAgICAgdGhpcy5zdG9yZUxhc3RQb3NpdGlvbigpO1xuICAgICAgcmV0dXJuIFBhdGhmaW5kZXIubW92ZVBlcnBlbmRpY3VsYXJUbyh0aGlzLnBvc2l0aW9uLCBuZWFyZXN0T2JqZWN0LnBvc2l0aW9uLCB0aGlzLnNwZWVkKVxuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLnN0b3JlTGFzdFBvc2l0aW9uKCk7XG4gICAgICByZXR1cm4gcG90ZW50aWFsTW92ZVxuICAgIH1cbiAgfSxcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBIdW1hbm9pZFxuIiwibGV0IEh1bW5hbm9pZEJ1aWxkZXIsIEh1bWFub2lkLCBnYW1lU2V0dGluZ3M7XG5nYW1lU2V0dGluZ3MgPSByZXF1aXJlKCdzZXR0aW5ncycpXG5IdW1hbm9pZCA9IHJlcXVpcmUoJ2h1bWFub2lkJylcblxubGV0IEh1bWFub2lkQnVpbGRlciA9IHtcbiAgcG9wdWxhdGU6IGZ1bmN0aW9uKG51bWJlck9mSHVtYW5zLCBudW1iZXJPZlpvbWJpZXMpe1xuICAgIHJldHVybiBIdW1hbm9pZEJ1aWxkZXIuY3JlYXRpb24obnVtYmVyT2ZIdW1hbnMsICdodW1hbicsIGdhbWVTZXR0aW5ncy5odW1hblNwZWVkKS5jb25jYXQoSHVtYW5vaWRCdWlsZGVyLmNyZWF0aW9uKG51bWJlck9mWm9tYmllcywgJ3pvbWJpZScsIGdhbWVTZXR0aW5ncy56b21iaWVTcGVlZCApKS5jb25jYXQoSHVtYW5vaWRCdWlsZGVyLmNyZWF0aW9uKDEsICdwbGF5ZXInLCBnYW1lU2V0dGluZ3MucGxheWVyU3BlZWQpKVxuICB9LFxuXG4gIGNyZWF0aW9uOiBmdW5jdGlvbihudW1iZXIsIHR5cGUsIHNwZWVkKXtcbiAgICB2YXIgcG9wdWxhdGlvbiA9IFtdXG4gICAgZm9yKHZhciBpID0gMDsgaSA8IG51bWJlcjsgaSsrKXtcbiAgICAgIHZhciBuZXdIdW1hbm9pZCA9IG5ldyBIdW1hbm9pZCh7J2h1bWFuVHlwZSc6IHR5cGUsICdzcGVlZCc6IHNwZWVkfSlcbiAgICAgIHBvcHVsYXRpb24ucHVzaChuZXdIdW1hbm9pZClcbiAgICB9XG4gICAgcmV0dXJuIHBvcHVsYXRpb25cbiAgfVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IEh1bWFub2lkQnVpbGRlclxuIiwibGV0IGluaXQgPSByZXF1aXJlKCdnYW1lJylcbmluaXQoKVxuIiwibGV0IFBhdGhmaW5kZXIgPSB7XG4gIG1vdmVUb3dhcmRzOiBmdW5jdGlvbihjdXJyZW50UG9zaXRpb24sIGZyaWVuZGx5TG9jYXRpb24sIHNwZWVkKXtcbiAgICB2YXIgZGVsdGFZID0gZnJpZW5kbHlMb2NhdGlvbi55IC0gY3VycmVudFBvc2l0aW9uLnk7XG4gICAgdmFyIGRlbHRhWCA9IGZyaWVuZGx5TG9jYXRpb24ueCAtIGN1cnJlbnRQb3NpdGlvbi54O1xuICAgIHZhciBsZW5ndGggPSBQYXRoZmluZGVyLmRpc3RhbmNlVG8oZnJpZW5kbHlMb2NhdGlvbiwgY3VycmVudFBvc2l0aW9uKTtcbiAgICBpZiAoc3BlZWQgIT09IDAgJiYgbGVuZ3RoIDwgc3BlZWQpe1xuICAgICAgcmV0dXJuIGZyaWVuZGx5TG9jYXRpb25cbiAgICB9IGVsc2Uge1xuICAgIHJldHVybiB7J3gnOiAoY3VycmVudFBvc2l0aW9uLnggKyAoZGVsdGFYIC8gbGVuZ3RoICogc3BlZWQpKSwneSc6IChjdXJyZW50UG9zaXRpb24ueSArIChkZWx0YVkgLyBsZW5ndGggKiBzcGVlZCkpfVxuICAgIH1cbiAgfSxcblxuICBtb3ZlUGVycGVuZGljdWxhclRvOiBmdW5jdGlvbihjdXJyZW50UG9zaXRpb24sIGZyaWVuZGx5TG9jYXRpb24sIHNwZWVkKXtcbiAgICB2YXIgZGVsdGFZID0gZnJpZW5kbHlMb2NhdGlvbi55IC0gY3VycmVudFBvc2l0aW9uLnk7XG4gICAgdmFyIGRlbHRhWCA9IGZyaWVuZGx5TG9jYXRpb24ueCAtIGN1cnJlbnRQb3NpdGlvbi54O1xuICAgIHZhciBsZW5ndGggPSBQYXRoZmluZGVyLmRpc3RhbmNlVG8oZnJpZW5kbHlMb2NhdGlvbiwgY3VycmVudFBvc2l0aW9uKTtcbiAgICBpZiAoc3BlZWQgIT09IDAgJiYgbGVuZ3RoIDwgc3BlZWQpe1xuICAgICAgcmV0dXJuIGZyaWVuZGx5TG9jYXRpb25cbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIHsneCc6IChjdXJyZW50UG9zaXRpb24ueCArIChkZWx0YVggLyBsZW5ndGggKiBzcGVlZCkpLCd5JzogKGN1cnJlbnRQb3NpdGlvbi55IC0gKGRlbHRhWSAvIGxlbmd0aCAqIHNwZWVkKSl9XG4gICAgfVxuICB9LFxuXG4gIG1vdmVBd2F5RnJvbTogZnVuY3Rpb24oY3VycmVudFBvc2l0aW9uLCBob3N0aWxlTG9jYXRpb24sIHNwZWVkKXtcbiAgICByZXR1cm4gUGF0aGZpbmRlci5tb3ZlVG93YXJkcyhjdXJyZW50UG9zaXRpb24sIGhvc3RpbGVMb2NhdGlvbiwgLXNwZWVkKTtcbiAgfSxcblxuICBkaXN0YW5jZVRvOiBmdW5jdGlvbih0YXJnZXRMb2NhdGlvbiwgY3VycmVudFBvc2l0aW9uKXtcbiAgICB2YXIgZGVsdGFZID0gdGFyZ2V0TG9jYXRpb24ueSAtIGN1cnJlbnRQb3NpdGlvbi55O1xuICAgIHZhciBkZWx0YVggPSB0YXJnZXRMb2NhdGlvbi54IC0gY3VycmVudFBvc2l0aW9uLng7XG4gICAgcmV0dXJuIE1hdGguc3FydChNYXRoLnBvdyhkZWx0YVksMikgKyBNYXRoLnBvdyhkZWx0YVgsMikpXG4gIH0sXG5cbiAgbW92ZVJhbmRvbWx5OiBmdW5jdGlvbihjdXJyZW50UG9zaXRpb24sIHNwZWVkKXtcbiAgICBsZXQgYW5nbGU7XG4gICAgYW5nbGUgPSBNYXRoLnJhbmRvbSgpICogMiAqIE1hdGguUEk7XG4gICAgICByZXR1cm4geyd4JzogKGN1cnJlbnRQb3NpdGlvbi54ICsgTWF0aC5jb3MoYW5nbGUpICogc3BlZWQpLCd5JzogKGN1cnJlbnRQb3NpdGlvbi55ICsgTWF0aC5zaW4oYW5nbGUpICogc3BlZWQpfVxuICB9LFxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IFBhdGhmaW5kZXJcbiIsInZhciBnYW1lU2V0dGluZ3MgPSB7XG4gIGh1bWFuU3BlZWQ6IDcsXG4gIHBsYXllclNwZWVkOiA2LFxuICB6b21iaWVTcGVlZDogNCxcbiAgaHVtYW5Db3VudDogMzAsXG4gIHpvbWJpZUNvdW50OiAzLFxuICB0dXJuRGVsYXk6IHsgbm9ybWFsOiAxMDAsIGZhc3Q6IDI1IH0sXG4gIC8vc2V0cyB0aGUgdGltZW91dCBiZXR3ZWVuIHR1cm5zXG4gIHJlcGl0aW9uVG9sZXJhbmNlOiAxLFxuICAvL3RoZSByYW5nZSBpbiB3aGljaCBhIG1vdmUgaXMgY29uc2lkZXJlZCByZXBldGl0aXZlXG4gIC8vbG93ZXIgdmFsdWVzIHdpbGwgcmVkdWNlIHRoZSBzaXplIG9mIHRoZSByYW5nZS5cbiAgem9tYmllU3ByZWFkOiAzLFxuICAvL2xvd2VyIHpvbWJpZVNwcmVhZCB2YWx1ZXMgd2lsbCBjYXVzZSB6b21iaWVzIHRvIHNwcmVhZCBvdXQgbW9yZVxuICBodW1hbkZlYXJSYW5nZTogMjBcbiAgLy90aGUgcmFuZ2UgYXQgd2hpY2ggaHVtYW5zIHN0YXJ0IHJ1bm5pbmcgZnJvbSB6b21iaWVzLlxufTtcblxubW9kdWxlLmV4cG9ydHMgPSBnYW1lU2V0dGluZ3NcbiJdfQ==
