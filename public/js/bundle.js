(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({"/Users/philipavargas/Desktop/js_game_of_afterlife/public/js/game/board.js":[function(require,module,exports){
'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var Pathfinder = undefined,
    gameSettings = undefined;

Pathfinder = require('pathfinder');
gameSettings = require('settings');

var Board = (function () {
  function Board(attributes) {
    _classCallCheck(this, Board);

    this.humanoid = null;
    this.score = 0;
    this.dx = 0;
    this.dy = 0;
    this.humanoids = attributes.humanoids || [];
    this.width = attributes.width || '600px';
    this.height = attributes.height || '400px';
  }

  _createClass(Board, [{
    key: 'isGameActive',
    value: function isGameActive() {
      return this.humanoids.some(function (humanoid) {
        return humanoid.humanType === 'human' || humanoid.humanType === 'player';
      });
    }
  }, {
    key: 'isPlayerAlive',
    value: function isPlayerAlive() {
      return this.humanoids.some(function (humanoid) {
        return humanoid.humanType === 'player';
      });
    }
  }, {
    key: 'isPositionEqual',
    value: function isPositionEqual(position1, position2) {
      return position1.x === position2.x && position1.y === position2.y;
    }
  }, {
    key: 'isValidDestination',
    value: function isValidDestination(targetPosition) {
      var _this = this;

      return !this.humanoids.some(function (humanoid) {
        return _this.isPositionEqual(humanoid.position, targetPosition);
      });
    }
  }, {
    key: 'nearestHumanoid',
    value: function nearestHumanoid(humanoidType) {
      var similarHumanoids = undefined,
          closestPos = undefined,
          closestHumanoid = undefined;
      similarHumanoids = this.findSimilarHumanoids(humanoidType);
      closestPos = this.findClosestPos(similarHumanoids);
      closestHumanoid = this.findClosestHumanoid(closestPos, similarHumanoids);
      return closestHumanoid;
    }
  }, {
    key: 'nextTurn',
    value: function nextTurn() {
      var player = undefined;
      for (var i = 0; i < this.humanoids.length; i++) {
        this.humanoid = this.humanoids[i];
        if (this.humanoid.humanType === 'infectedHuman') {
          this.humanoid.incrementTimeSinceInfection();
          continue;
        }
        if (this.humanoid.humanType === 'player') {
          var targetLoc = undefined,
              coords = undefined;
          targetLoc = {
            x: this.humanoid.position.x + this.dx * this.humanoid.speed,
            y: this.humanoid.position.y + this.dy * this.humanoid.speed
          };
          coords = Pathfinder.moveTowards(this.humanoid.position, targetLoc, this.humanoid.speed);
          coords.x = (coords.x + this.width) % this.width;
          coords.y = (coords.y + this.height) % this.height;
          this.humanoid.position = coords;
          continue;
        }
        var nearestHuman = undefined,
            nearestZombie = undefined,
            destination = undefined;
        nearestZombie = this.nearestHumanoid('zombie');
        nearestHuman = this.nearestHumanoid('human');
        player = this.nearestHumanoid('player');
        destination = this.setDestination(nearestHuman, nearestZombie, player);
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
      }
      this.incrementScore(player);
    }
  }, {
    key: 'incrementScore',
    value: function incrementScore(player) {
      if (player && player.humanType === 'player') {
        this.score += 10;
      }
    }
  }, {
    key: 'setDestination',
    value: function setDestination(nearestHuman, nearestZombie, player) {
      if (this.humanoid.humanType === 'zombie') {
        return this.setZombieDestination(nearestHuman, nearestZombie, player);
      } else if (this.humanoid.humanType === 'human') {
        return this.setHumanDestination(nearestHuman, nearestZombie, player);
      } else {
        return this.humanoid.position;
      }
    }
  }, {
    key: 'setZombieDestination',
    value: function setZombieDestination(nearestHuman, nearestZombie, player) {
      var playerDistance = undefined,
          humanDistance = undefined,
          zombieDistance = undefined;
      playerDistance = Number.POSITIVE_INFINITY;
      humanDistance = Number.POSITIVE_INFINITY;
      zombieDistance = Pathfinder.distanceTo(nearestZombie.position, this.humanoid.position) * gameSettings.zombieSpread;
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
    }
  }, {
    key: 'setHumanDestination',
    value: function setHumanDestination(nearestHuman, nearestZombie, player) {
      var playerDistance = undefined,
          humanDistance = undefined,
          zombieDistance = undefined;
      playerDistance = Number.POSITIVE_INFINITY;
      humanDistance = Number.POSITIVE_INFINITY;
      zombieDistance = Pathfinder.distanceTo(nearestZombie.position, this.humanoid.position);
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
    }
  }, {
    key: 'otherHumanoids',
    value: function otherHumanoids() {
      var _this2 = this;

      return this.humanoids.filter(function (currentHumanoid) {
        return _this2.humanoid.id !== currentHumanoid.id;
      });
    }
  }, {
    key: 'findSimilarHumanoids',
    value: function findSimilarHumanoids(humanoidType) {
      return this.otherHumanoids().filter(function (humanoid) {
        return humanoid.humanType === humanoidType;
      });
    }
  }, {
    key: 'findClosestPos',
    value: function findClosestPos(otherHumanoids) {
      var closestPos = undefined,
          dist = undefined;
      closestPos = [];
      for (var i = 0; i < otherHumanoids.length; i++) {
        dist = Pathfinder.distanceTo(otherHumanoids[i].position, this.humanoid.position);
        closestPos.push(dist);
      }
      return closestPos;
    }
  }, {
    key: 'findClosestHumanoid',
    value: function findClosestHumanoid(closestPos, otherHumanoids) {
      var closestHumanoidValue = undefined,
          closestHumanoid = undefined;
      closestHumanoidValue = Math.min.apply(null, closestPos);
      for (var i = 0; i < closestPos.length; i++) {
        if (closestPos[i] === closestHumanoidValue) {
          closestHumanoid = otherHumanoids[i];
        }
      }
      return closestHumanoid;
    }
  }]);

  return Board;
})();

module.exports = Board;

},{"pathfinder":"/Users/philipavargas/Desktop/js_game_of_afterlife/public/js/game/pathfinder.js","settings":"/Users/philipavargas/Desktop/js_game_of_afterlife/public/js/game/settings.js"}],"/Users/philipavargas/Desktop/js_game_of_afterlife/public/js/game/game.js":[function(require,module,exports){
'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var Board = undefined,
    HumanoidBuilder = undefined,
    gameSettings = undefined;
Board = require('board');
HumanoidBuilder = require('humanoidFactory');
gameSettings = require('settings');

var GameOfAfterlife = (function () {
  function GameOfAfterlife() {
    _classCallCheck(this, GameOfAfterlife);

    var canvas = undefined,
        allHumanoids = undefined;
    canvas = document.getElementsByTagName('canvas')[0];
    allHumanoids = HumanoidBuilder.populate(gameSettings.humanCount, gameSettings.zombieCount);
    this.width = canvas.width;
    this.height = canvas.height;
    this.ctx = canvas.getContext('2d');
    this.board = new Board({ humanoids: allHumanoids, width: this.width, height: this.height });
    this.humanoidColorMap = {
      human: '#00aaaa',
      zombie: '#ff0000',
      player: '#00cc00',
      infectedHuman: '#770000'
    };
  }

  _createClass(GameOfAfterlife, [{
    key: 'bindPlayerMovement',
    value: function bindPlayerMovement() {
      var _this = this;

      document.addEventListener('keyup', function (e) {
        // s = 83
        // w = 87
        // a = 65
        // d = 68
        if (e.which === 68 || e.which === 65) {
          _this.board.dx = 0;
        }
        if (e.which === 83 || e.which === 87) {
          _this.board.dy = 0;
        }
      });

      document.addEventListener('keydown', function (e) {
        if (e.which === 65) {
          _this.board.dx = -1;
        } else if (e.which === 68) {
          _this.board.dx = 1;
        } else if (e.which === 87) {
          _this.board.dy = -1;
        } else if (e.which === 83) {
          _this.board.dy = 1;
        }
      });
    }
  }, {
    key: 'drawHumanoids',
    value: function drawHumanoids() {
      var player = undefined,
          x = undefined,
          y = undefined;
      this.ctx.clearRect(0, 0, this.width, this.height);
      for (var i = 0; i < this.board.humanoids.length; i++) {
        this.ctx.beginPath();
        player = this.board.humanoids[i];
        x = player.position.x;
        y = player.position.y;
        this.ctx.arc(x, y, 5, 0, 2 * Math.PI);
        this.ctx.fillStyle = this.humanoidColorMap[player.humanType];
        this.ctx.fill();
        this.ctx.stroke();
      }
    }
  }, {
    key: 'callNextTurn',
    value: function callNextTurn() {
      var _this2 = this;

      var delay = undefined,
          nextRequest = undefined;
      nextRequest = function () {
        _this2.drawHumanoids();
        if (_this2.board.isGameActive()) {
          document.getElementById('score').innerHTML = _this2.board.score;
          _this2.board.nextTurn();
          delay = _this2.board.isPlayerAlive() ? gameSettings.turnDelay.normal : gameSettings.turnDelay.fast;
          setTimeout(nextRequest, delay);
        } else {
          alert('EVERYBODY IS DEAD!!!\nYour score was: ' + _this2.board.score);
        }
      };
      setTimeout(nextRequest, gameSettings.turnDelay.normal);
    }
  }, {
    key: 'init',
    value: function init() {
      this.bindPlayerMovement();
      this.callNextTurn();
    }
  }]);

  return GameOfAfterlife;
})();

module.exports = GameOfAfterlife;

},{"board":"/Users/philipavargas/Desktop/js_game_of_afterlife/public/js/game/board.js","humanoidFactory":"/Users/philipavargas/Desktop/js_game_of_afterlife/public/js/game/humanoidFactory.js","settings":"/Users/philipavargas/Desktop/js_game_of_afterlife/public/js/game/settings.js"}],"/Users/philipavargas/Desktop/js_game_of_afterlife/public/js/game/humanoid.js":[function(require,module,exports){
'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var Pathfinder = undefined,
    gameSettings = undefined;

Pathfinder = require('pathfinder');
gameSettings = require('settings');

var Humanoid = (function () {
  function Humanoid(attributes) {
    _classCallCheck(this, Humanoid);

    this.id = attributes.id;
    this.position = attributes.position || { x: 5 + Math.floor(Math.random() * 591), y: 5 + Math.floor(Math.random() * 391) };
    this.speed = attributes.speed;
    this.humanType = attributes.humanType;
    this.timeSinceInfection = 0;
    this.lastPosition = { x: this.position.x, y: this.position.y };
  }

  _createClass(Humanoid, [{
    key: 'isAttractedTo',
    value: function isAttractedTo(nearestObject) {
      return nearestObject.humanType === 'human' || nearestObject.humanType === 'player';
    }
  }, {
    key: 'storeLastPosition',
    value: function storeLastPosition() {
      this.lastPosition = { x: this.position.x, y: this.position.y };
    }
  }, {
    key: 'isLastMoveRepeated',
    value: function isLastMoveRepeated(potentialMove) {
      return Math.abs(potentialMove.x - this.lastPosition.x) < gameSettings.repitionTolerance && Math.abs(potentialMove.y - this.lastPosition.y) < gameSettings.repitionTolerance;
    }
  }, {
    key: 'getBitten',
    value: function getBitten() {
      this.humanType = 'infectedHuman';
      this.speed = 0;
    }
  }, {
    key: 'bite',
    value: function bite(human) {
      if (human) {
        human.getBitten();
      }
    }
  }, {
    key: 'turnToZombie',
    value: function turnToZombie() {
      this.humanType = 'zombie';
      this.speed = gameSettings.zombieSpeed;
    }
  }, {
    key: 'isAbleToBite',
    value: function isAbleToBite(human) {
      if (human) {
        return this.humanType === 'zombie' && Pathfinder.distanceTo(human.position, this.position) < 10;
      }
    }
  }, {
    key: 'incrementTimeSinceInfection',
    value: function incrementTimeSinceInfection() {
      this.timeSinceInfection++;
      if (this.timeSinceInfection === 5) {
        this.turnToZombie();
      }
    }
  }, {
    key: 'moveNearest',
    value: function moveNearest(nearestObject) {
      var potentialMove = undefined;
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
  }]);

  return Humanoid;
})();

module.exports = Humanoid;

},{"pathfinder":"/Users/philipavargas/Desktop/js_game_of_afterlife/public/js/game/pathfinder.js","settings":"/Users/philipavargas/Desktop/js_game_of_afterlife/public/js/game/settings.js"}],"/Users/philipavargas/Desktop/js_game_of_afterlife/public/js/game/humanoidFactory.js":[function(require,module,exports){
'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var Humanoid = undefined,
    gameSettings = undefined;
gameSettings = require('settings');
Humanoid = require('humanoid');

var HumanoidBuilder = (function () {
  function HumanoidBuilder() {
    _classCallCheck(this, HumanoidBuilder);
  }

  _createClass(HumanoidBuilder, null, [{
    key: 'populate',
    value: function populate(numberOfHumans, numberOfZombies) {
      return this.creation(numberOfHumans, 'human', gameSettings.humanSpeed).concat(HumanoidBuilder.creation(numberOfZombies, 'zombie', gameSettings.zombieSpeed)).concat(HumanoidBuilder.creation(1, 'player', gameSettings.playerSpeed));
    }
  }, {
    key: 'creation',
    value: function creation(number, type, speed) {
      var population = undefined,
          newHumanoid = undefined;
      population = [];
      for (var i = 0; i < number; i++) {
        newHumanoid = new Humanoid({ humanType: type, speed: speed, id: i });
        population.push(newHumanoid);
      }
      return population;
    }
  }]);

  return HumanoidBuilder;
})();

module.exports = HumanoidBuilder;

},{"humanoid":"/Users/philipavargas/Desktop/js_game_of_afterlife/public/js/game/humanoid.js","settings":"/Users/philipavargas/Desktop/js_game_of_afterlife/public/js/game/settings.js"}],"/Users/philipavargas/Desktop/js_game_of_afterlife/public/js/game/initialize.js":[function(require,module,exports){
'use strict';

var GameOfAfterlife = undefined,
    gameOfAfterlife = undefined;
GameOfAfterlife = require('game');
gameOfAfterlife = new GameOfAfterlife();
gameOfAfterlife.init();

},{"game":"/Users/philipavargas/Desktop/js_game_of_afterlife/public/js/game/game.js"}],"/Users/philipavargas/Desktop/js_game_of_afterlife/public/js/game/pathfinder.js":[function(require,module,exports){
"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Pathfinder = (function () {
  function Pathfinder() {
    _classCallCheck(this, Pathfinder);
  }

  _createClass(Pathfinder, null, [{
    key: "moveTowards",
    value: function moveTowards(currentPosition, friendlyLocation, speed) {
      var deltaY = undefined,
          deltaX = undefined,
          length = undefined;
      deltaY = friendlyLocation.y - currentPosition.y;
      deltaX = friendlyLocation.x - currentPosition.x;
      length = this.distanceTo(friendlyLocation, currentPosition);
      if (speed !== 0 && length < speed) {
        return friendlyLocation;
      } else {
        return {
          x: currentPosition.x + deltaX / length * speed,
          y: currentPosition.y + deltaY / length * speed
        };
      }
    }
  }, {
    key: "moveAwayFrom",
    value: function moveAwayFrom(currentPosition, hostileLocation, speed) {
      return this.moveTowards(currentPosition, hostileLocation, -speed);
    }
  }, {
    key: "movePerpendicularTo",
    value: function movePerpendicularTo(currentPosition, friendlyLocation, speed) {
      var deltaY = undefined,
          deltaX = undefined,
          length = undefined;
      deltaY = friendlyLocation.y - currentPosition.y;
      deltaX = friendlyLocation.x - currentPosition.x;
      length = this.distanceTo(friendlyLocation, currentPosition);
      if (speed !== 0 && length < speed) {
        return friendlyLocation;
      } else {
        return {
          x: currentPosition.x + deltaX / length * speed,
          y: currentPosition.y - deltaY / length * speed
        };
      }
    }
  }, {
    key: "distanceTo",
    value: function distanceTo(targetLocation, currentPosition) {
      var deltaY = undefined,
          deltaX = undefined;
      deltaY = targetLocation.y - currentPosition.y;
      deltaX = targetLocation.x - currentPosition.x;
      return Math.sqrt(Math.pow(deltaY, 2) + Math.pow(deltaX, 2));
    }
  }, {
    key: "moveRandomly",
    value: function moveRandomly(currentPosition, speed) {
      var angle = undefined;
      angle = Math.random() * 2 * Math.PI;
      return {
        x: currentPosition.x + Math.cos(angle) * speed,
        y: currentPosition.y + Math.sin(angle) * speed
      };
    }
  }]);

  return Pathfinder;
})();

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
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL25vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIvVXNlcnMvcGhpbGlwYXZhcmdhcy9EZXNrdG9wL2pzX2dhbWVfb2ZfYWZ0ZXJsaWZlL3B1YmxpYy9qcy9nYW1lL2JvYXJkLmpzIiwiL1VzZXJzL3BoaWxpcGF2YXJnYXMvRGVza3RvcC9qc19nYW1lX29mX2FmdGVybGlmZS9wdWJsaWMvanMvZ2FtZS9nYW1lLmpzIiwiL1VzZXJzL3BoaWxpcGF2YXJnYXMvRGVza3RvcC9qc19nYW1lX29mX2FmdGVybGlmZS9wdWJsaWMvanMvZ2FtZS9odW1hbm9pZC5qcyIsIi9Vc2Vycy9waGlsaXBhdmFyZ2FzL0Rlc2t0b3AvanNfZ2FtZV9vZl9hZnRlcmxpZmUvcHVibGljL2pzL2dhbWUvaHVtYW5vaWRGYWN0b3J5LmpzIiwiL1VzZXJzL3BoaWxpcGF2YXJnYXMvRGVza3RvcC9qc19nYW1lX29mX2FmdGVybGlmZS9wdWJsaWMvanMvZ2FtZS9pbml0aWFsaXplLmpzIiwiL1VzZXJzL3BoaWxpcGF2YXJnYXMvRGVza3RvcC9qc19nYW1lX29mX2FmdGVybGlmZS9wdWJsaWMvanMvZ2FtZS9wYXRoZmluZGVyLmpzIiwiL1VzZXJzL3BoaWxpcGF2YXJnYXMvRGVza3RvcC9qc19nYW1lX29mX2FmdGVybGlmZS9wdWJsaWMvanMvZ2FtZS9zZXR0aW5ncy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7OztBQ0FBLElBQUksVUFBVSxZQUFBO0lBQUUsWUFBWSxZQUFBLENBQUM7O0FBRTdCLFVBQVUsR0FBRyxPQUFPLENBQUMsWUFBWSxDQUFDLENBQUM7QUFDbkMsWUFBWSxHQUFHLE9BQU8sQ0FBQyxVQUFVLENBQUMsQ0FBQzs7SUFFN0IsS0FBSztBQUNFLFdBRFAsS0FBSyxDQUNJLFVBQVUsRUFBRTswQkFEckIsS0FBSzs7QUFFUCxRQUFJLENBQUMsUUFBUSxHQUFHLElBQUksQ0FBQztB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SUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLE1BQU0sRUFBQyxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLE1BQU0sRUFBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0tBQzNEOzs7V0FFa0Isc0JBQUMsZUFBZSxFQUFFLEtBQUssRUFBQztBQUN6QyxVQUFJLEtBQUssWUFBQSxDQUFDO0FBQ1YsV0FBSyxHQUFHLElBQUksQ0FBQyxNQUFNLEVBQUUsR0FBRyxDQUFDLEdBQUcsSUFBSSxDQUFDLEVBQUUsQ0FBQztBQUNwQyxhQUFPO0FBQ0wsU0FBQyxFQUFHLGVBQWUsQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsR0FBRyxLQUFLLEFBQUM7QUFDaEQsU0FBQyxFQUFHLGVBQWUsQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsR0FBRyxLQUFLLEFBQUM7T0FDakQsQ0FBQztLQUNIOzs7U0FqREcsVUFBVTs7O0FBb0RoQixNQUFNLENBQUMsT0FBTyxHQUFHLFVBQVUsQ0FBQzs7Ozs7QUNwRDVCLElBQUksWUFBWSxHQUFHO0FBQ2pCLFlBQVUsRUFBRSxDQUFDO0FBQ2IsYUFBVyxFQUFFLENBQUM7QUFDZCxhQUFXLEVBQUUsQ0FBQztBQUNkLFlBQVUsRUFBRSxFQUFFO0FBQ2QsYUFBVyxFQUFFLENBQUM7QUFDZCxXQUFTLEVBQUUsRUFBRSxNQUFNLEVBQUUsR0FBRyxFQUFFLElBQUksRUFBRSxFQUFFLEVBQUU7O0FBRXBDLG1CQUFpQixFQUFFLENBQUM7OztBQUdwQixjQUFZLEVBQUUsQ0FBQzs7QUFFZixnQkFBYyxFQUFFLEVBQUU7O0NBRW5CLENBQUM7O0FBRUYsTUFBTSxDQUFDLE9BQU8sR0FBRyxZQUFZLENBQUMiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwibGV0IFBhdGhmaW5kZXIsIGdhbWVTZXR0aW5ncztcblxuUGF0aGZpbmRlciA9IHJlcXVpcmUoJ3BhdGhmaW5kZXInKTtcbmdhbWVTZXR0aW5ncyA9IHJlcXVpcmUoJ3NldHRpbmdzJyk7XG5cbmNsYXNzIEJvYXJkIHtcbiAgY29uc3RydWN0b3IoIGF0dHJpYnV0ZXMgKXtcbiAgICB0aGlzLmh1bWFub2lkID0gbnVsbDtcbiAgICB0aGlzLnNjb3JlID0gMDtcbiAgICB0aGlzLmR4ID0gMDtcbiAgICB0aGlzLmR5ID0gMDtcbiAgICB0aGlzLmh1bWFub2lkcyA9IGF0dHJpYnV0ZXMuaHVtYW5vaWRzIHx8IFtdO1xuICAgIHRoaXMud2lkdGggPSBhdHRyaWJ1dGVzLndpZHRoICB8fCAnNjAwcHgnO1xuICAgIHRoaXMuaGVpZ2h0ID0gYXR0cmlidXRlcy5oZWlnaHQgfHwgJzQwMHB4JztcbiAgfVxuXG4gIGlzR2FtZUFjdGl2ZSgpe1xuICAgIHJldHVybiB0aGlzLmh1bWFub2lkcy5zb21lKGZ1bmN0aW9uKGh1bWFub2lkKSB7XG4gICAgICByZXR1cm4gaHVtYW5vaWQuaHVtYW5UeXBlID09PSAnaHVtYW4nIHx8IGh1bWFub2lkLmh1bWFuVHlwZSA9PT0gJ3BsYXllcic7XG4gICAgfSk7XG4gIH1cblxuICBpc1BsYXllckFsaXZlKCl7XG4gICAgcmV0dXJuIHRoaXMuaHVtYW5vaWRzLnNvbWUoZnVuY3Rpb24oaHVtYW5vaWQpIHtcbiAgICAgIHJldHVybiBodW1hbm9pZC5odW1hblR5cGUgPT09ICdwbGF5ZXInO1xuICAgIH0pO1xuICB9XG5cbiAgaXNQb3NpdGlvbkVxdWFsKCBwb3NpdGlvbjEsIHBvc2l0aW9uMiApe1xuICAgIHJldHVybiBwb3NpdGlvbjEueCA9PT0gcG9zaXRpb24yLnggJiYgcG9zaXRpb24xLnkgPT09IHBvc2l0aW9uMi55O1xuICB9XG5cbiAgaXNWYWxpZERlc3RpbmF0aW9uKCB0YXJnZXRQb3NpdGlvbiApe1xuICAgIHJldHVybiAhdGhpcy5odW1hbm9pZHMuc29tZSgoaHVtYW5vaWQpID0+IHtcbiAgICAgIHJldHVybiB0aGlzLmlzUG9zaXRpb25FcXVhbChodW1hbm9pZC5wb3NpdGlvbiwgdGFyZ2V0UG9zaXRpb24pO1xuICAgIH0pO1xuICB9XG5cbiAgbmVhcmVzdEh1bWFub2lkKCBodW1hbm9pZFR5cGUgKXtcbiAgICBsZXQgc2ltaWxhckh1bWFub2lkcywgY2xvc2VzdFBvcywgY2xvc2VzdEh1bWFub2lkO1xuICAgIHNpbWlsYXJIdW1hbm9pZHMgPSB0aGlzLmZpbmRTaW1pbGFySHVtYW5vaWRzKCBodW1hbm9pZFR5cGUgKTtcbiAgICBjbG9zZXN0UG9zID0gdGhpcy5maW5kQ2xvc2VzdFBvcyggc2ltaWxhckh1bWFub2lkcyApO1xuICAgIGNsb3Nlc3RIdW1hbm9pZCA9IHRoaXMuZmluZENsb3Nlc3RIdW1hbm9pZCggY2xvc2VzdFBvcywgc2ltaWxhckh1bWFub2lkcyApO1xuICAgIHJldHVybiBjbG9zZXN0SHVtYW5vaWQ7XG4gIH1cblxuICBuZXh0VHVybigpe1xuICAgIGxldCBwbGF5ZXI7XG4gICAgZm9yKCBsZXQgaT0wOyBpPCB0aGlzLmh1bWFub2lkcy5sZW5ndGg7IGkrKyApe1xuICAgICAgdGhpcy5odW1hbm9pZCA9IHRoaXMuaHVtYW5vaWRzW2ldO1xuICAgICAgaWYoIHRoaXMuaHVtYW5vaWQuaHVtYW5UeXBlID09PSAnaW5mZWN0ZWRIdW1hbicgKXtcbiAgICAgICAgdGhpcy5odW1hbm9pZC5pbmNyZW1lbnRUaW1lU2luY2VJbmZlY3Rpb24oKTtcbiAgICAgICAgY29udGludWU7XG4gICAgICB9XG4gICAgICBpZiggdGhpcy5odW1hbm9pZC5odW1hblR5cGUgPT09ICdwbGF5ZXInICl7XG4gICAgICAgIGxldCB0YXJnZXRMb2MsIGNvb3JkcztcbiAgICAgICAgdGFyZ2V0TG9jID0ge1xuICAgICAgICAgIHg6IHRoaXMuaHVtYW5vaWQucG9zaXRpb24ueCArIHRoaXMuZHgqdGhpcy5odW1hbm9pZC5zcGVlZCxcbiAgICAgICAgICB5OiB0aGlzLmh1bWFub2lkLnBvc2l0aW9uLnkgKyB0aGlzLmR5KnRoaXMuaHVtYW5vaWQuc3BlZWRcbiAgICAgICAgfTtcbiAgICAgICAgY29vcmRzID0gKCBQYXRoZmluZGVyLm1vdmVUb3dhcmRzKHRoaXMuaHVtYW5vaWQucG9zaXRpb24sIHRhcmdldExvYywgdGhpcy5odW1hbm9pZC5zcGVlZCkgKTtcbiAgICAgICAgY29vcmRzLnggPSAoIChjb29yZHMueCArIHRoaXMud2lkdGgpICUgdGhpcy53aWR0aCApO1xuICAgICAgICBjb29yZHMueSA9ICggKGNvb3Jkcy55ICsgdGhpcy5oZWlnaHQpICUgdGhpcy5oZWlnaHQgKTtcbiAgICAgICAgdGhpcy5odW1hbm9pZC5wb3NpdGlvbiA9IGNvb3JkcztcbiAgICAgICAgY29udGludWU7XG4gICAgICB9XG4gICAgICBsZXQgbmVhcmVzdEh1bWFuLCBuZWFyZXN0Wm9tYmllLCBkZXN0aW5hdGlvbjtcbiAgICAgIG5lYXJlc3Rab21iaWUgPSB0aGlzLm5lYXJlc3RIdW1hbm9pZCggJ3pvbWJpZScgKTtcbiAgICAgIG5lYXJlc3RIdW1hbiA9IHRoaXMubmVhcmVzdEh1bWFub2lkKCAnaHVtYW4nICk7XG4gICAgICBwbGF5ZXIgPSB0aGlzLm5lYXJlc3RIdW1hbm9pZCggJ3BsYXllcicgKTtcbiAgICAgIGRlc3RpbmF0aW9uID0gdGhpcy5zZXREZXN0aW5hdGlvbiggbmVhcmVzdEh1bWFuLCBuZWFyZXN0Wm9tYmllLCBwbGF5ZXIgKTtcbiAgICAgIGRlc3RpbmF0aW9uLnggPSAoIChkZXN0aW5hdGlvbi54ICsgdGhpcy53aWR0aCkgJSB0aGlzLndpZHRoICk7XG4gICAgICBkZXN0aW5hdGlvbi55ID0gKCAoZGVzdGluYXRpb24ueSArIHRoaXMuaGVpZ2h0KSAlIHRoaXMuaGVpZ2h0ICk7XG5cbiAgICAgIGlmICggdGhpcy5odW1hbm9pZC5pc0FibGVUb0JpdGUoIHBsYXllciApICl7XG4gICAgICAgIHRoaXMuaHVtYW5vaWQuYml0ZSggcGxheWVyICk7XG4gICAgICB9XG5cbiAgICAgIGlmICggdGhpcy5odW1hbm9pZC5pc0FibGVUb0JpdGUoIG5lYXJlc3RIdW1hbiApICl7XG4gICAgICAgIHRoaXMuaHVtYW5vaWQuYml0ZSggbmVhcmVzdEh1bWFuICk7XG4gICAgICB9XG5cbiAgICAgIGlmKCB0aGlzLmlzVmFsaWREZXN0aW5hdGlvbiggZGVzdGluYXRpb24gKSApe1xuICAgICAgICB0aGlzLmh1bWFub2lkLnBvc2l0aW9uID0gZGVzdGluYXRpb247XG4gICAgICB9XG4gICAgfVxuICAgIHRoaXMuaW5jcmVtZW50U2NvcmUocGxheWVyKTtcbiAgfVxuXG4gIGluY3JlbWVudFNjb3JlKHBsYXllcil7XG4gICAgaWYgKHBsYXllciAmJiBwbGF5ZXIuaHVtYW5UeXBlID09PSAncGxheWVyJyl7IHRoaXMuc2NvcmUgKz0gMTA7IH1cbiAgfVxuXG4gIHNldERlc3RpbmF0aW9uKCBuZWFyZXN0SHVtYW4sIG5lYXJlc3Rab21iaWUsIHBsYXllciApe1xuICAgIGlmKCB0aGlzLmh1bWFub2lkLmh1bWFuVHlwZSA9PT0gJ3pvbWJpZScgKXtcbiAgICAgIHJldHVybiB0aGlzLnNldFpvbWJpZURlc3RpbmF0aW9uKCBuZWFyZXN0SHVtYW4sIG5lYXJlc3Rab21iaWUsIHBsYXllciApO1xuICAgIH1cbiAgICBlbHNlIGlmKCB0aGlzLmh1bWFub2lkLmh1bWFuVHlwZSA9PT0gJ2h1bWFuJyApe1xuICAgICAgcmV0dXJuIHRoaXMuc2V0SHVtYW5EZXN0aW5hdGlvbiggbmVhcmVzdEh1bWFuLCBuZWFyZXN0Wm9tYmllLCBwbGF5ZXIgKTtcbiAgICB9XG4gICAgZWxzZSB7IHJldHVybiB0aGlzLmh1bWFub2lkLnBvc2l0aW9uOyB9XG4gIH1cblxuICBzZXRab21iaWVEZXN0aW5hdGlvbiggbmVhcmVzdEh1bWFuLCBuZWFyZXN0Wm9tYmllLCBwbGF5ZXIgKXtcbiAgICBsZXQgcGxheWVyRGlzdGFuY2UsIGh1bWFuRGlzdGFuY2UsIHpvbWJpZURpc3RhbmNlO1xuICAgIHBsYXllckRpc3RhbmNlID0gTnVtYmVyLlBPU0lUSVZFX0lORklOSVRZO1xuICAgIGh1bWFuRGlzdGFuY2UgPSBOdW1iZXIuUE9TSVRJVkVfSU5GSU5JVFk7XG4gICAgem9tYmllRGlzdGFuY2UgPSBQYXRoZmluZGVyLmRpc3RhbmNlVG8oIG5lYXJlc3Rab21iaWUucG9zaXRpb24sIHRoaXMuaHVtYW5vaWQucG9zaXRpb24gKSAqIGdhbWVTZXR0aW5ncy56b21iaWVTcHJlYWRcbiAgICBpZiAocGxheWVyKXtcbiAgICAgIHBsYXllckRpc3RhbmNlID0gUGF0aGZpbmRlci5kaXN0YW5jZVRvKCBwbGF5ZXIucG9zaXRpb24sIHRoaXMuaHVtYW5vaWQucG9zaXRpb24gKTtcbiAgICB9XG4gICAgaWYgKG5lYXJlc3RIdW1hbil7XG4gICAgICBodW1hbkRpc3RhbmNlID0gUGF0aGZpbmRlci5kaXN0YW5jZVRvKCBuZWFyZXN0SHVtYW4ucG9zaXRpb24sIHRoaXMuaHVtYW5vaWQucG9zaXRpb24gKTtcbiAgICB9XG5cbiAgICBpZiAoIHBsYXllckRpc3RhbmNlIDwgaHVtYW5EaXN0YW5jZSApe1xuICAgICAgaWYgKCBwbGF5ZXJEaXN0YW5jZSA8IHpvbWJpZURpc3RhbmNlICl7XG4gICAgICAgIHJldHVybiB0aGlzLmh1bWFub2lkLm1vdmVOZWFyZXN0KCBwbGF5ZXIgKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiB0aGlzLmh1bWFub2lkLm1vdmVOZWFyZXN0KCBuZWFyZXN0Wm9tYmllICk7XG4gICAgICB9XG4gICAgfSBlbHNlIGlmICggaHVtYW5EaXN0YW5jZSA8IHpvbWJpZURpc3RhbmNlICl7XG4gICAgICByZXR1cm4gdGhpcy5odW1hbm9pZC5tb3ZlTmVhcmVzdCggbmVhcmVzdEh1bWFuICk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiB0aGlzLmh1bWFub2lkLm1vdmVOZWFyZXN0KCBuZWFyZXN0Wm9tYmllICk7XG4gICAgfVxuICB9XG5cbiAgc2V0SHVtYW5EZXN0aW5hdGlvbiggbmVhcmVzdEh1bWFuLCBuZWFyZXN0Wm9tYmllLCBwbGF5ZXIgKXtcbiAgICBsZXQgcGxheWVyRGlzdGFuY2UsIGh1bWFuRGlzdGFuY2UsIHpvbWJpZURpc3RhbmNlO1xuICAgIHBsYXllckRpc3RhbmNlID0gTnVtYmVyLlBPU0lUSVZFX0lORklOSVRZO1xuICAgIGh1bWFuRGlzdGFuY2UgPSBOdW1iZXIuUE9TSVRJVkVfSU5GSU5JVFk7XG4gICAgem9tYmllRGlzdGFuY2UgPSBQYXRoZmluZGVyLmRpc3RhbmNlVG8oIG5lYXJlc3Rab21iaWUucG9zaXRpb24sIHRoaXMuaHVtYW5vaWQucG9zaXRpb24gKTtcbiAgICBpZiAocGxheWVyKXtcbiAgICAgIHBsYXllckRpc3RhbmNlID0gUGF0aGZpbmRlci5kaXN0YW5jZVRvKCBwbGF5ZXIucG9zaXRpb24sIHRoaXMuaHVtYW5vaWQucG9zaXRpb24gKTtcbiAgICB9XG4gICAgaWYgKG5lYXJlc3RIdW1hbil7XG4gICAgICBodW1hbkRpc3RhbmNlID0gUGF0aGZpbmRlci5kaXN0YW5jZVRvKCBuZWFyZXN0SHVtYW4ucG9zaXRpb24sIHRoaXMuaHVtYW5vaWQucG9zaXRpb24gKTtcbiAgICB9XG5cbiAgICBpZiAoIHpvbWJpZURpc3RhbmNlIDwgZ2FtZVNldHRpbmdzLmh1bWFuRmVhclJhbmdlIHx8ICggIXBsYXllciAmJiAhbmVhcmVzdEh1bWFuICkgKXtcbiAgICAgIHJldHVybiB0aGlzLmh1bWFub2lkLm1vdmVOZWFyZXN0KCBuZWFyZXN0Wm9tYmllICk7XG4gICAgfSBlbHNlIGlmICggcGxheWVyRGlzdGFuY2UgPCBodW1hbkRpc3RhbmNlICl7XG4gICAgICByZXR1cm4gdGhpcy5odW1hbm9pZC5tb3ZlTmVhcmVzdCggcGxheWVyICk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiB0aGlzLmh1bWFub2lkLm1vdmVOZWFyZXN0KCBuZWFyZXN0SHVtYW4gKTtcbiAgICB9XG4gIH1cblxuICBvdGhlckh1bWFub2lkcygpe1xuICAgIHJldHVybiB0aGlzLmh1bWFub2lkcy5maWx0ZXIoKGN1cnJlbnRIdW1hbm9pZCkgPT4ge1xuICAgICAgcmV0dXJuIHRoaXMuaHVtYW5vaWQuaWQgIT09IGN1cnJlbnRIdW1hbm9pZC5pZDtcbiAgICB9KTtcbiAgfVxuXG4gIGZpbmRTaW1pbGFySHVtYW5vaWRzKCBodW1hbm9pZFR5cGUgKXtcbiAgICByZXR1cm4gdGhpcy5vdGhlckh1bWFub2lkcygpLmZpbHRlcihmdW5jdGlvbihodW1hbm9pZCl7XG4gICAgICByZXR1cm4gaHVtYW5vaWQuaHVtYW5UeXBlID09PSBodW1hbm9pZFR5cGU7XG4gICAgfSk7XG4gIH1cblxuICBmaW5kQ2xvc2VzdFBvcyggb3RoZXJIdW1hbm9pZHMgKXtcbiAgICBsZXQgY2xvc2VzdFBvcywgZGlzdDtcbiAgICBjbG9zZXN0UG9zID0gW107XG4gICAgZm9yKCBsZXQgaT0wOyBpPCBvdGhlckh1bWFub2lkcy5sZW5ndGg7IGkrKyApe1xuICAgICAgZGlzdCA9IFBhdGhmaW5kZXIuZGlzdGFuY2VUbyggb3RoZXJIdW1hbm9pZHNbaV0ucG9zaXRpb24sIHRoaXMuaHVtYW5vaWQucG9zaXRpb24gKTtcbiAgICAgIGNsb3Nlc3RQb3MucHVzaCggZGlzdCApO1xuICAgIH1cbiAgICByZXR1cm4gY2xvc2VzdFBvcztcbiAgfVxuXG4gIGZpbmRDbG9zZXN0SHVtYW5vaWQoIGNsb3Nlc3RQb3MsIG90aGVySHVtYW5vaWRzICl7XG4gICAgbGV0IGNsb3Nlc3RIdW1hbm9pZFZhbHVlLCBjbG9zZXN0SHVtYW5vaWQ7XG4gICAgY2xvc2VzdEh1bWFub2lkVmFsdWUgPSBNYXRoLm1pbi5hcHBseSggbnVsbCwgY2xvc2VzdFBvcyApO1xuICAgIGZvciggbGV0IGk9MDsgaSA8IGNsb3Nlc3RQb3MubGVuZ3RoOyBpKysgKXtcbiAgICAgIGlmKCBjbG9zZXN0UG9zW2ldID09PSBjbG9zZXN0SHVtYW5vaWRWYWx1ZSApeyBjbG9zZXN0SHVtYW5vaWQgPSBvdGhlckh1bWFub2lkc1tpXTt9XG4gICAgfVxuICAgIHJldHVybiBjbG9zZXN0SHVtYW5vaWQ7XG4gIH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBCb2FyZDtcbiIsImxldCBCb2FyZCwgSHVtYW5vaWRCdWlsZGVyLCBnYW1lU2V0dGluZ3M7XG5Cb2FyZCA9IHJlcXVpcmUoJ2JvYXJkJyk7XG5IdW1hbm9pZEJ1aWxkZXIgPSByZXF1aXJlKCdodW1hbm9pZEZhY3RvcnknKTtcbmdhbWVTZXR0aW5ncyA9IHJlcXVpcmUoJ3NldHRpbmdzJyk7XG5cbmNsYXNzIEdhbWVPZkFmdGVybGlmZSB7XG4gIGNvbnN0cnVjdG9yKCl7XG4gICAgbGV0IGNhbnZhcywgYWxsSHVtYW5vaWRzO1xuICAgIGNhbnZhcyA9IGRvY3VtZW50LmdldEVsZW1lbnRzQnlUYWdOYW1lKCdjYW52YXMnKVswXTtcbiAgICBhbGxIdW1hbm9pZHMgPSBIdW1hbm9pZEJ1aWxkZXIucG9wdWxhdGUoZ2FtZVNldHRpbmdzLmh1bWFuQ291bnQgLCBnYW1lU2V0dGluZ3Muem9tYmllQ291bnQpO1xuICAgIHRoaXMud2lkdGggPSBjYW52YXMud2lkdGg7XG4gICAgdGhpcy5oZWlnaHQgPSBjYW52YXMuaGVpZ2h0O1xuICAgIHRoaXMuY3R4ID0gY2FudmFzLmdldENvbnRleHQoJzJkJyk7XG4gICAgdGhpcy5ib2FyZCA9IG5ldyBCb2FyZCh7aHVtYW5vaWRzOiBhbGxIdW1hbm9pZHMsIHdpZHRoOiB0aGlzLndpZHRoLCBoZWlnaHQ6IHRoaXMuaGVpZ2h0fSk7XG4gICAgdGhpcy5odW1hbm9pZENvbG9yTWFwID0ge1xuICAgICAgaHVtYW46ICcjMDBhYWFhJyxcbiAgICAgIHpvbWJpZTogJyNmZjAwMDAnLFxuICAgICAgcGxheWVyOiAnIzAwY2MwMCcsXG4gICAgICBpbmZlY3RlZEh1bWFuOiAnIzc3MDAwMCdcbiAgICB9O1xuICB9XG5cbiAgYmluZFBsYXllck1vdmVtZW50KCl7XG4gICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcigna2V5dXAnLCAoZSkgPT57XG4gICAgICAvLyBzID0gODNcbiAgICAgIC8vIHcgPSA4N1xuICAgICAgLy8gYSA9IDY1XG4gICAgICAvLyBkID0gNjhcbiAgICAgIGlmIChlLndoaWNoID09PSA2OCB8fCBlLndoaWNoID09PSA2NSl7IHRoaXMuYm9hcmQuZHggPSAwOyB9XG4gICAgICBpZiAoZS53aGljaCA9PT0gODMgfHwgZS53aGljaCA9PT0gODcpeyB0aGlzLmJvYXJkLmR5ID0gMDsgfVxuICAgIH0pO1xuXG4gICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcigna2V5ZG93bicsIChlKSA9PntcbiAgICAgIGlmIChlLndoaWNoID09PSA2NSl7IHRoaXMuYm9hcmQuZHggPSAtMTsgfVxuICAgICAgZWxzZSBpZiAoZS53aGljaCA9PT0gNjgpeyB0aGlzLmJvYXJkLmR4ID0gMTsgfVxuICAgICAgZWxzZSBpZiAoZS53aGljaCA9PT0gODcpeyB0aGlzLmJvYXJkLmR5ID0gLTE7IH1cbiAgICAgIGVsc2UgaWYgKGUud2hpY2ggPT09IDgzKXsgdGhpcy5ib2FyZC5keSA9IDE7IH1cbiAgICB9KTtcbiAgfVxuXG5cbiAgZHJhd0h1bWFub2lkcygpe1xuICAgIGxldCBwbGF5ZXIsIHgsIHk7XG4gICAgdGhpcy5jdHguY2xlYXJSZWN0KDAsMCx0aGlzLndpZHRoLHRoaXMuaGVpZ2h0KTtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMuYm9hcmQuaHVtYW5vaWRzLmxlbmd0aDsgaSsrKXtcbiAgICAgIHRoaXMuY3R4LmJlZ2luUGF0aCgpO1xuICAgICAgcGxheWVyID0gdGhpcy5ib2FyZC5odW1hbm9pZHNbaV07XG4gICAgICB4ID0gcGxheWVyLnBvc2l0aW9uLng7XG4gICAgICB5ID0gcGxheWVyLnBvc2l0aW9uLnk7XG4gICAgICB0aGlzLmN0eC5hcmMoeCx5LDUsMCwyKk1hdGguUEkpO1xuICAgICAgdGhpcy5jdHguZmlsbFN0eWxlID0gdGhpcy5odW1hbm9pZENvbG9yTWFwW3BsYXllci5odW1hblR5cGVdO1xuICAgICAgdGhpcy5jdHguZmlsbCgpO1xuICAgICAgdGhpcy5jdHguc3Ryb2tlKCk7XG4gICAgfVxuICB9XG5cbiAgY2FsbE5leHRUdXJuKCl7XG4gICAgbGV0IGRlbGF5LCBuZXh0UmVxdWVzdDtcbiAgICBuZXh0UmVxdWVzdCA9ICgpPT4ge1xuICAgICAgdGhpcy5kcmF3SHVtYW5vaWRzKCk7XG4gICAgICBpZiAodGhpcy5ib2FyZC5pc0dhbWVBY3RpdmUoKSl7XG4gICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdzY29yZScpLmlubmVySFRNTCA9IHRoaXMuYm9hcmQuc2NvcmU7XG4gICAgICAgIHRoaXMuYm9hcmQubmV4dFR1cm4oKTtcbiAgICAgICAgZGVsYXkgPSAodGhpcy5ib2FyZC5pc1BsYXllckFsaXZlKCkgPyBnYW1lU2V0dGluZ3MudHVybkRlbGF5Lm5vcm1hbCA6IGdhbWVTZXR0aW5ncy50dXJuRGVsYXkuZmFzdCk7XG4gICAgICAgIHNldFRpbWVvdXQobmV4dFJlcXVlc3QsIGRlbGF5KTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGFsZXJ0KGBFVkVSWUJPRFkgSVMgREVBRCEhIVxcbllvdXIgc2NvcmUgd2FzOiAke3RoaXMuYm9hcmQuc2NvcmV9YCk7XG4gICAgICB9XG4gICAgfTtcbiAgICBzZXRUaW1lb3V0KG5leHRSZXF1ZXN0LCBnYW1lU2V0dGluZ3MudHVybkRlbGF5Lm5vcm1hbCk7XG4gIH1cblxuICBpbml0KCl7XG4gICAgdGhpcy5iaW5kUGxheWVyTW92ZW1lbnQoKTtcbiAgICB0aGlzLmNhbGxOZXh0VHVybigpO1xuICB9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gR2FtZU9mQWZ0ZXJsaWZlO1xuIiwibGV0IFBhdGhmaW5kZXIsIGdhbWVTZXR0aW5ncztcblxuUGF0aGZpbmRlciA9IHJlcXVpcmUoJ3BhdGhmaW5kZXInKTtcbmdhbWVTZXR0aW5ncyA9IHJlcXVpcmUoJ3NldHRpbmdzJyk7XG5cbmNsYXNzIEh1bWFub2lkIHtcbiAgY29uc3RydWN0b3IoYXR0cmlidXRlcyl7XG4gICAgdGhpcy5pZCA9IGF0dHJpYnV0ZXMuaWQ7XG4gICAgdGhpcy5wb3NpdGlvbiA9IGF0dHJpYnV0ZXMucG9zaXRpb24gfHxcbiAgICAgIHsgeDogKDUrIE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSo1OTEpKSwgeTogKDUrIE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSozOTEpKSB9O1xuICAgIHRoaXMuc3BlZWQgPSBhdHRyaWJ1dGVzLnNwZWVkO1xuICAgIHRoaXMuaHVtYW5UeXBlID0gYXR0cmlidXRlcy5odW1hblR5cGU7XG4gICAgdGhpcy50aW1lU2luY2VJbmZlY3Rpb24gPSAwO1xuICAgIHRoaXMubGFzdFBvc2l0aW9uID0geyB4OiB0aGlzLnBvc2l0aW9uLngsIHk6IHRoaXMucG9zaXRpb24ueSB9O1xuICB9XG5cbiAgaXNBdHRyYWN0ZWRUbyhuZWFyZXN0T2JqZWN0KXtcbiAgICByZXR1cm4gbmVhcmVzdE9iamVjdC5odW1hblR5cGUgPT09ICdodW1hbicgfHwgbmVhcmVzdE9iamVjdC5odW1hblR5cGUgPT09ICdwbGF5ZXInO1xuICB9XG5cbiAgc3RvcmVMYXN0UG9zaXRpb24oKXtcbiAgICB0aGlzLmxhc3RQb3NpdGlvbiA9IHt4OiB0aGlzLnBvc2l0aW9uLngsIHk6IHRoaXMucG9zaXRpb24ueX07XG4gIH1cblxuICBpc0xhc3RNb3ZlUmVwZWF0ZWQocG90ZW50aWFsTW92ZSl7XG4gICAgcmV0dXJuIChcbiAgICAgIChNYXRoLmFicyhwb3RlbnRpYWxNb3ZlLnggLSB0aGlzLmxhc3RQb3NpdGlvbi54KSA8IGdhbWVTZXR0aW5ncy5yZXBpdGlvblRvbGVyYW5jZSkgJiZcbiAgICAgICAgKE1hdGguYWJzKHBvdGVudGlhbE1vdmUueSAtIHRoaXMubGFzdFBvc2l0aW9uLnkpIDwgZ2FtZVNldHRpbmdzLnJlcGl0aW9uVG9sZXJhbmNlKVxuICAgICk7XG4gIH1cblxuICBnZXRCaXR0ZW4oKXtcbiAgICB0aGlzLmh1bWFuVHlwZSA9ICdpbmZlY3RlZEh1bWFuJztcbiAgICB0aGlzLnNwZWVkID0gMDtcbiAgfVxuXG4gIGJpdGUoaHVtYW4pe1xuICAgIGlmICggaHVtYW4gKSB7IGh1bWFuLmdldEJpdHRlbigpOyB9XG4gIH1cblxuICB0dXJuVG9ab21iaWUoKXtcbiAgICB0aGlzLmh1bWFuVHlwZSA9ICd6b21iaWUnO1xuICAgIHRoaXMuc3BlZWQgPSBnYW1lU2V0dGluZ3Muem9tYmllU3BlZWQ7XG4gIH1cblxuICBpc0FibGVUb0JpdGUoaHVtYW4pe1xuICAgIGlmICggaHVtYW4gKSB7XG4gICAgICByZXR1cm4gKFxuICAgICAgICB0aGlzLmh1bWFuVHlwZSA9PT0gJ3pvbWJpZScgJiYgKFBhdGhmaW5kZXIuZGlzdGFuY2VUbyggaHVtYW4ucG9zaXRpb24sIHRoaXMucG9zaXRpb24gKSA8IDEwKVxuICAgICAgKTtcbiAgICB9XG4gIH1cblxuICBpbmNyZW1lbnRUaW1lU2luY2VJbmZlY3Rpb24oKXtcbiAgICB0aGlzLnRpbWVTaW5jZUluZmVjdGlvbiArKztcbiAgICBpZiAodGhpcy50aW1lU2luY2VJbmZlY3Rpb24gPT09IDUpe1xuICAgICAgdGhpcy50dXJuVG9ab21iaWUoKTtcbiAgICB9XG4gIH1cblxuICBtb3ZlTmVhcmVzdChuZWFyZXN0T2JqZWN0KXtcbiAgICBsZXQgcG90ZW50aWFsTW92ZTtcbiAgICBpZiAodGhpcy5pc0F0dHJhY3RlZFRvKG5lYXJlc3RPYmplY3QpKXtcbiAgICAgIHBvdGVudGlhbE1vdmUgPSBQYXRoZmluZGVyLm1vdmVUb3dhcmRzKHRoaXMucG9zaXRpb24sIG5lYXJlc3RPYmplY3QucG9zaXRpb24sIHRoaXMuc3BlZWQpO1xuICAgIH0gZWxzZSB7XG4gICAgICBwb3RlbnRpYWxNb3ZlID0gUGF0aGZpbmRlci5tb3ZlQXdheUZyb20odGhpcy5wb3NpdGlvbiwgbmVhcmVzdE9iamVjdC5wb3NpdGlvbiwgdGhpcy5zcGVlZCk7XG4gICAgfVxuICAgIGlmICh0aGlzLmxhc3RQb3NpdGlvbi54ID09PSB0aGlzLnBvc2l0aW9uLnggJiYgdGhpcy5sYXN0UG9zaXRpb24ueSA9PT0gdGhpcy5wb3NpdGlvbi55KXtcbiAgICAgIHRoaXMuc3RvcmVMYXN0UG9zaXRpb24oKTtcbiAgICAgIHJldHVybiBQYXRoZmluZGVyLm1vdmVSYW5kb21seSh0aGlzLnBvc2l0aW9uLCB0aGlzLnNwZWVkKTtcbiAgICB9IGVsc2UgaWYgKHRoaXMuaXNMYXN0TW92ZVJlcGVhdGVkKHBvdGVudGlhbE1vdmUpKXtcbiAgICAgIHRoaXMuc3RvcmVMYXN0UG9zaXRpb24oKTtcbiAgICAgIHJldHVybiBQYXRoZmluZGVyLm1vdmVQZXJwZW5kaWN1bGFyVG8odGhpcy5wb3NpdGlvbiwgbmVhcmVzdE9iamVjdC5wb3NpdGlvbiwgdGhpcy5zcGVlZCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuc3RvcmVMYXN0UG9zaXRpb24oKTtcbiAgICAgIHJldHVybiBwb3RlbnRpYWxNb3ZlO1xuICAgIH1cbiAgfVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IEh1bWFub2lkO1xuIiwibGV0IEh1bWFub2lkLCBnYW1lU2V0dGluZ3M7XG5nYW1lU2V0dGluZ3MgPSByZXF1aXJlKCdzZXR0aW5ncycpO1xuSHVtYW5vaWQgPSByZXF1aXJlKCdodW1hbm9pZCcpO1xuXG5jbGFzcyBIdW1hbm9pZEJ1aWxkZXIge1xuICBzdGF0aWMgcG9wdWxhdGUobnVtYmVyT2ZIdW1hbnMsIG51bWJlck9mWm9tYmllcyl7XG4gICAgcmV0dXJuIChcbiAgICAgIHRoaXMuY3JlYXRpb24obnVtYmVyT2ZIdW1hbnMsICdodW1hbicsIGdhbWVTZXR0aW5ncy5odW1hblNwZWVkKVxuICAgICAgICAuY29uY2F0KEh1bWFub2lkQnVpbGRlci5jcmVhdGlvbihudW1iZXJPZlpvbWJpZXMsICd6b21iaWUnLCBnYW1lU2V0dGluZ3Muem9tYmllU3BlZWQpKVxuICAgICAgICAuY29uY2F0KEh1bWFub2lkQnVpbGRlci5jcmVhdGlvbigxLCAncGxheWVyJywgZ2FtZVNldHRpbmdzLnBsYXllclNwZWVkKSlcbiAgICApO1xuICB9XG5cbiAgc3RhdGljIGNyZWF0aW9uKG51bWJlciwgdHlwZSwgc3BlZWQpe1xuICAgIGxldCBwb3B1bGF0aW9uLCBuZXdIdW1hbm9pZDtcbiAgICBwb3B1bGF0aW9uID0gW107XG4gICAgZm9yKGxldCBpID0gMDsgaSA8IG51bWJlcjsgaSsrKXtcbiAgICAgIG5ld0h1bWFub2lkID0gbmV3IEh1bWFub2lkKHtodW1hblR5cGU6IHR5cGUsIHNwZWVkOiBzcGVlZCwgaWQ6IGl9KTtcbiAgICAgIHBvcHVsYXRpb24ucHVzaChuZXdIdW1hbm9pZCk7XG4gICAgfVxuICAgIHJldHVybiBwb3B1bGF0aW9uO1xuICB9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gSHVtYW5vaWRCdWlsZGVyO1xuIiwibGV0IEdhbWVPZkFmdGVybGlmZSwgZ2FtZU9mQWZ0ZXJsaWZlO1xuR2FtZU9mQWZ0ZXJsaWZlID0gcmVxdWlyZSgnZ2FtZScpO1xuZ2FtZU9mQWZ0ZXJsaWZlID0gbmV3IEdhbWVPZkFmdGVybGlmZSgpO1xuZ2FtZU9mQWZ0ZXJsaWZlLmluaXQoKTtcbiIsImNsYXNzIFBhdGhmaW5kZXIge1xuICBzdGF0aWMgbW92ZVRvd2FyZHMoY3VycmVudFBvc2l0aW9uLCBmcmllbmRseUxvY2F0aW9uLCBzcGVlZCl7XG4gICAgbGV0IGRlbHRhWSwgZGVsdGFYLCBsZW5ndGg7XG4gICAgZGVsdGFZID0gZnJpZW5kbHlMb2NhdGlvbi55IC0gY3VycmVudFBvc2l0aW9uLnk7XG4gICAgZGVsdGFYID0gZnJpZW5kbHlMb2NhdGlvbi54IC0gY3VycmVudFBvc2l0aW9uLng7XG4gICAgbGVuZ3RoID0gdGhpcy5kaXN0YW5jZVRvKGZyaWVuZGx5TG9jYXRpb24sIGN1cnJlbnRQb3NpdGlvbik7XG4gICAgaWYgKHNwZWVkICE9PSAwICYmIGxlbmd0aCA8IHNwZWVkKXtcbiAgICAgIHJldHVybiBmcmllbmRseUxvY2F0aW9uO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4ge1xuICAgICAgICB4OiAoY3VycmVudFBvc2l0aW9uLnggKyAoZGVsdGFYIC8gbGVuZ3RoICogc3BlZWQpKSxcbiAgICAgICAgeTogKGN1cnJlbnRQb3NpdGlvbi55ICsgKGRlbHRhWSAvIGxlbmd0aCAqIHNwZWVkKSlcbiAgICAgIH07XG4gICAgfVxuICB9XG5cbiAgc3RhdGljIG1vdmVBd2F5RnJvbShjdXJyZW50UG9zaXRpb24sIGhvc3RpbGVMb2NhdGlvbiwgc3BlZWQpe1xuICAgIHJldHVybiB0aGlzLm1vdmVUb3dhcmRzKGN1cnJlbnRQb3NpdGlvbiwgaG9zdGlsZUxvY2F0aW9uLCAtc3BlZWQpO1xuICB9XG5cbiAgc3RhdGljIG1vdmVQZXJwZW5kaWN1bGFyVG8oY3VycmVudFBvc2l0aW9uLCBmcmllbmRseUxvY2F0aW9uLCBzcGVlZCl7XG4gICAgbGV0IGRlbHRhWSwgZGVsdGFYLCBsZW5ndGg7XG4gICAgZGVsdGFZID0gZnJpZW5kbHlMb2NhdGlvbi55IC0gY3VycmVudFBvc2l0aW9uLnk7XG4gICAgZGVsdGFYID0gZnJpZW5kbHlMb2NhdGlvbi54IC0gY3VycmVudFBvc2l0aW9uLng7XG4gICAgbGVuZ3RoID0gdGhpcy5kaXN0YW5jZVRvKGZyaWVuZGx5TG9jYXRpb24sIGN1cnJlbnRQb3NpdGlvbik7XG4gICAgaWYgKHNwZWVkICE9PSAwICYmIGxlbmd0aCA8IHNwZWVkKXtcbiAgICAgIHJldHVybiBmcmllbmRseUxvY2F0aW9uO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4ge1xuICAgICAgICB4OiAoY3VycmVudFBvc2l0aW9uLnggKyAoZGVsdGFYIC8gbGVuZ3RoICogc3BlZWQpKSxcbiAgICAgICAgeTogKGN1cnJlbnRQb3NpdGlvbi55IC0gKGRlbHRhWSAvIGxlbmd0aCAqIHNwZWVkKSlcbiAgICAgIH07XG4gICAgfVxuICB9XG5cbiAgc3RhdGljIGRpc3RhbmNlVG8odGFyZ2V0TG9jYXRpb24sIGN1cnJlbnRQb3NpdGlvbil7XG4gICAgbGV0IGRlbHRhWSwgZGVsdGFYO1xuICAgIGRlbHRhWSA9IHRhcmdldExvY2F0aW9uLnkgLSBjdXJyZW50UG9zaXRpb24ueTtcbiAgICBkZWx0YVggPSB0YXJnZXRMb2NhdGlvbi54IC0gY3VycmVudFBvc2l0aW9uLng7XG4gICAgcmV0dXJuIE1hdGguc3FydChNYXRoLnBvdyhkZWx0YVksMikgKyBNYXRoLnBvdyhkZWx0YVgsMikpO1xuICB9XG5cbiAgc3RhdGljIG1vdmVSYW5kb21seShjdXJyZW50UG9zaXRpb24sIHNwZWVkKXtcbiAgICBsZXQgYW5nbGU7XG4gICAgYW5nbGUgPSBNYXRoLnJhbmRvbSgpICogMiAqIE1hdGguUEk7XG4gICAgcmV0dXJuIHtcbiAgICAgIHg6IChjdXJyZW50UG9zaXRpb24ueCArIE1hdGguY29zKGFuZ2xlKSAqIHNwZWVkKSxcbiAgICAgIHk6IChjdXJyZW50UG9zaXRpb24ueSArIE1hdGguc2luKGFuZ2xlKSAqIHNwZWVkKVxuICAgIH07XG4gIH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBQYXRoZmluZGVyO1xuIiwibGV0IGdhbWVTZXR0aW5ncyA9IHtcbiAgaHVtYW5TcGVlZDogNyxcbiAgcGxheWVyU3BlZWQ6IDYsXG4gIHpvbWJpZVNwZWVkOiA0LFxuICBodW1hbkNvdW50OiAzMCxcbiAgem9tYmllQ291bnQ6IDMsXG4gIHR1cm5EZWxheTogeyBub3JtYWw6IDEwMCwgZmFzdDogMjUgfSxcbiAgLy9zZXRzIHRoZSB0aW1lb3V0IGJldHdlZW4gdHVybnNcbiAgcmVwaXRpb25Ub2xlcmFuY2U6IDEsXG4gIC8vdGhlIHJhbmdlIGluIHdoaWNoIGEgbW92ZSBpcyBjb25zaWRlcmVkIHJlcGV0aXRpdmVcbiAgLy9sb3dlciB2YWx1ZXMgd2lsbCByZWR1Y2UgdGhlIHNpemUgb2YgdGhlIHJhbmdlLlxuICB6b21iaWVTcHJlYWQ6IDMsXG4gIC8vbG93ZXIgem9tYmllU3ByZWFkIHZhbHVlcyB3aWxsIGNhdXNlIHpvbWJpZXMgdG8gc3ByZWFkIG91dCBtb3JlXG4gIGh1bWFuRmVhclJhbmdlOiAyMFxuICAvL3RoZSByYW5nZSBhdCB3aGljaCBodW1hbnMgc3RhcnQgcnVubmluZyBmcm9tIHpvbWJpZXMuXG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IGdhbWVTZXR0aW5ncztcbiJdfQ==
