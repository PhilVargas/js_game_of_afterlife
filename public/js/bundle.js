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
    this.width = attributes.width || 600;
    this.height = attributes.height || 400;
  }

  _createClass(Board, [{
    key: 'isGameActive',
    value: function isGameActive() {
      return this.humanoids.some(function (humanoid) {
        return humanoid.isHuman() || humanoid.isPlayer();
      });
    }
  }, {
    key: 'isPlayerAlive',
    value: function isPlayerAlive() {
      return this.humanoids.some(function (humanoid) {
        return humanoid.isPlayer();
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
      for (var i = 0; i < this.humanoids.length; i++) {
        this.humanoid = this.humanoids[i];
        this.humanoid.handleNextMove({
          nearestHuman: this.nearestHumanoid('Human'),
          nearestZombie: this.nearestHumanoid('Zombie'),
          player: this.nearestHumanoid('Player'),
          dx: this.dx,
          dy: this.dy,
          humanoids: this.humanoids,
          getRelativePosition: this.getRelativePosition.bind(this)
        });
      }
      this.incrementScore();
    }
  }, {
    key: 'getRelativePosition',
    value: function getRelativePosition(position) {
      var x = undefined,
          y = undefined;
      x = (position.x + this.width) % this.width;
      y = (position.y + this.height) % this.height;
      return { x: x, y: y };
    }
  }, {
    key: 'incrementScore',
    value: function incrementScore() {
      if (this.isPlayerAlive()) {
        this.score += 10;
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
    this.hasBegun = false;
    this.width = canvas.width;
    this.height = canvas.height;
    this.ctx = canvas.getContext('2d');
    this.board = new Board({ humanoids: allHumanoids, width: this.width, height: this.height });
    this.humanoidColorMap = {
      Human: '#00aaaa',
      Zombie: '#ff0000',
      Player: '#00cc00',
      InfectedHuman: '#770000'
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
          document.getElementById('overlay-message').innerHTML = 'EVERYBODY IS DEAD!!!\nYour score was: ' + _this2.board.score;
          document.getElementById('overlay').className = '';
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

},{"board":"/Users/philipavargas/Desktop/js_game_of_afterlife/public/js/game/board.js","humanoidFactory":"/Users/philipavargas/Desktop/js_game_of_afterlife/public/js/game/humanoidFactory.js","settings":"/Users/philipavargas/Desktop/js_game_of_afterlife/public/js/game/settings.js"}],"/Users/philipavargas/Desktop/js_game_of_afterlife/public/js/game/humanoidFactory.js":[function(require,module,exports){
'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var gameSettings = undefined,
    Human = undefined,
    Zombie = undefined,
    Player = undefined;
gameSettings = require('settings');
Human = require('humanoids/human');
Zombie = require('humanoids/zombie');
Player = require('humanoids/player');

var HumanoidBuilder = (function () {
  function HumanoidBuilder() {
    _classCallCheck(this, HumanoidBuilder);
  }

  _createClass(HumanoidBuilder, null, [{
    key: 'humanoidMap',
    value: function humanoidMap() {
      return {
        Human: Human,
        Zombie: Zombie,
        Player: Player
      };
    }
  }, {
    key: 'populate',
    value: function populate(numberOfHumans, numberOfZombies) {
      var population = [];
      population = population.concat(this.creation(numberOfHumans, 'Human'));
      population = population.concat(this.creation(numberOfZombies, 'Zombie', population.length));
      population = population.concat(this.creation(1, 'Player', population.length));
      return population;
    }
  }, {
    key: 'creation',
    value: function creation(number, type) {
      var baseId = arguments.length <= 2 || arguments[2] === undefined ? 0 : arguments[2];

      var population = undefined,
          newHumanoid = undefined,
          map = undefined;
      map = this.humanoidMap();
      population = [];
      for (var i = 0; i < number; i++) {
        var H = map[type];
        newHumanoid = new H({ id: baseId + i });
        population.push(newHumanoid);
      }
      return population;
    }
  }]);

  return HumanoidBuilder;
})();

module.exports = HumanoidBuilder;

},{"humanoids/human":"/Users/philipavargas/Desktop/js_game_of_afterlife/public/js/game/humanoids/human.js","humanoids/player":"/Users/philipavargas/Desktop/js_game_of_afterlife/public/js/game/humanoids/player.js","humanoids/zombie":"/Users/philipavargas/Desktop/js_game_of_afterlife/public/js/game/humanoids/zombie.js","settings":"/Users/philipavargas/Desktop/js_game_of_afterlife/public/js/game/settings.js"}],"/Users/philipavargas/Desktop/js_game_of_afterlife/public/js/game/humanoids/human.js":[function(require,module,exports){
'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Pathfinder = undefined,
    gameSettings = undefined,
    Humanoid = undefined,
    InfectedHuman = undefined;

gameSettings = require('settings');
Pathfinder = require('pathfinder');
Humanoid = require('humanoids/humanoid');
InfectedHuman = require('humanoids/infectedHuman');

var Human = (function (_Humanoid) {
  _inherits(Human, _Humanoid);

  function Human(opts) {
    _classCallCheck(this, Human);

    _get(Object.getPrototypeOf(Human.prototype), 'constructor', this).call(this, opts);
    this.speed = gameSettings.humanSpeed;
  }

  _createClass(Human, [{
    key: 'isAbleToBite',
    value: function isAbleToBite() {
      return false;
    }
  }, {
    key: 'transform',
    value: function transform() {
      return new InfectedHuman(this.cloneProps());
    }
  }, {
    key: 'handleNextMove',
    value: function handleNextMove(opts) {
      var destination = undefined;
      var nearestHuman = opts.nearestHuman;
      var nearestZombie = opts.nearestZombie;
      var player = opts.player;
      var humanoids = opts.humanoids;
      var getRelativePosition = opts.getRelativePosition;

      destination = getRelativePosition(this.getNextDestination(nearestHuman, nearestZombie, player));
      if (this.isValidDestination(humanoids, destination)) {
        this.position = destination;
      }
    }
  }, {
    key: 'isValidDestination',
    value: function isValidDestination(humanoids, targetPosition) {
      return !humanoids.some(function (humanoid) {
        return humanoid.position.x === targetPosition.x && humanoid.position.y === targetPosition.y;
      });
    }
  }, {
    key: 'getNextDestination',
    value: function getNextDestination(nearestHuman, nearestZombie, player) {
      var playerDistance = undefined,
          humanDistance = undefined,
          zombieDistance = undefined;
      playerDistance = Number.POSITIVE_INFINITY;
      humanDistance = Number.POSITIVE_INFINITY;
      zombieDistance = Pathfinder.distanceTo(nearestZombie.position, this.position);
      if (player) {
        playerDistance = Pathfinder.distanceTo(player.position, this.position);
      }
      if (nearestHuman) {
        humanDistance = Pathfinder.distanceTo(nearestHuman.position, this.position);
      }

      if (zombieDistance < gameSettings.humanFearRange || !player && !nearestHuman) {
        return this.moveNearest(nearestZombie);
      } else if (playerDistance < humanDistance) {
        return this.moveNearest(player);
      } else {
        return this.moveNearest(nearestHuman);
      }
    }
  }]);

  return Human;
})(Humanoid);

module.exports = Human;

},{"humanoids/humanoid":"/Users/philipavargas/Desktop/js_game_of_afterlife/public/js/game/humanoids/humanoid.js","humanoids/infectedHuman":"/Users/philipavargas/Desktop/js_game_of_afterlife/public/js/game/humanoids/infectedHuman.js","pathfinder":"/Users/philipavargas/Desktop/js_game_of_afterlife/public/js/game/pathfinder.js","settings":"/Users/philipavargas/Desktop/js_game_of_afterlife/public/js/game/settings.js"}],"/Users/philipavargas/Desktop/js_game_of_afterlife/public/js/game/humanoids/humanoid.js":[function(require,module,exports){
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
    this.lastPosition = { x: this.position.x, y: this.position.y };
    this.humanType = this.constructor.name;
  }

  _createClass(Humanoid, [{
    key: 'isZombie',
    value: function isZombie() {
      return this.humanType === 'Zombie';
    }
  }, {
    key: 'isPlayer',
    value: function isPlayer() {
      return this.humanType === 'Player';
    }
  }, {
    key: 'isHuman',
    value: function isHuman() {
      return this.humanType === 'Human';
    }
  }, {
    key: 'cloneProps',
    value: function cloneProps() {
      return {
        id: this.id,
        position: this.position,
        lastPosition: this.lastPosition
      };
    }
  }, {
    key: 'isAttractedTo',
    value: function isAttractedTo(nearestHumanoid) {
      return nearestHumanoid.isPlayer() || nearestHumanoid.isHuman();
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

},{"pathfinder":"/Users/philipavargas/Desktop/js_game_of_afterlife/public/js/game/pathfinder.js","settings":"/Users/philipavargas/Desktop/js_game_of_afterlife/public/js/game/settings.js"}],"/Users/philipavargas/Desktop/js_game_of_afterlife/public/js/game/humanoids/infectedHuman.js":[function(require,module,exports){
'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Pathfinder = undefined,
    gameSettings = undefined,
    Humanoid = undefined,
    Zombie = undefined;

gameSettings = require('settings');
Pathfinder = require('pathfinder');
Humanoid = require('humanoids/humanoid');
Zombie = require('humanoids/zombie');

var InfectedHuman = (function (_Humanoid) {
  _inherits(InfectedHuman, _Humanoid);

  function InfectedHuman(opts) {
    _classCallCheck(this, InfectedHuman);

    _get(Object.getPrototypeOf(InfectedHuman.prototype), 'constructor', this).call(this, opts);
    this.speed = 0;
    this.timeSinceInfection = 0;
  }

  _createClass(InfectedHuman, [{
    key: 'isAbleToBite',
    value: function isAbleToBite() {
      return false;
    }
  }, {
    key: 'transform',
    value: function transform() {
      return new Zombie(this.cloneProps());
    }
  }, {
    key: 'incrementTimeSinceInfection',
    value: function incrementTimeSinceInfection() {
      this.timeSinceInfection++;
    }
  }, {
    key: 'handleNextMove',
    value: function handleNextMove(opts) {
      var humanoids = opts.humanoids;

      this.incrementTimeSinceInfection();
      if (this.timeSinceInfection >= 5) {
        humanoids[this.id] = this.transform();
      }
    }
  }]);

  return InfectedHuman;
})(Humanoid);

module.exports = InfectedHuman;

},{"humanoids/humanoid":"/Users/philipavargas/Desktop/js_game_of_afterlife/public/js/game/humanoids/humanoid.js","humanoids/zombie":"/Users/philipavargas/Desktop/js_game_of_afterlife/public/js/game/humanoids/zombie.js","pathfinder":"/Users/philipavargas/Desktop/js_game_of_afterlife/public/js/game/pathfinder.js","settings":"/Users/philipavargas/Desktop/js_game_of_afterlife/public/js/game/settings.js"}],"/Users/philipavargas/Desktop/js_game_of_afterlife/public/js/game/humanoids/player.js":[function(require,module,exports){
'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Pathfinder = undefined,
    gameSettings = undefined,
    Humanoid = undefined,
    InfectedHuman = undefined;

gameSettings = require('settings');
Pathfinder = require('pathfinder');
Humanoid = require('humanoids/humanoid');
InfectedHuman = require('humanoids/infectedHuman');

var Player = (function (_Humanoid) {
  _inherits(Player, _Humanoid);

  function Player(opts) {
    _classCallCheck(this, Player);

    _get(Object.getPrototypeOf(Player.prototype), 'constructor', this).call(this, opts);
    this.speed = gameSettings.playerSpeed;
  }

  _createClass(Player, [{
    key: 'isAbleToBite',
    value: function isAbleToBite() {
      return false;
    }
  }, {
    key: 'transform',
    value: function transform() {
      return new InfectedHuman(this.cloneProps());
    }
  }, {
    key: 'handleNextMove',
    value: function handleNextMove(opts) {
      var targetLoc = undefined,
          coords = undefined;
      var dx = opts.dx;
      var dy = opts.dy;
      var getRelativePosition = opts.getRelativePosition;

      targetLoc = {
        x: this.position.x + dx * this.speed,
        y: this.position.y + dy * this.speed
      };
      coords = Pathfinder.moveTowards(this.position, targetLoc, this.speed);
      this.position = getRelativePosition(coords);
    }
  }]);

  return Player;
})(Humanoid);

module.exports = Player;

},{"humanoids/humanoid":"/Users/philipavargas/Desktop/js_game_of_afterlife/public/js/game/humanoids/humanoid.js","humanoids/infectedHuman":"/Users/philipavargas/Desktop/js_game_of_afterlife/public/js/game/humanoids/infectedHuman.js","pathfinder":"/Users/philipavargas/Desktop/js_game_of_afterlife/public/js/game/pathfinder.js","settings":"/Users/philipavargas/Desktop/js_game_of_afterlife/public/js/game/settings.js"}],"/Users/philipavargas/Desktop/js_game_of_afterlife/public/js/game/humanoids/zombie.js":[function(require,module,exports){
'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Pathfinder = undefined,
    gameSettings = undefined,
    Humanoid = undefined,
    InfectedHuman = undefined;

gameSettings = require('settings');
Pathfinder = require('pathfinder');
Humanoid = require('humanoids/humanoid');
InfectedHuman = require('humanoids/infectedHuman');

var Zombie = (function (_Humanoid) {
  _inherits(Zombie, _Humanoid);

  function Zombie(opts) {
    _classCallCheck(this, Zombie);

    _get(Object.getPrototypeOf(Zombie.prototype), 'constructor', this).call(this, opts);
    this.speed = gameSettings.zombieSpeed;
  }

  _createClass(Zombie, [{
    key: 'isAbleToBite',
    value: function isAbleToBite(human) {
      return human && Pathfinder.distanceTo(human.position, this.position) < gameSettings.zombieBiteRange;
    }
  }, {
    key: 'transform',
    value: function transform() {
      return this;
    }
  }, {
    key: 'isValidDestination',
    value: function isValidDestination(humanoids, targetPosition) {
      return !humanoids.some(function (humanoid) {
        return humanoid.position.x === targetPosition.x && humanoid.position.y === targetPosition.y;
      });
    }
  }, {
    key: 'getNextDestination',
    value: function getNextDestination(nearestHuman, nearestZombie, player) {
      var playerDistance = undefined,
          humanDistance = undefined,
          zombieDistance = undefined;
      playerDistance = Number.POSITIVE_INFINITY;
      humanDistance = Number.POSITIVE_INFINITY;
      zombieDistance = Number.POSITIVE_INFINITY;
      if (nearestZombie) {
        zombieDistance = Pathfinder.distanceTo(nearestZombie.position, this.position) * gameSettings.zombieSpread;
      }
      if (player) {
        playerDistance = Pathfinder.distanceTo(player.position, this.position);
      }
      if (nearestHuman) {
        humanDistance = Pathfinder.distanceTo(nearestHuman.position, this.position);
      }

      if (playerDistance < humanDistance) {
        if (playerDistance < zombieDistance) {
          return this.moveNearest(player);
        } else {
          return this.moveNearest(nearestZombie);
        }
      } else if (humanDistance < zombieDistance) {
        return this.moveNearest(nearestHuman);
      } else {
        return this.moveNearest(nearestZombie);
      }
    }
  }, {
    key: 'handleNextMove',
    value: function handleNextMove(opts) {
      var destination = undefined;
      var nearestHuman = opts.nearestHuman;
      var nearestZombie = opts.nearestZombie;
      var player = opts.player;
      var humanoids = opts.humanoids;
      var getRelativePosition = opts.getRelativePosition;

      if (this.isAbleToBite(player)) {
        humanoids[player.id] = player.transform();
      }
      if (this.isAbleToBite(nearestHuman)) {
        humanoids[nearestHuman.id] = nearestHuman.transform();
      }
      destination = getRelativePosition(this.getNextDestination(nearestHuman, nearestZombie, player));
      if (this.isValidDestination(humanoids, destination)) {
        this.position = destination;
      }
    }
  }]);

  return Zombie;
})(Humanoid);

module.exports = Zombie;

},{"humanoids/humanoid":"/Users/philipavargas/Desktop/js_game_of_afterlife/public/js/game/humanoids/humanoid.js","humanoids/infectedHuman":"/Users/philipavargas/Desktop/js_game_of_afterlife/public/js/game/humanoids/infectedHuman.js","pathfinder":"/Users/philipavargas/Desktop/js_game_of_afterlife/public/js/game/pathfinder.js","settings":"/Users/philipavargas/Desktop/js_game_of_afterlife/public/js/game/settings.js"}],"/Users/philipavargas/Desktop/js_game_of_afterlife/public/js/game/initialize.js":[function(require,module,exports){
'use strict';

var GameOfAfterlife = undefined,
    gameOfAfterlife = undefined;
GameOfAfterlife = require('game');

document.getElementById('initialize-game').addEventListener('click', function (e) {
    document.getElementById('overlay').className = 'hide';
    gameOfAfterlife = new GameOfAfterlife();
    gameOfAfterlife.init();
});

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
  turnDelay: { normal: 100, fast: 25 }, // sets the timeout between turns
  repitionTolerance: 1, // the range in which a move is considered repetitive
  // lower values will reduce the size of the range.
  zombieSpread: 3, // lower zombieSpread values will cause zombies to spread out more
  humanFearRange: 20, // the range at which humans start running from zombies.
  zombieBiteRange: 10 };

// the range at which a zombie can bite a human.
module.exports = gameSettings;

},{}]},{},["/Users/philipavargas/Desktop/js_game_of_afterlife/public/js/game/initialize.js"])
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL25vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIvVXNlcnMvcGhpbGlwYXZhcmdhcy9EZXNrdG9wL2pzX2dhbWVfb2ZfYWZ0ZXJsaWZlL3B1YmxpYy9qcy9nYW1lL2JvYXJkLmpzIiwiL1VzZXJzL3BoaWxpcGF2YXJnYXMvRGVza3RvcC9qc19nYW1lX29mX2FmdGVybGlmZS9wdWJsaWMvanMvZ2FtZS9nYW1lLmpzIiwiL1VzZXJzL3BoaWxpcGF2YXJnYXMvRGVza3RvcC9qc19nYW1lX29mX2FmdGVybGlmZS9wdWJsaWMvanMvZ2FtZS9odW1hbm9pZEZhY3RvcnkuanMiLCIvVXNlcnMvcGhpbGlwYXZhcmdhcy9EZXNrdG9wL2pzX2dhbWVfb2ZfYWZ0ZXJsaWZlL3B1YmxpYy9qcy9nYW1lL2h1bWFub2lkcy9odW1hbi5qcyIsIi9Vc2Vycy9waGlsaXBhdmFyZ2FzL0Rlc2t0b3AvanNfZ2FtZV9vZl9hZnRlcmxpZmUvcHVibGljL2pzL2dhbWUvaHVtYW5vaWRzL2h1bWFub2lkLmpzIiwiL1VzZXJzL3BoaWxpcGF2YXJnYXMvRGVza3RvcC9qc19nYW1lX29mX2FmdGVybGlmZS9wdWJsaWMvanMvZ2FtZS9odW1hbm9pZHMvaW5mZWN0ZWRIdW1hbi5qcyIsIi9Vc2Vycy9waGlsaXBhdmFyZ2FzL0Rlc2t0b3AvanNfZ2FtZV9vZl9hZnRlcmxpZmUvcHVibGljL2pzL2dhbWUvaHVtYW5vaWRzL3BsYXllci5qcyIsIi9Vc2Vycy9waGlsaXBhdmFyZ2FzL0Rlc2t0b3AvanNfZ2FtZV9vZl9hZnRlcmxpZmUvcHVibGljL2pzL2dhbWUvaHVtYW5vaWRzL3pvbWJpZS5qcyIsIi9Vc2Vycy9waGlsaXBhdmFyZ2FzL0Rlc2t0b3AvanNfZ2FtZV9vZl9hZnRlcmxpZmUvcHVibGljL2pzL2dhbWUvaW5pdGlhbGl6ZS5qcyIsIi9Vc2Vycy9waGlsaXBhdmFyZ2FzL0Rlc2t0b3AvanNfZ2FtZV9vZl9hZnRlcmxpZmUvcHVibGljL2pzL2dhbWUvcGF0aGZpbmRlci5qcyIsIi9Vc2Vycy9waGlsaXBhdmFyZ2FzL0Rlc2t0b3AvanNfZ2FtZV9vZl9hZnRlcmxpZmUvcHVibGljL2pzL2dhbWUvc2V0dGluZ3MuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7Ozs7QUNBQSxJQUFJLFVBQVUsWUFBQTtJQUFFLFlBQVksWUFBQSxDQUFDOztBQUU3QixVQUFVLEdBQUcsT0FBTyxDQUFDLFlBQVksQ0FBQyxDQUFDO0FBQ25DLFlBQVksR0FBRyxPQUFPLENBQUMsVUFBVSxDQUFDLENBQUM7O0lBRTdCLEtBQUs7QUFDRSxXQURQLEtBQUssQ0FDSSxVQUFVLEVBQUU7MEJBRHJCLEtBQUs7O0FBRVAsUUFBSSxDQUFDLFFBQVEsR0FBRyxJQUFJLENBQUM7QUFDckIsUUFBSSxDQUFDLEtBQUssR0FBRyxDQUFDLENBQUM7QUFDZixRQUFJLENBQUMsRUFBRSxHQUFHLENBQUMsQ0FBQztBQUNaLFFBQUksQ0FBQyxFQUFFLEdBQUcsQ0FBQyxDQUFDO0FBQ1osUUFBSSxDQUFDLFNBQVMsR0FBRyxVQUFVLENBQUMsU0FBUyxJQUFJLEVBQUUsQ0FBQztBQUM1QyxRQUFJLENBQUMsS0FBSyxHQUFHLFVBQVUsQ0FBQyxLQUFLLElBQUssR0FBRyxDQUFDO0FBQ3RDLFFBQUksQ0FBQyxNQUFNLEdBQUcsVUFBVSxDQUFDLE1BQU0sSUFBSSxHQUFHLENBQUM7R0FDeEM7O2VBVEcsS0FBSzs7V0FXRyx3QkFBRTtBQUNaLGFBQU8sSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsVUFBUyxRQUFRLEVBQUU7QUFDNUMsZUFBTyxRQUFRLENBQUMsT0FBTyxFQUFFLElBQUksUUFBUSxDQUFDLFFBQVEsRUFBRSxDQUFDO09BQ2xELENBQUMsQ0FBQztLQUNKOzs7V0FFWSx5QkFBRTtBQUNiLGFBQU8sSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsVUFBUyxRQUFRLEVBQUU7QUFDNUMsZUFBTyxRQUFRLENBQUMsUUFBUSxFQUFF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LEVBQUUsQ0FBQztBQUNkLFlBQVUsRUFBRSxFQUFFO0FBQ2QsYUFBVyxFQUFFLENBQUM7QUFDZCxXQUFTLEVBQUUsRUFBRSxNQUFNLEVBQUUsR0FBRyxFQUFFLElBQUksRUFBRSxFQUFFLEVBQUU7QUFDcEMsbUJBQWlCLEVBQUUsQ0FBQzs7QUFFcEIsY0FBWSxFQUFFLENBQUM7QUFDZixnQkFBYyxFQUFFLEVBQUU7QUFDbEIsaUJBQWUsRUFBRSxFQUFFLEVBQ3BCLENBQUM7OztBQUVGLE1BQU0sQ0FBQyxPQUFPLEdBQUcsWUFBWSxDQUFDIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsImxldCBQYXRoZmluZGVyLCBnYW1lU2V0dGluZ3M7XG5cblBhdGhmaW5kZXIgPSByZXF1aXJlKCdwYXRoZmluZGVyJyk7XG5nYW1lU2V0dGluZ3MgPSByZXF1aXJlKCdzZXR0aW5ncycpO1xuXG5jbGFzcyBCb2FyZCB7XG4gIGNvbnN0cnVjdG9yKCBhdHRyaWJ1dGVzICl7XG4gICAgdGhpcy5odW1hbm9pZCA9IG51bGw7XG4gICAgdGhpcy5zY29yZSA9IDA7XG4gICAgdGhpcy5keCA9IDA7XG4gICAgdGhpcy5keSA9IDA7XG4gICAgdGhpcy5odW1hbm9pZHMgPSBhdHRyaWJ1dGVzLmh1bWFub2lkcyB8fCBbXTtcbiAgICB0aGlzLndpZHRoID0gYXR0cmlidXRlcy53aWR0aCAgfHwgNjAwO1xuICAgIHRoaXMuaGVpZ2h0ID0gYXR0cmlidXRlcy5oZWlnaHQgfHwgNDAwO1xuICB9XG5cbiAgaXNHYW1lQWN0aXZlKCl7XG4gICAgcmV0dXJuIHRoaXMuaHVtYW5vaWRzLnNvbWUoZnVuY3Rpb24oaHVtYW5vaWQpIHtcbiAgICAgIHJldHVybiBodW1hbm9pZC5pc0h1bWFuKCkgfHwgaHVtYW5vaWQuaXNQbGF5ZXIoKTtcbiAgICB9KTtcbiAgfVxuXG4gIGlzUGxheWVyQWxpdmUoKXtcbiAgICByZXR1cm4gdGhpcy5odW1hbm9pZHMuc29tZShmdW5jdGlvbihodW1hbm9pZCkge1xuICAgICAgcmV0dXJuIGh1bWFub2lkLmlzUGxheWVyKCk7XG4gICAgfSk7XG4gIH1cblxuICBpc1Bvc2l0aW9uRXF1YWwoIHBvc2l0aW9uMSwgcG9zaXRpb24yICl7XG4gICAgcmV0dXJuIHBvc2l0aW9uMS54ID09PSBwb3NpdGlvbjIueCAmJiBwb3NpdGlvbjEueSA9PT0gcG9zaXRpb24yLnk7XG4gIH1cblxuICBpc1ZhbGlkRGVzdGluYXRpb24oIHRhcmdldFBvc2l0aW9uICl7XG4gICAgcmV0dXJuICF0aGlzLmh1bWFub2lkcy5zb21lKChodW1hbm9pZCkgPT4ge1xuICAgICAgcmV0dXJuIHRoaXMuaXNQb3NpdGlvbkVxdWFsKGh1bWFub2lkLnBvc2l0aW9uLCB0YXJnZXRQb3NpdGlvbik7XG4gICAgfSk7XG4gIH1cblxuICBuZWFyZXN0SHVtYW5vaWQoIGh1bWFub2lkVHlwZSApe1xuICAgIGxldCBzaW1pbGFySHVtYW5vaWRzLCBjbG9zZXN0UG9zLCBjbG9zZXN0SHVtYW5vaWQ7XG4gICAgc2ltaWxhckh1bWFub2lkcyA9IHRoaXMuZmluZFNpbWlsYXJIdW1hbm9pZHMoIGh1bWFub2lkVHlwZSApO1xuICAgIGNsb3Nlc3RQb3MgPSB0aGlzLmZpbmRDbG9zZXN0UG9zKCBzaW1pbGFySHVtYW5vaWRzICk7XG4gICAgY2xvc2VzdEh1bWFub2lkID0gdGhpcy5maW5kQ2xvc2VzdEh1bWFub2lkKCBjbG9zZXN0UG9zLCBzaW1pbGFySHVtYW5vaWRzICk7XG4gICAgcmV0dXJuIGNsb3Nlc3RIdW1hbm9pZDtcbiAgfVxuXG4gIG5leHRUdXJuKCl7XG4gICAgZm9yKCBsZXQgaT0wOyBpPCB0aGlzLmh1bWFub2lkcy5sZW5ndGg7IGkrKyApe1xuICAgICAgdGhpcy5odW1hbm9pZCA9IHRoaXMuaHVtYW5vaWRzW2ldO1xuICAgICAgdGhpcy5odW1hbm9pZC5oYW5kbGVOZXh0TW92ZSh7XG4gICAgICAgIG5lYXJlc3RIdW1hbjogdGhpcy5uZWFyZXN0SHVtYW5vaWQoJ0h1bWFuJyksXG4gICAgICAgIG5lYXJlc3Rab21iaWU6IHRoaXMubmVhcmVzdEh1bWFub2lkKCdab21iaWUnKSxcbiAgICAgICAgcGxheWVyOiB0aGlzLm5lYXJlc3RIdW1hbm9pZCgnUGxheWVyJyksXG4gICAgICAgIGR4OiB0aGlzLmR4LFxuICAgICAgICBkeTogdGhpcy5keSxcbiAgICAgICAgaHVtYW5vaWRzOiB0aGlzLmh1bWFub2lkcyxcbiAgICAgICAgZ2V0UmVsYXRpdmVQb3NpdGlvbjogdGhpcy5nZXRSZWxhdGl2ZVBvc2l0aW9uLmJpbmQodGhpcylcbiAgICAgIH0pO1xuICAgIH1cbiAgICB0aGlzLmluY3JlbWVudFNjb3JlKCk7XG4gIH1cblxuICBnZXRSZWxhdGl2ZVBvc2l0aW9uKHBvc2l0aW9uKSB7XG4gICAgbGV0IHgseTtcbiAgICB4ID0gKCAocG9zaXRpb24ueCArIHRoaXMud2lkdGgpICUgdGhpcy53aWR0aCApO1xuICAgIHkgPSAoIChwb3NpdGlvbi55ICsgdGhpcy5oZWlnaHQpICUgdGhpcy5oZWlnaHQgKTtcbiAgICByZXR1cm4ge3gsIHl9O1xuICB9XG5cbiAgaW5jcmVtZW50U2NvcmUoKXtcbiAgICBpZiAodGhpcy5pc1BsYXllckFsaXZlKCkpIHsgdGhpcy5zY29yZSArPSAxMDsgfVxuICB9XG5cbiAgb3RoZXJIdW1hbm9pZHMoKXtcbiAgICByZXR1cm4gdGhpcy5odW1hbm9pZHMuZmlsdGVyKChjdXJyZW50SHVtYW5vaWQpID0+IHtcbiAgICAgIHJldHVybiB0aGlzLmh1bWFub2lkLmlkICE9PSBjdXJyZW50SHVtYW5vaWQuaWQ7XG4gICAgfSk7XG4gIH1cblxuICBmaW5kU2ltaWxhckh1bWFub2lkcyggaHVtYW5vaWRUeXBlICl7XG4gICAgcmV0dXJuIHRoaXMub3RoZXJIdW1hbm9pZHMoKS5maWx0ZXIoZnVuY3Rpb24oaHVtYW5vaWQpe1xuICAgICAgcmV0dXJuIGh1bWFub2lkLmh1bWFuVHlwZSA9PT0gaHVtYW5vaWRUeXBlO1xuICAgIH0pO1xuICB9XG5cbiAgZmluZENsb3Nlc3RQb3MoIG90aGVySHVtYW5vaWRzICl7XG4gICAgbGV0IGNsb3Nlc3RQb3MsIGRpc3Q7XG4gICAgY2xvc2VzdFBvcyA9IFtdO1xuICAgIGZvciggbGV0IGk9MDsgaTwgb3RoZXJIdW1hbm9pZHMubGVuZ3RoOyBpKysgKXtcbiAgICAgIGRpc3QgPSBQYXRoZmluZGVyLmRpc3RhbmNlVG8oIG90aGVySHVtYW5vaWRzW2ldLnBvc2l0aW9uLCB0aGlzLmh1bWFub2lkLnBvc2l0aW9uICk7XG4gICAgICBjbG9zZXN0UG9zLnB1c2goIGRpc3QgKTtcbiAgICB9XG4gICAgcmV0dXJuIGNsb3Nlc3RQb3M7XG4gIH1cblxuICBmaW5kQ2xvc2VzdEh1bWFub2lkKCBjbG9zZXN0UG9zLCBvdGhlckh1bWFub2lkcyApe1xuICAgIGxldCBjbG9zZXN0SHVtYW5vaWRWYWx1ZSwgY2xvc2VzdEh1bWFub2lkO1xuICAgIGNsb3Nlc3RIdW1hbm9pZFZhbHVlID0gTWF0aC5taW4uYXBwbHkoIG51bGwsIGNsb3Nlc3RQb3MgKTtcbiAgICBmb3IoIGxldCBpPTA7IGkgPCBjbG9zZXN0UG9zLmxlbmd0aDsgaSsrICl7XG4gICAgICBpZiggY2xvc2VzdFBvc1tpXSA9PT0gY2xvc2VzdEh1bWFub2lkVmFsdWUgKXsgY2xvc2VzdEh1bWFub2lkID0gb3RoZXJIdW1hbm9pZHNbaV07fVxuICAgIH1cbiAgICByZXR1cm4gY2xvc2VzdEh1bWFub2lkO1xuICB9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gQm9hcmQ7XG4iLCJsZXQgQm9hcmQsIEh1bWFub2lkQnVpbGRlciwgZ2FtZVNldHRpbmdzO1xuQm9hcmQgPSByZXF1aXJlKCdib2FyZCcpO1xuSHVtYW5vaWRCdWlsZGVyID0gcmVxdWlyZSgnaHVtYW5vaWRGYWN0b3J5Jyk7XG5nYW1lU2V0dGluZ3MgPSByZXF1aXJlKCdzZXR0aW5ncycpO1xuXG5jbGFzcyBHYW1lT2ZBZnRlcmxpZmUge1xuICBjb25zdHJ1Y3Rvcigpe1xuICAgIGxldCBjYW52YXMsIGFsbEh1bWFub2lkcztcbiAgICBjYW52YXMgPSBkb2N1bWVudC5nZXRFbGVtZW50c0J5VGFnTmFtZSgnY2FudmFzJylbMF07XG4gICAgYWxsSHVtYW5vaWRzID0gSHVtYW5vaWRCdWlsZGVyLnBvcHVsYXRlKGdhbWVTZXR0aW5ncy5odW1hbkNvdW50ICwgZ2FtZVNldHRpbmdzLnpvbWJpZUNvdW50KTtcbiAgICB0aGlzLmhhc0JlZ3VuID0gZmFsc2U7XG4gICAgdGhpcy53aWR0aCA9IGNhbnZhcy53aWR0aDtcbiAgICB0aGlzLmhlaWdodCA9IGNhbnZhcy5oZWlnaHQ7XG4gICAgdGhpcy5jdHggPSBjYW52YXMuZ2V0Q29udGV4dCgnMmQnKTtcbiAgICB0aGlzLmJvYXJkID0gbmV3IEJvYXJkKHtodW1hbm9pZHM6IGFsbEh1bWFub2lkcywgd2lkdGg6IHRoaXMud2lkdGgsIGhlaWdodDogdGhpcy5oZWlnaHR9KTtcbiAgICB0aGlzLmh1bWFub2lkQ29sb3JNYXAgPSB7XG4gICAgICBIdW1hbjogJyMwMGFhYWEnLFxuICAgICAgWm9tYmllOiAnI2ZmMDAwMCcsXG4gICAgICBQbGF5ZXI6ICcjMDBjYzAwJyxcbiAgICAgIEluZmVjdGVkSHVtYW46ICcjNzcwMDAwJ1xuICAgIH07XG4gIH1cblxuICBiaW5kUGxheWVyTW92ZW1lbnQoKXtcbiAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdrZXl1cCcsIChlKSA9PntcbiAgICAgIC8vIHMgPSA4M1xuICAgICAgLy8gdyA9IDg3XG4gICAgICAvLyBhID0gNjVcbiAgICAgIC8vIGQgPSA2OFxuICAgICAgaWYgKGUud2hpY2ggPT09IDY4IHx8IGUud2hpY2ggPT09IDY1KXsgdGhpcy5ib2FyZC5keCA9IDA7IH1cbiAgICAgIGlmIChlLndoaWNoID09PSA4MyB8fCBlLndoaWNoID09PSA4Nyl7IHRoaXMuYm9hcmQuZHkgPSAwOyB9XG4gICAgfSk7XG5cbiAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdrZXlkb3duJywgKGUpID0+e1xuICAgICAgaWYgKGUud2hpY2ggPT09IDY1KXsgdGhpcy5ib2FyZC5keCA9IC0xOyB9XG4gICAgICBlbHNlIGlmIChlLndoaWNoID09PSA2OCl7IHRoaXMuYm9hcmQuZHggPSAxOyB9XG4gICAgICBlbHNlIGlmIChlLndoaWNoID09PSA4Nyl7IHRoaXMuYm9hcmQuZHkgPSAtMTsgfVxuICAgICAgZWxzZSBpZiAoZS53aGljaCA9PT0gODMpeyB0aGlzLmJvYXJkLmR5ID0gMTsgfVxuICAgIH0pO1xuICB9XG5cblxuICBkcmF3SHVtYW5vaWRzKCl7XG4gICAgbGV0IHBsYXllciwgeCwgeTtcbiAgICB0aGlzLmN0eC5jbGVhclJlY3QoMCwwLHRoaXMud2lkdGgsdGhpcy5oZWlnaHQpO1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5ib2FyZC5odW1hbm9pZHMubGVuZ3RoOyBpKyspe1xuICAgICAgdGhpcy5jdHguYmVnaW5QYXRoKCk7XG4gICAgICBwbGF5ZXIgPSB0aGlzLmJvYXJkLmh1bWFub2lkc1tpXTtcbiAgICAgIHggPSBwbGF5ZXIucG9zaXRpb24ueDtcbiAgICAgIHkgPSBwbGF5ZXIucG9zaXRpb24ueTtcbiAgICAgIHRoaXMuY3R4LmFyYyh4LHksNSwwLDIqTWF0aC5QSSk7XG4gICAgICB0aGlzLmN0eC5maWxsU3R5bGUgPSB0aGlzLmh1bWFub2lkQ29sb3JNYXBbcGxheWVyLmh1bWFuVHlwZV07XG4gICAgICB0aGlzLmN0eC5maWxsKCk7XG4gICAgICB0aGlzLmN0eC5zdHJva2UoKTtcbiAgICB9XG4gIH1cblxuICBjYWxsTmV4dFR1cm4oKXtcbiAgICBsZXQgZGVsYXksIG5leHRSZXF1ZXN0O1xuICAgIG5leHRSZXF1ZXN0ID0gKCk9PiB7XG4gICAgICB0aGlzLmRyYXdIdW1hbm9pZHMoKTtcbiAgICAgIGlmICh0aGlzLmJvYXJkLmlzR2FtZUFjdGl2ZSgpKXtcbiAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3Njb3JlJykuaW5uZXJIVE1MID0gdGhpcy5ib2FyZC5zY29yZTtcbiAgICAgICAgdGhpcy5ib2FyZC5uZXh0VHVybigpO1xuICAgICAgICBkZWxheSA9ICh0aGlzLmJvYXJkLmlzUGxheWVyQWxpdmUoKSA/IGdhbWVTZXR0aW5ncy50dXJuRGVsYXkubm9ybWFsIDogZ2FtZVNldHRpbmdzLnR1cm5EZWxheS5mYXN0KTtcbiAgICAgICAgc2V0VGltZW91dChuZXh0UmVxdWVzdCwgZGVsYXkpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ292ZXJsYXktbWVzc2FnZScpXG4gICAgICAgIC5pbm5lckhUTUwgPSBgRVZFUllCT0RZIElTIERFQUQhISFcXG5Zb3VyIHNjb3JlIHdhczogJHt0aGlzLmJvYXJkLnNjb3JlfWA7XG4gICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdvdmVybGF5JykuY2xhc3NOYW1lID0gJyc7XG4gICAgICB9XG4gICAgfTtcbiAgICBzZXRUaW1lb3V0KG5leHRSZXF1ZXN0LCBnYW1lU2V0dGluZ3MudHVybkRlbGF5Lm5vcm1hbCk7XG4gIH1cblxuICBpbml0KCl7XG4gICAgdGhpcy5iaW5kUGxheWVyTW92ZW1lbnQoKTtcbiAgICB0aGlzLmNhbGxOZXh0VHVybigpO1xuICB9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gR2FtZU9mQWZ0ZXJsaWZlO1xuIiwibGV0IGdhbWVTZXR0aW5ncywgSHVtYW4sIFpvbWJpZSwgUGxheWVyO1xuZ2FtZVNldHRpbmdzID0gcmVxdWlyZSgnc2V0dGluZ3MnKTtcbkh1bWFuID0gcmVxdWlyZSgnaHVtYW5vaWRzL2h1bWFuJyk7XG5ab21iaWUgPSByZXF1aXJlKCdodW1hbm9pZHMvem9tYmllJyk7XG5QbGF5ZXIgPSByZXF1aXJlKCdodW1hbm9pZHMvcGxheWVyJyk7XG5cbmNsYXNzIEh1bWFub2lkQnVpbGRlciB7XG4gIHN0YXRpYyBodW1hbm9pZE1hcCgpe1xuICAgIHJldHVybiB7XG4gICAgICBIdW1hbixcbiAgICAgIFpvbWJpZSxcbiAgICAgIFBsYXllclxuICAgIH07XG4gIH1cblxuICBzdGF0aWMgcG9wdWxhdGUobnVtYmVyT2ZIdW1hbnMsIG51bWJlck9mWm9tYmllcyl7XG4gICAgbGV0IHBvcHVsYXRpb24gPSBbXTtcbiAgICBwb3B1bGF0aW9uID0gcG9wdWxhdGlvbi5jb25jYXQodGhpcy5jcmVhdGlvbihudW1iZXJPZkh1bWFucywgJ0h1bWFuJykpO1xuICAgIHBvcHVsYXRpb24gPSBwb3B1bGF0aW9uLmNvbmNhdChcbiAgICAgIHRoaXMuY3JlYXRpb24obnVtYmVyT2Zab21iaWVzLCAnWm9tYmllJywgcG9wdWxhdGlvbi5sZW5ndGgpXG4gICAgKTtcbiAgICBwb3B1bGF0aW9uID0gcG9wdWxhdGlvbi5jb25jYXQoXG4gICAgICB0aGlzLmNyZWF0aW9uKDEsICdQbGF5ZXInLCBwb3B1bGF0aW9uLmxlbmd0aClcbiAgICApO1xuICAgIHJldHVybiBwb3B1bGF0aW9uO1xuICB9XG5cbiAgc3RhdGljIGNyZWF0aW9uKG51bWJlciwgdHlwZSwgYmFzZUlkID0gMCl7XG4gICAgbGV0IHBvcHVsYXRpb24sIG5ld0h1bWFub2lkLCBtYXA7XG4gICAgbWFwID0gdGhpcy5odW1hbm9pZE1hcCgpO1xuICAgIHBvcHVsYXRpb24gPSBbXTtcbiAgICBmb3IobGV0IGkgPSAwOyBpIDwgbnVtYmVyOyBpKyspe1xuICAgICAgbGV0IEggPSBtYXBbdHlwZV07XG4gICAgICBuZXdIdW1hbm9pZCA9IG5ldyBIKHtpZDogYmFzZUlkICsgaX0pO1xuICAgICAgcG9wdWxhdGlvbi5wdXNoKG5ld0h1bWFub2lkKTtcbiAgICB9XG4gICAgcmV0dXJuIHBvcHVsYXRpb247XG4gIH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBIdW1hbm9pZEJ1aWxkZXI7XG4iLCJsZXQgUGF0aGZpbmRlciwgZ2FtZVNldHRpbmdzLCBIdW1hbm9pZCwgSW5mZWN0ZWRIdW1hbjtcblxuZ2FtZVNldHRpbmdzID0gcmVxdWlyZSgnc2V0dGluZ3MnKTtcblBhdGhmaW5kZXIgPSByZXF1aXJlKCdwYXRoZmluZGVyJyk7XG5IdW1hbm9pZCA9IHJlcXVpcmUoJ2h1bWFub2lkcy9odW1hbm9pZCcpO1xuSW5mZWN0ZWRIdW1hbiA9IHJlcXVpcmUoJ2h1bWFub2lkcy9pbmZlY3RlZEh1bWFuJyk7XG5cbmNsYXNzIEh1bWFuIGV4dGVuZHMgSHVtYW5vaWQge1xuICBjb25zdHJ1Y3RvcihvcHRzKSB7XG4gICAgc3VwZXIob3B0cyk7XG4gICAgdGhpcy5zcGVlZCA9IGdhbWVTZXR0aW5ncy5odW1hblNwZWVkO1xuICB9XG5cbiAgaXNBYmxlVG9CaXRlKCkge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIHRyYW5zZm9ybSgpIHtcbiAgICByZXR1cm4oXG4gICAgICBuZXcgSW5mZWN0ZWRIdW1hbih0aGlzLmNsb25lUHJvcHMoKSlcbiAgICApO1xuICB9XG5cbiAgaGFuZGxlTmV4dE1vdmUob3B0cyl7XG4gICAgbGV0IGRlc3RpbmF0aW9uO1xuICAgIGxldCB7IG5lYXJlc3RIdW1hbiwgbmVhcmVzdFpvbWJpZSwgcGxheWVyLCBodW1hbm9pZHMsIGdldFJlbGF0aXZlUG9zaXRpb259ID0gb3B0cztcbiAgICBkZXN0aW5hdGlvbiA9IGdldFJlbGF0aXZlUG9zaXRpb24oXG4gICAgICB0aGlzLmdldE5leHREZXN0aW5hdGlvbihuZWFyZXN0SHVtYW4sIG5lYXJlc3Rab21iaWUsIHBsYXllcilcbiAgICApO1xuICAgIGlmICggdGhpcy5pc1ZhbGlkRGVzdGluYXRpb24oaHVtYW5vaWRzLCBkZXN0aW5hdGlvbikgKSB7XG4gICAgICB0aGlzLnBvc2l0aW9uID0gZGVzdGluYXRpb247XG4gICAgfVxuICB9XG5cbiAgaXNWYWxpZERlc3RpbmF0aW9uKGh1bWFub2lkcywgdGFyZ2V0UG9zaXRpb24pIHtcbiAgICByZXR1cm4gIWh1bWFub2lkcy5zb21lKChodW1hbm9pZCkgPT4ge1xuICAgICAgcmV0dXJuIGh1bWFub2lkLnBvc2l0aW9uLnggPT09IHRhcmdldFBvc2l0aW9uLnggJiYgaHVtYW5vaWQucG9zaXRpb24ueSA9PT0gdGFyZ2V0UG9zaXRpb24ueTtcbiAgICB9KTtcbiAgfVxuXG4gIGdldE5leHREZXN0aW5hdGlvbihuZWFyZXN0SHVtYW4sIG5lYXJlc3Rab21iaWUsIHBsYXllcil7XG4gICAgbGV0IHBsYXllckRpc3RhbmNlLCBodW1hbkRpc3RhbmNlLCB6b21iaWVEaXN0YW5jZTtcbiAgICBwbGF5ZXJEaXN0YW5jZSA9IE51bWJlci5QT1NJVElWRV9JTkZJTklUWTtcbiAgICBodW1hbkRpc3RhbmNlID0gTnVtYmVyLlBPU0lUSVZFX0lORklOSVRZO1xuICAgIHpvbWJpZURpc3RhbmNlID0gUGF0aGZpbmRlci5kaXN0YW5jZVRvKCBuZWFyZXN0Wm9tYmllLnBvc2l0aW9uLCB0aGlzLnBvc2l0aW9uICk7XG4gICAgaWYgKHBsYXllcil7XG4gICAgICBwbGF5ZXJEaXN0YW5jZSA9IFBhdGhmaW5kZXIuZGlzdGFuY2VUbyggcGxheWVyLnBvc2l0aW9uLCB0aGlzLnBvc2l0aW9uICk7XG4gICAgfVxuICAgIGlmIChuZWFyZXN0SHVtYW4pe1xuICAgICAgaHVtYW5EaXN0YW5jZSA9IFBhdGhmaW5kZXIuZGlzdGFuY2VUbyggbmVhcmVzdEh1bWFuLnBvc2l0aW9uLCB0aGlzLnBvc2l0aW9uICk7XG4gICAgfVxuXG4gICAgaWYgKCB6b21iaWVEaXN0YW5jZSA8IGdhbWVTZXR0aW5ncy5odW1hbkZlYXJSYW5nZSB8fCAoICFwbGF5ZXIgJiYgIW5lYXJlc3RIdW1hbiApICl7XG4gICAgICByZXR1cm4gdGhpcy5tb3ZlTmVhcmVzdCggbmVhcmVzdFpvbWJpZSApO1xuICAgIH0gZWxzZSBpZiAoIHBsYXllckRpc3RhbmNlIDwgaHVtYW5EaXN0YW5jZSApe1xuICAgICAgcmV0dXJuIHRoaXMubW92ZU5lYXJlc3QoIHBsYXllciApO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gdGhpcy5tb3ZlTmVhcmVzdCggbmVhcmVzdEh1bWFuICk7XG4gICAgfVxuICB9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gSHVtYW47XG4iLCJsZXQgUGF0aGZpbmRlciwgZ2FtZVNldHRpbmdzO1xuXG5QYXRoZmluZGVyID0gcmVxdWlyZSgncGF0aGZpbmRlcicpO1xuZ2FtZVNldHRpbmdzID0gcmVxdWlyZSgnc2V0dGluZ3MnKTtcblxuY2xhc3MgSHVtYW5vaWQge1xuICBjb25zdHJ1Y3RvcihhdHRyaWJ1dGVzKXtcbiAgICB0aGlzLmlkID0gYXR0cmlidXRlcy5pZDtcbiAgICB0aGlzLnBvc2l0aW9uID0gYXR0cmlidXRlcy5wb3NpdGlvbiB8fFxuICAgICAgeyB4OiAoNSsgTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpKjU5MSkpLCB5OiAoNSsgTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpKjM5MSkpIH07XG4gICAgdGhpcy5sYXN0UG9zaXRpb24gPSB7IHg6IHRoaXMucG9zaXRpb24ueCwgeTogdGhpcy5wb3NpdGlvbi55IH07XG4gICAgdGhpcy5odW1hblR5cGUgPSB0aGlzLmNvbnN0cnVjdG9yLm5hbWU7XG4gIH1cblxuICBpc1pvbWJpZSgpe1xuICAgIHJldHVybiB0aGlzLmh1bWFuVHlwZSA9PT0gJ1pvbWJpZSc7XG4gIH1cblxuICBpc1BsYXllcigpe1xuICAgIHJldHVybiB0aGlzLmh1bWFuVHlwZSA9PT0gJ1BsYXllcic7XG4gIH1cblxuICBpc0h1bWFuKCl7XG4gICAgcmV0dXJuIHRoaXMuaHVtYW5UeXBlID09PSAnSHVtYW4nO1xuICB9XG5cbiAgY2xvbmVQcm9wcygpIHtcbiAgICByZXR1cm4ge1xuICAgICAgaWQ6IHRoaXMuaWQsXG4gICAgICBwb3NpdGlvbjogdGhpcy5wb3NpdGlvbixcbiAgICAgIGxhc3RQb3NpdGlvbjogdGhpcy5sYXN0UG9zaXRpb25cbiAgICB9O1xuICB9XG5cbiAgaXNBdHRyYWN0ZWRUbyhuZWFyZXN0SHVtYW5vaWQpe1xuICAgIHJldHVybiBuZWFyZXN0SHVtYW5vaWQuaXNQbGF5ZXIoKSB8fCBuZWFyZXN0SHVtYW5vaWQuaXNIdW1hbigpO1xuICB9XG5cbiAgc3RvcmVMYXN0UG9zaXRpb24oKXtcbiAgICB0aGlzLmxhc3RQb3NpdGlvbiA9IHt4OiB0aGlzLnBvc2l0aW9uLngsIHk6IHRoaXMucG9zaXRpb24ueX07XG4gIH1cblxuICBpc0xhc3RNb3ZlUmVwZWF0ZWQocG90ZW50aWFsTW92ZSl7XG4gICAgcmV0dXJuIChcbiAgICAgIChNYXRoLmFicyhwb3RlbnRpYWxNb3ZlLnggLSB0aGlzLmxhc3RQb3NpdGlvbi54KSA8IGdhbWVTZXR0aW5ncy5yZXBpdGlvblRvbGVyYW5jZSkgJiZcbiAgICAgICAgKE1hdGguYWJzKHBvdGVudGlhbE1vdmUueSAtIHRoaXMubGFzdFBvc2l0aW9uLnkpIDwgZ2FtZVNldHRpbmdzLnJlcGl0aW9uVG9sZXJhbmNlKVxuICAgICk7XG4gIH1cblxuICBtb3ZlTmVhcmVzdChuZWFyZXN0T2JqZWN0KXtcbiAgICBsZXQgcG90ZW50aWFsTW92ZTtcbiAgICBpZiAodGhpcy5pc0F0dHJhY3RlZFRvKG5lYXJlc3RPYmplY3QpKXtcbiAgICAgIHBvdGVudGlhbE1vdmUgPSBQYXRoZmluZGVyLm1vdmVUb3dhcmRzKHRoaXMucG9zaXRpb24sIG5lYXJlc3RPYmplY3QucG9zaXRpb24sIHRoaXMuc3BlZWQpO1xuICAgIH0gZWxzZSB7XG4gICAgICBwb3RlbnRpYWxNb3ZlID0gUGF0aGZpbmRlci5tb3ZlQXdheUZyb20odGhpcy5wb3NpdGlvbiwgbmVhcmVzdE9iamVjdC5wb3NpdGlvbiwgdGhpcy5zcGVlZCk7XG4gICAgfVxuICAgIGlmICh0aGlzLmxhc3RQb3NpdGlvbi54ID09PSB0aGlzLnBvc2l0aW9uLnggJiYgdGhpcy5sYXN0UG9zaXRpb24ueSA9PT0gdGhpcy5wb3NpdGlvbi55KXtcbiAgICAgIHRoaXMuc3RvcmVMYXN0UG9zaXRpb24oKTtcbiAgICAgIHJldHVybiBQYXRoZmluZGVyLm1vdmVSYW5kb21seSh0aGlzLnBvc2l0aW9uLCB0aGlzLnNwZWVkKTtcbiAgICB9IGVsc2UgaWYgKHRoaXMuaXNMYXN0TW92ZVJlcGVhdGVkKHBvdGVudGlhbE1vdmUpKXtcbiAgICAgIHRoaXMuc3RvcmVMYXN0UG9zaXRpb24oKTtcbiAgICAgIHJldHVybiBQYXRoZmluZGVyLm1vdmVQZXJwZW5kaWN1bGFyVG8odGhpcy5wb3NpdGlvbiwgbmVhcmVzdE9iamVjdC5wb3NpdGlvbiwgdGhpcy5zcGVlZCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuc3RvcmVMYXN0UG9zaXRpb24oKTtcbiAgICAgIHJldHVybiBwb3RlbnRpYWxNb3ZlO1xuICAgIH1cbiAgfVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IEh1bWFub2lkO1xuIiwibGV0IFBhdGhmaW5kZXIsIGdhbWVTZXR0aW5ncywgSHVtYW5vaWQsIFpvbWJpZTtcblxuZ2FtZVNldHRpbmdzID0gcmVxdWlyZSgnc2V0dGluZ3MnKTtcblBhdGhmaW5kZXIgPSByZXF1aXJlKCdwYXRoZmluZGVyJyk7XG5IdW1hbm9pZCA9IHJlcXVpcmUoJ2h1bWFub2lkcy9odW1hbm9pZCcpO1xuWm9tYmllID0gcmVxdWlyZSgnaHVtYW5vaWRzL3pvbWJpZScpO1xuXG5jbGFzcyBJbmZlY3RlZEh1bWFuIGV4dGVuZHMgSHVtYW5vaWQge1xuICBjb25zdHJ1Y3RvcihvcHRzKSB7XG4gICAgc3VwZXIob3B0cyk7XG4gICAgdGhpcy5zcGVlZCA9IDA7XG4gICAgdGhpcy50aW1lU2luY2VJbmZlY3Rpb24gPSAwO1xuICB9XG5cbiAgaXNBYmxlVG9CaXRlKCl7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgdHJhbnNmb3JtKCkge1xuICAgIHJldHVybihcbiAgICAgIG5ldyBab21iaWUodGhpcy5jbG9uZVByb3BzKCkpXG4gICAgKTtcbiAgfVxuXG4gIGluY3JlbWVudFRpbWVTaW5jZUluZmVjdGlvbigpe1xuICAgIHRoaXMudGltZVNpbmNlSW5mZWN0aW9uKys7XG4gIH1cblxuICBoYW5kbGVOZXh0TW92ZShvcHRzKXtcbiAgICBsZXQgeyBodW1hbm9pZHMgfSA9IG9wdHM7XG4gICAgdGhpcy5pbmNyZW1lbnRUaW1lU2luY2VJbmZlY3Rpb24oKTtcbiAgICBpZiAodGhpcy50aW1lU2luY2VJbmZlY3Rpb24gPj0gNSl7XG4gICAgICBodW1hbm9pZHNbdGhpcy5pZF0gPSB0aGlzLnRyYW5zZm9ybSgpO1xuICAgIH1cbiAgfVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IEluZmVjdGVkSHVtYW47XG4iLCJsZXQgUGF0aGZpbmRlciwgZ2FtZVNldHRpbmdzLCBIdW1hbm9pZCwgSW5mZWN0ZWRIdW1hbjtcblxuZ2FtZVNldHRpbmdzID0gcmVxdWlyZSgnc2V0dGluZ3MnKTtcblBhdGhmaW5kZXIgPSByZXF1aXJlKCdwYXRoZmluZGVyJyk7XG5IdW1hbm9pZCA9IHJlcXVpcmUoJ2h1bWFub2lkcy9odW1hbm9pZCcpO1xuSW5mZWN0ZWRIdW1hbiA9IHJlcXVpcmUoJ2h1bWFub2lkcy9pbmZlY3RlZEh1bWFuJyk7XG5cbmNsYXNzIFBsYXllciBleHRlbmRzIEh1bWFub2lkIHtcbiAgY29uc3RydWN0b3Iob3B0cykge1xuICAgIHN1cGVyKG9wdHMpO1xuICAgIHRoaXMuc3BlZWQgPSBnYW1lU2V0dGluZ3MucGxheWVyU3BlZWQ7XG4gIH1cblxuICBpc0FibGVUb0JpdGUoKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgdHJhbnNmb3JtKCkge1xuICAgIHJldHVybihcbiAgICAgIG5ldyBJbmZlY3RlZEh1bWFuKHRoaXMuY2xvbmVQcm9wcygpKVxuICAgICk7XG4gIH1cblxuICBoYW5kbGVOZXh0TW92ZShvcHRzKXtcbiAgICBsZXQgdGFyZ2V0TG9jLCBjb29yZHM7XG4gICAgbGV0IHsgZHgsIGR5LCBnZXRSZWxhdGl2ZVBvc2l0aW9uIH0gPSBvcHRzO1xuICAgIHRhcmdldExvYyA9IHtcbiAgICAgIHg6IHRoaXMucG9zaXRpb24ueCArIGR4KnRoaXMuc3BlZWQsXG4gICAgICB5OiB0aGlzLnBvc2l0aW9uLnkgKyBkeSp0aGlzLnNwZWVkXG4gICAgfTtcbiAgICBjb29yZHMgPSAoIFBhdGhmaW5kZXIubW92ZVRvd2FyZHModGhpcy5wb3NpdGlvbiwgdGFyZ2V0TG9jLCB0aGlzLnNwZWVkKSApO1xuICAgIHRoaXMucG9zaXRpb24gPSBnZXRSZWxhdGl2ZVBvc2l0aW9uKGNvb3Jkcyk7XG4gIH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBQbGF5ZXI7XG5cbiIsImxldCBQYXRoZmluZGVyLCBnYW1lU2V0dGluZ3MsIEh1bWFub2lkLCBJbmZlY3RlZEh1bWFuO1xuXG5nYW1lU2V0dGluZ3MgPSByZXF1aXJlKCdzZXR0aW5ncycpO1xuUGF0aGZpbmRlciA9IHJlcXVpcmUoJ3BhdGhmaW5kZXInKTtcbkh1bWFub2lkID0gcmVxdWlyZSgnaHVtYW5vaWRzL2h1bWFub2lkJyk7XG5JbmZlY3RlZEh1bWFuID0gcmVxdWlyZSgnaHVtYW5vaWRzL2luZmVjdGVkSHVtYW4nKTtcblxuY2xhc3MgWm9tYmllIGV4dGVuZHMgSHVtYW5vaWQge1xuICBjb25zdHJ1Y3RvcihvcHRzKSB7XG4gICAgc3VwZXIob3B0cyk7XG4gICAgdGhpcy5zcGVlZCA9IGdhbWVTZXR0aW5ncy56b21iaWVTcGVlZDtcbiAgfVxuXG4gIGlzQWJsZVRvQml0ZShodW1hbil7XG4gICAgcmV0dXJuIChcbiAgICAgIGh1bWFuICYmIFBhdGhmaW5kZXIuZGlzdGFuY2VUbyggaHVtYW4ucG9zaXRpb24sIHRoaXMucG9zaXRpb24gKSA8IGdhbWVTZXR0aW5ncy56b21iaWVCaXRlUmFuZ2VcbiAgICApO1xuICB9XG5cbiAgdHJhbnNmb3JtKCkge1xuICAgIHJldHVybih0aGlzKTtcbiAgfVxuXG4gIGlzVmFsaWREZXN0aW5hdGlvbihodW1hbm9pZHMsIHRhcmdldFBvc2l0aW9uKSB7XG4gICAgcmV0dXJuICFodW1hbm9pZHMuc29tZSgoaHVtYW5vaWQpID0+IHtcbiAgICAgIHJldHVybiBodW1hbm9pZC5wb3NpdGlvbi54ID09PSB0YXJnZXRQb3NpdGlvbi54ICYmIGh1bWFub2lkLnBvc2l0aW9uLnkgPT09IHRhcmdldFBvc2l0aW9uLnk7XG4gICAgfSk7XG4gIH1cblxuICBnZXROZXh0RGVzdGluYXRpb24obmVhcmVzdEh1bWFuLCBuZWFyZXN0Wm9tYmllLCBwbGF5ZXIpe1xuICAgIGxldCBwbGF5ZXJEaXN0YW5jZSwgaHVtYW5EaXN0YW5jZSwgem9tYmllRGlzdGFuY2U7XG4gICAgcGxheWVyRGlzdGFuY2UgPSBOdW1iZXIuUE9TSVRJVkVfSU5GSU5JVFk7XG4gICAgaHVtYW5EaXN0YW5jZSA9IE51bWJlci5QT1NJVElWRV9JTkZJTklUWTtcbiAgICB6b21iaWVEaXN0YW5jZSA9IE51bWJlci5QT1NJVElWRV9JTkZJTklUWTtcbiAgICBpZiAobmVhcmVzdFpvbWJpZSl7XG4gICAgICB6b21iaWVEaXN0YW5jZSA9IChcbiAgICAgICAgUGF0aGZpbmRlci5kaXN0YW5jZVRvKCBuZWFyZXN0Wm9tYmllLnBvc2l0aW9uLCB0aGlzLnBvc2l0aW9uICkgKlxuICAgICAgICBnYW1lU2V0dGluZ3Muem9tYmllU3ByZWFkXG4gICAgICApO1xuICAgIH1cbiAgICBpZiAocGxheWVyKXtcbiAgICAgIHBsYXllckRpc3RhbmNlID0gUGF0aGZpbmRlci5kaXN0YW5jZVRvKCBwbGF5ZXIucG9zaXRpb24sIHRoaXMucG9zaXRpb24gKTtcbiAgICB9XG4gICAgaWYgKG5lYXJlc3RIdW1hbil7XG4gICAgICBodW1hbkRpc3RhbmNlID0gUGF0aGZpbmRlci5kaXN0YW5jZVRvKCBuZWFyZXN0SHVtYW4ucG9zaXRpb24sIHRoaXMucG9zaXRpb24gKTtcbiAgICB9XG5cbiAgICBpZiAoIHBsYXllckRpc3RhbmNlIDwgaHVtYW5EaXN0YW5jZSApe1xuICAgICAgaWYgKCBwbGF5ZXJEaXN0YW5jZSA8IHpvbWJpZURpc3RhbmNlICl7XG4gICAgICAgIHJldHVybiB0aGlzLm1vdmVOZWFyZXN0KCBwbGF5ZXIgKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiB0aGlzLm1vdmVOZWFyZXN0KCBuZWFyZXN0Wm9tYmllICk7XG4gICAgICB9XG4gICAgfSBlbHNlIGlmICggaHVtYW5EaXN0YW5jZSA8IHpvbWJpZURpc3RhbmNlICl7XG4gICAgICByZXR1cm4gdGhpcy5tb3ZlTmVhcmVzdCggbmVhcmVzdEh1bWFuICk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiB0aGlzLm1vdmVOZWFyZXN0KCBuZWFyZXN0Wm9tYmllICk7XG4gICAgfVxuICB9XG5cbiAgaGFuZGxlTmV4dE1vdmUob3B0cyl7XG4gICAgbGV0IGRlc3RpbmF0aW9uO1xuICAgIGxldCB7IG5lYXJlc3RIdW1hbiwgbmVhcmVzdFpvbWJpZSwgcGxheWVyLCBodW1hbm9pZHMsIGdldFJlbGF0aXZlUG9zaXRpb259ID0gb3B0cztcbiAgICBpZiAoIHRoaXMuaXNBYmxlVG9CaXRlKCBwbGF5ZXIgKSApe1xuICAgICAgaHVtYW5vaWRzW3BsYXllci5pZF0gPSBwbGF5ZXIudHJhbnNmb3JtKCk7XG4gICAgfVxuICAgIGlmICggdGhpcy5pc0FibGVUb0JpdGUoIG5lYXJlc3RIdW1hbiApICl7XG4gICAgICBodW1hbm9pZHNbbmVhcmVzdEh1bWFuLmlkXSA9IG5lYXJlc3RIdW1hbi50cmFuc2Zvcm0oKTtcbiAgICB9XG4gICAgZGVzdGluYXRpb24gPSBnZXRSZWxhdGl2ZVBvc2l0aW9uKFxuICAgICAgdGhpcy5nZXROZXh0RGVzdGluYXRpb24obmVhcmVzdEh1bWFuLCBuZWFyZXN0Wm9tYmllLCBwbGF5ZXIpXG4gICAgKTtcbiAgICBpZiAoIHRoaXMuaXNWYWxpZERlc3RpbmF0aW9uKGh1bWFub2lkcywgZGVzdGluYXRpb24pICkge1xuICAgICAgdGhpcy5wb3NpdGlvbiA9IGRlc3RpbmF0aW9uO1xuICAgIH1cbiAgfVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IFpvbWJpZTtcbiIsImxldCBHYW1lT2ZBZnRlcmxpZmUsIGdhbWVPZkFmdGVybGlmZTtcbkdhbWVPZkFmdGVybGlmZSA9IHJlcXVpcmUoJ2dhbWUnKTtcblxuZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2luaXRpYWxpemUtZ2FtZScpLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZnVuY3Rpb24oZSl7XG4gICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ292ZXJsYXknKS5jbGFzc05hbWUgPSAnaGlkZSc7XG4gICAgZ2FtZU9mQWZ0ZXJsaWZlID0gbmV3IEdhbWVPZkFmdGVybGlmZSgpO1xuICAgIGdhbWVPZkFmdGVybGlmZS5pbml0KCk7XG59KTtcbiIsImNsYXNzIFBhdGhmaW5kZXIge1xuICBzdGF0aWMgbW92ZVRvd2FyZHMoY3VycmVudFBvc2l0aW9uLCBmcmllbmRseUxvY2F0aW9uLCBzcGVlZCl7XG4gICAgbGV0IGRlbHRhWSwgZGVsdGFYLCBsZW5ndGg7XG4gICAgZGVsdGFZID0gZnJpZW5kbHlMb2NhdGlvbi55IC0gY3VycmVudFBvc2l0aW9uLnk7XG4gICAgZGVsdGFYID0gZnJpZW5kbHlMb2NhdGlvbi54IC0gY3VycmVudFBvc2l0aW9uLng7XG4gICAgbGVuZ3RoID0gdGhpcy5kaXN0YW5jZVRvKGZyaWVuZGx5TG9jYXRpb24sIGN1cnJlbnRQb3NpdGlvbik7XG4gICAgaWYgKHNwZWVkICE9PSAwICYmIGxlbmd0aCA8IHNwZWVkKXtcbiAgICAgIHJldHVybiBmcmllbmRseUxvY2F0aW9uO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4ge1xuICAgICAgICB4OiAoY3VycmVudFBvc2l0aW9uLnggKyAoZGVsdGFYIC8gbGVuZ3RoICogc3BlZWQpKSxcbiAgICAgICAgeTogKGN1cnJlbnRQb3NpdGlvbi55ICsgKGRlbHRhWSAvIGxlbmd0aCAqIHNwZWVkKSlcbiAgICAgIH07XG4gICAgfVxuICB9XG5cbiAgc3RhdGljIG1vdmVBd2F5RnJvbShjdXJyZW50UG9zaXRpb24sIGhvc3RpbGVMb2NhdGlvbiwgc3BlZWQpe1xuICAgIHJldHVybiB0aGlzLm1vdmVUb3dhcmRzKGN1cnJlbnRQb3NpdGlvbiwgaG9zdGlsZUxvY2F0aW9uLCAtc3BlZWQpO1xuICB9XG5cbiAgc3RhdGljIG1vdmVQZXJwZW5kaWN1bGFyVG8oY3VycmVudFBvc2l0aW9uLCBmcmllbmRseUxvY2F0aW9uLCBzcGVlZCl7XG4gICAgbGV0IGRlbHRhWSwgZGVsdGFYLCBsZW5ndGg7XG4gICAgZGVsdGFZID0gZnJpZW5kbHlMb2NhdGlvbi55IC0gY3VycmVudFBvc2l0aW9uLnk7XG4gICAgZGVsdGFYID0gZnJpZW5kbHlMb2NhdGlvbi54IC0gY3VycmVudFBvc2l0aW9uLng7XG4gICAgbGVuZ3RoID0gdGhpcy5kaXN0YW5jZVRvKGZyaWVuZGx5TG9jYXRpb24sIGN1cnJlbnRQb3NpdGlvbik7XG4gICAgaWYgKHNwZWVkICE9PSAwICYmIGxlbmd0aCA8IHNwZWVkKXtcbiAgICAgIHJldHVybiBmcmllbmRseUxvY2F0aW9uO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4ge1xuICAgICAgICB4OiAoY3VycmVudFBvc2l0aW9uLnggKyAoZGVsdGFYIC8gbGVuZ3RoICogc3BlZWQpKSxcbiAgICAgICAgeTogKGN1cnJlbnRQb3NpdGlvbi55IC0gKGRlbHRhWSAvIGxlbmd0aCAqIHNwZWVkKSlcbiAgICAgIH07XG4gICAgfVxuICB9XG5cbiAgc3RhdGljIGRpc3RhbmNlVG8odGFyZ2V0TG9jYXRpb24sIGN1cnJlbnRQb3NpdGlvbil7XG4gICAgbGV0IGRlbHRhWSwgZGVsdGFYO1xuICAgIGRlbHRhWSA9IHRhcmdldExvY2F0aW9uLnkgLSBjdXJyZW50UG9zaXRpb24ueTtcbiAgICBkZWx0YVggPSB0YXJnZXRMb2NhdGlvbi54IC0gY3VycmVudFBvc2l0aW9uLng7XG4gICAgcmV0dXJuIE1hdGguc3FydChNYXRoLnBvdyhkZWx0YVksMikgKyBNYXRoLnBvdyhkZWx0YVgsMikpO1xuICB9XG5cbiAgc3RhdGljIG1vdmVSYW5kb21seShjdXJyZW50UG9zaXRpb24sIHNwZWVkKXtcbiAgICBsZXQgYW5nbGU7XG4gICAgYW5nbGUgPSBNYXRoLnJhbmRvbSgpICogMiAqIE1hdGguUEk7XG4gICAgcmV0dXJuIHtcbiAgICAgIHg6IChjdXJyZW50UG9zaXRpb24ueCArIE1hdGguY29zKGFuZ2xlKSAqIHNwZWVkKSxcbiAgICAgIHk6IChjdXJyZW50UG9zaXRpb24ueSArIE1hdGguc2luKGFuZ2xlKSAqIHNwZWVkKVxuICAgIH07XG4gIH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBQYXRoZmluZGVyO1xuIiwibGV0IGdhbWVTZXR0aW5ncyA9IHtcbiAgaHVtYW5TcGVlZDogNyxcbiAgcGxheWVyU3BlZWQ6IDYsXG4gIHpvbWJpZVNwZWVkOiA0LFxuICBodW1hbkNvdW50OiAzMCxcbiAgem9tYmllQ291bnQ6IDMsXG4gIHR1cm5EZWxheTogeyBub3JtYWw6IDEwMCwgZmFzdDogMjUgfSwgLy8gc2V0cyB0aGUgdGltZW91dCBiZXR3ZWVuIHR1cm5zXG4gIHJlcGl0aW9uVG9sZXJhbmNlOiAxLCAvLyB0aGUgcmFuZ2UgaW4gd2hpY2ggYSBtb3ZlIGlzIGNvbnNpZGVyZWQgcmVwZXRpdGl2ZVxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gbG93ZXIgdmFsdWVzIHdpbGwgcmVkdWNlIHRoZSBzaXplIG9mIHRoZSByYW5nZS5cbiAgem9tYmllU3ByZWFkOiAzLCAvLyBsb3dlciB6b21iaWVTcHJlYWQgdmFsdWVzIHdpbGwgY2F1c2Ugem9tYmllcyB0byBzcHJlYWQgb3V0IG1vcmVcbiAgaHVtYW5GZWFyUmFuZ2U6IDIwLCAvLyB0aGUgcmFuZ2UgYXQgd2hpY2ggaHVtYW5zIHN0YXJ0IHJ1bm5pbmcgZnJvbSB6b21iaWVzLlxuICB6b21iaWVCaXRlUmFuZ2U6IDEwLCAvLyB0aGUgcmFuZ2UgYXQgd2hpY2ggYSB6b21iaWUgY2FuIGJpdGUgYSBodW1hbi5cbn07XG5cbm1vZHVsZS5leHBvcnRzID0gZ2FtZVNldHRpbmdzO1xuIl19
