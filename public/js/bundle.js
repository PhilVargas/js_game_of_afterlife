(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({"/Users/philipavargas/Desktop/js_game_of_afterlife/public/js/game/board.js":[function(require,module,exports){
'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var Pathfinder = undefined;

Pathfinder = require('pathfinder');

var Board = (function () {
  function Board(attributes) {
    _classCallCheck(this, Board);

    this.humanoid = null;
    this.score = 0;
    this.dx = 0;
    this.dy = 0;
    this.humanoids = attributes.humanoids || [];
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
    key: 'nearestLivingHumanoid',
    value: function nearestLivingHumanoid() {
      var livingHumanoids = undefined,
          closestPos = undefined,
          closestHumanoid = undefined;

      livingHumanoids = this.findSimilarHumanoids('Player').concat(this.findSimilarHumanoids('Human'));
      closestPos = this.findClosestPos(livingHumanoids);
      closestHumanoid = this.findClosestHumanoid(closestPos, livingHumanoids);
      return closestHumanoid;
    }
  }, {
    key: 'nearestZombie',
    value: function nearestZombie() {
      var similarHumanoids = undefined,
          closestPos = undefined,
          closestHumanoid = undefined;

      similarHumanoids = this.findSimilarHumanoids('Zombie');
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
          nearestHumanoid: this.nearestLivingHumanoid(),
          nearestZombie: this.nearestZombie(),
          dx: this.dx,
          dy: this.dy,
          humanoids: this.humanoids
        });
      }
      this.incrementScore();
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
      var _this = this;

      return this.humanoids.filter(function (currentHumanoid) {
        return _this.humanoid.id !== currentHumanoid.id;
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

},{"pathfinder":"/Users/philipavargas/Desktop/js_game_of_afterlife/public/js/game/pathfinder.js"}],"/Users/philipavargas/Desktop/js_game_of_afterlife/public/js/game/game.js":[function(require,module,exports){
'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var Board = undefined,
    HumanoidBuilder = undefined,
    Settings = undefined;

Board = require('board');
HumanoidBuilder = require('humanoidFactory');
Settings = require('settings');

var GameOfAfterlife = (function () {
  function GameOfAfterlife() {
    _classCallCheck(this, GameOfAfterlife);

    var canvas = undefined,
        allHumanoids = undefined;

    canvas = document.getElementsByTagName('canvas')[0];
    allHumanoids = HumanoidBuilder.populate(Settings.humanCount, Settings.zombieCount);
    this.hasBegun = false;
    this.width = canvas.width;
    this.height = canvas.height;
    this.ctx = canvas.getContext('2d');
    this.board = new Board({ humanoids: allHumanoids });
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
          delay = _this2.board.isPlayerAlive() ? Settings.turnDelay.normal : Settings.turnDelay.fast;
          setTimeout(nextRequest, delay);
        } else {
          document.getElementById('overlay-message').innerHTML = 'EVERYBODY IS DEAD!!!\nYour score was: ' + _this2.board.score;
          document.getElementById('overlay').className = '';
        }
      };
      setTimeout(nextRequest, Settings.turnDelay.normal);
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

var Human = undefined,
    Zombie = undefined,
    Player = undefined;

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
      var population = undefined;

      population = [];
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
          map = undefined,
          H = undefined;

      map = this.humanoidMap();
      population = [];
      for (var i = 0; i < number; i++) {
        H = map[type];
        newHumanoid = new H({ id: baseId + i });
        population.push(newHumanoid);
      }
      return population;
    }
  }]);

  return HumanoidBuilder;
})();

module.exports = HumanoidBuilder;

},{"humanoids/human":"/Users/philipavargas/Desktop/js_game_of_afterlife/public/js/game/humanoids/human.js","humanoids/player":"/Users/philipavargas/Desktop/js_game_of_afterlife/public/js/game/humanoids/player.js","humanoids/zombie":"/Users/philipavargas/Desktop/js_game_of_afterlife/public/js/game/humanoids/zombie.js"}],"/Users/philipavargas/Desktop/js_game_of_afterlife/public/js/game/humanoids/human.js":[function(require,module,exports){
'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Pathfinder = undefined,
    Settings = undefined,
    Humanoid = undefined,
    InfectedHuman = undefined;

Settings = require('settings');
Pathfinder = require('pathfinder');
Humanoid = require('humanoids/humanoid');
InfectedHuman = require('humanoids/infectedHuman');

var Human = (function (_Humanoid) {
  _inherits(Human, _Humanoid);

  function Human(opts) {
    _classCallCheck(this, Human);

    _get(Object.getPrototypeOf(Human.prototype), 'constructor', this).call(this, opts);
    this.speed = Settings.humanSpeed;
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
      var nearestHumanoid = opts.nearestHumanoid;
      var nearestZombie = opts.nearestZombie;
      var humanoids = opts.humanoids;

      destination = Pathfinder.getRelativePosition(this.getNextDestination(nearestHumanoid, nearestZombie));
      if (this.isValidDestination(humanoids, destination)) {
        this.position = destination;
      }
    }
  }, {
    key: 'isValidDestination',
    value: function isValidDestination(humanoids, targetPosition) {
      return !humanoids.some(function (humanoid) {
        return Pathfinder.arePositionsEqual(humanoid.position, targetPosition);
      });
    }
  }, {
    key: 'getNextDestination',
    value: function getNextDestination(nearestHumanoid, nearestZombie) {
      if (this.isZombieNearest(nearestZombie, nearestHumanoid)) {
        return this.moveNearest(nearestZombie);
      } else {
        return this.moveNearest(nearestHumanoid);
      }
    }
  }, {
    key: 'isZombieNearest',
    value: function isZombieNearest(nearestZombie, nearestHumanoid) {
      var zombieDistance = undefined;

      if (nearestZombie) {
        zombieDistance = Pathfinder.distanceTo(nearestZombie.position, this.position);
      }

      // a zombie is within the human fear range, or there are no other living humanoids remaining
      return zombieDistance < Settings.humanFearRange || !nearestHumanoid;
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
    Settings = undefined;

Pathfinder = require('pathfinder');
Settings = require('settings');

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
      return Math.abs(potentialMove.x - this.lastPosition.x) < Settings.repitionTolerance && Math.abs(potentialMove.y - this.lastPosition.y) < Settings.repitionTolerance;
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

var Humanoid = undefined,
    Zombie = undefined,
    Settings = undefined;

Humanoid = require('humanoids/humanoid');
Zombie = require('humanoids/zombie');
Settings = require('settings');

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
      if (this.timeSinceInfection >= Settings.infectionIncubationTime) {
        humanoids[this.id] = this.transform();
      }
    }
  }]);

  return InfectedHuman;
})(Humanoid);

module.exports = InfectedHuman;

},{"humanoids/humanoid":"/Users/philipavargas/Desktop/js_game_of_afterlife/public/js/game/humanoids/humanoid.js","humanoids/zombie":"/Users/philipavargas/Desktop/js_game_of_afterlife/public/js/game/humanoids/zombie.js","settings":"/Users/philipavargas/Desktop/js_game_of_afterlife/public/js/game/settings.js"}],"/Users/philipavargas/Desktop/js_game_of_afterlife/public/js/game/humanoids/player.js":[function(require,module,exports){
'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Pathfinder = undefined,
    Settings = undefined,
    Humanoid = undefined,
    InfectedHuman = undefined;

Settings = require('settings');
Pathfinder = require('pathfinder');
Humanoid = require('humanoids/humanoid');
InfectedHuman = require('humanoids/infectedHuman');

var Player = (function (_Humanoid) {
  _inherits(Player, _Humanoid);

  function Player(opts) {
    _classCallCheck(this, Player);

    _get(Object.getPrototypeOf(Player.prototype), 'constructor', this).call(this, opts);
    this.speed = Settings.playerSpeed;
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

      targetLoc = {
        x: this.position.x + dx * this.speed,
        y: this.position.y + dy * this.speed
      };
      coords = Pathfinder.moveTowards(this.position, targetLoc, this.speed);
      this.position = Pathfinder.getRelativePosition(coords);
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
    Settings = undefined,
    Humanoid = undefined;

Settings = require('settings');
Pathfinder = require('pathfinder');
Humanoid = require('humanoids/humanoid');

var Zombie = (function (_Humanoid) {
  _inherits(Zombie, _Humanoid);

  function Zombie(opts) {
    _classCallCheck(this, Zombie);

    _get(Object.getPrototypeOf(Zombie.prototype), 'constructor', this).call(this, opts);
    this.speed = Settings.zombieSpeed;
  }

  _createClass(Zombie, [{
    key: 'isAbleToBite',
    value: function isAbleToBite(human) {
      return human && Pathfinder.distanceTo(human.position, this.position) < Settings.zombieBiteRange;
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
        return Pathfinder.arePositionsEqual(humanoid.position, targetPosition);
      });
    }
  }, {
    key: 'getNextDestination',
    value: function getNextDestination(nearestLivingHumanoid, nearestZombie) {
      var zombieDistance = undefined,
          livingHumanoidDistance = undefined;

      livingHumanoidDistance = Number.POSITIVE_INFINITY;
      zombieDistance = Number.POSITIVE_INFINITY;

      if (nearestZombie) {
        zombieDistance = Pathfinder.distanceTo(nearestZombie.position, this.position) * Settings.zombieSpread;
      }

      if (nearestLivingHumanoid) {
        livingHumanoidDistance = Pathfinder.distanceTo(nearestLivingHumanoid.position, this.position);
      }

      if (livingHumanoidDistance < zombieDistance) {
        return this.moveNearest(nearestLivingHumanoid);
      } else {
        return this.moveNearest(nearestZombie);
      }
    }
  }, {
    key: 'handleNextMove',
    value: function handleNextMove(opts) {
      var destination = undefined;
      var nearestHumanoid = opts.nearestHumanoid;
      var nearestZombie = opts.nearestZombie;
      var humanoids = opts.humanoids;

      if (this.isAbleToBite(nearestHumanoid)) {
        humanoids[nearestHumanoid.id] = nearestHumanoid.transform();
      }

      destination = Pathfinder.getRelativePosition(this.getNextDestination(nearestHumanoid, nearestZombie));

      if (this.isValidDestination(humanoids, destination)) {
        this.position = destination;
      }
    }
  }]);

  return Zombie;
})(Humanoid);

module.exports = Zombie;

},{"humanoids/humanoid":"/Users/philipavargas/Desktop/js_game_of_afterlife/public/js/game/humanoids/humanoid.js","pathfinder":"/Users/philipavargas/Desktop/js_game_of_afterlife/public/js/game/pathfinder.js","settings":"/Users/philipavargas/Desktop/js_game_of_afterlife/public/js/game/settings.js"}],"/Users/philipavargas/Desktop/js_game_of_afterlife/public/js/game/initialize.js":[function(require,module,exports){
'use strict';

var GameOfAfterlife = undefined,
    gameOfAfterlife = undefined;

GameOfAfterlife = require('game');

document.getElementById('initialize-game').addEventListener('click', function () {
  document.getElementById('overlay').className = 'hide';
  gameOfAfterlife = new GameOfAfterlife();
  gameOfAfterlife.init();
});

},{"game":"/Users/philipavargas/Desktop/js_game_of_afterlife/public/js/game/game.js"}],"/Users/philipavargas/Desktop/js_game_of_afterlife/public/js/game/pathfinder.js":[function(require,module,exports){
'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var Settings = undefined;

Settings = require('settings');

var Pathfinder = (function () {
  function Pathfinder() {
    _classCallCheck(this, Pathfinder);
  }

  _createClass(Pathfinder, null, [{
    key: 'getRelativePosition',
    value: function getRelativePosition(position) {
      var x = undefined,
          y = undefined;

      x = (position.x + Settings.defaultWidth) % Settings.defaultWidth;
      y = (position.y + Settings.defaultHeight) % Settings.defaultHeight;
      return { x: x, y: y };
    }
  }, {
    key: 'arePositionsEqual',
    value: function arePositionsEqual(position1, position2) {
      return position1.x === position2.x && position1.y === position2.y;
    }
  }, {
    key: 'moveTowards',
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
    key: 'moveAwayFrom',
    value: function moveAwayFrom(currentPosition, hostileLocation, speed) {
      return this.moveTowards(currentPosition, hostileLocation, -speed);
    }
  }, {
    key: 'movePerpendicularTo',
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
    key: 'distanceTo',
    value: function distanceTo(targetLocation, currentPosition) {
      var deltaY = undefined,
          deltaX = undefined;

      deltaY = targetLocation.y - currentPosition.y;
      deltaX = targetLocation.x - currentPosition.x;
      return Math.sqrt(Math.pow(deltaY, 2) + Math.pow(deltaX, 2));
    }
  }, {
    key: 'moveRandomly',
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

},{"settings":"/Users/philipavargas/Desktop/js_game_of_afterlife/public/js/game/settings.js"}],"/Users/philipavargas/Desktop/js_game_of_afterlife/public/js/game/settings.js":[function(require,module,exports){
"use strict";

var Settings = undefined;

Settings = {
  humanSpeed: 7,
  playerSpeed: 6,
  zombieSpeed: 4,
  humanCount: 30,
  zombieCount: 3,
  infectionIncubationTime: 5, // turn delay until infected become zombies. higher numbers take
  // longer to transform
  turnDelay: { normal: 100, fast: 25 }, // sets the timeout between turns
  repitionTolerance: 1, // the range in which a move is considered repetitive
  // lower values will reduce the size of the range.
  zombieSpread: 3, // lower zombieSpread values will cause zombies to spread out more
  humanFearRange: 20, // the range at which humans start running from zombies.
  zombieBiteRange: 10, // the range at which a zombie can bite a human.

  // TODO: Sync canvas with this value
  defaultWidth: 600, // default canvas width
  defaultHeight: 400 };

// default canvas height
module.exports = Settings;

},{}]},{},["/Users/philipavargas/Desktop/js_game_of_afterlife/public/js/game/initialize.js"])
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL25vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIvVXNlcnMvcGhpbGlwYXZhcmdhcy9EZXNrdG9wL2pzX2dhbWVfb2ZfYWZ0ZXJsaWZlL3B1YmxpYy9qcy9nYW1lL2JvYXJkLmpzIiwiL1VzZXJzL3BoaWxpcGF2YXJnYXMvRGVza3RvcC9qc19nYW1lX29mX2FmdGVybGlmZS9wdWJsaWMvanMvZ2FtZS9nYW1lLmpzIiwiL1VzZXJzL3BoaWxpcGF2YXJnYXMvRGVza3RvcC9qc19nYW1lX29mX2FmdGVybGlmZS9wdWJsaWMvanMvZ2FtZS9odW1hbm9pZEZhY3RvcnkuanMiLCIvVXNlcnMvcGhpbGlwYXZhcmdhcy9EZXNrdG9wL2pzX2dhbWVfb2ZfYWZ0ZXJsaWZlL3B1YmxpYy9qcy9nYW1lL2h1bWFub2lkcy9odW1hbi5qcyIsIi9Vc2Vycy9waGlsaXBhdmFyZ2FzL0Rlc2t0b3AvanNfZ2FtZV9vZl9hZnRlcmxpZmUvcHVibGljL2pzL2dhbWUvaHVtYW5vaWRzL2h1bWFub2lkLmpzIiwiL1VzZXJzL3BoaWxpcGF2YXJnYXMvRGVza3RvcC9qc19nYW1lX29mX2FmdGVybGlmZS9wdWJsaWMvanMvZ2FtZS9odW1hbm9pZHMvaW5mZWN0ZWRIdW1hbi5qcyIsIi9Vc2Vycy9waGlsaXBhdmFyZ2FzL0Rlc2t0b3AvanNfZ2FtZV9vZl9hZnRlcmxpZmUvcHVibGljL2pzL2dhbWUvaHVtYW5vaWRzL3BsYXllci5qcyIsIi9Vc2Vycy9waGlsaXBhdmFyZ2FzL0Rlc2t0b3AvanNfZ2FtZV9vZl9hZnRlcmxpZmUvcHVibGljL2pzL2dhbWUvaHVtYW5vaWRzL3pvbWJpZS5qcyIsIi9Vc2Vycy9waGlsaXBhdmFyZ2FzL0Rlc2t0b3AvanNfZ2FtZV9vZl9hZnRlcmxpZmUvcHVibGljL2pzL2dhbWUvaW5pdGlhbGl6ZS5qcyIsIi9Vc2Vycy9waGlsaXBhdmFyZ2FzL0Rlc2t0b3AvanNfZ2FtZV9vZl9hZnRlcmxpZmUvcHVibGljL2pzL2dhbWUvcGF0aGZpbmRlci5qcyIsIi9Vc2Vycy9waGlsaXBhdmFyZ2FzL0Rlc2t0b3AvanNfZ2FtZV9vZl9hZnRlcmxpZmUvcHVibGljL2pzL2dhbWUvc2V0dGluZ3MuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7Ozs7QUNBQSxJQUFJLFVBQVUsWUFBQSxDQUFDOztBQUVmLFVBQVUsR0FBRyxPQUFPLENBQUMsWUFBWSxDQUFDLENBQUM7O0lBRTdCLEtBQUs7QUFDRSxXQURQLEtBQUssQ0FDRyxVQUFVLEVBQUM7MEJBRG5CLEtBQUs7O0FBRVAsUUFBSSxDQUFDLFFBQVEsR0FBRyxJQUFJLENBQUM7QUFDckIsUUFBSSxDQUFDLEtBQUssR0FBRyxDQUFDLENBQUM7QUFDZixRQUFJLENBQUMsRUFBRSxHQUFHLENBQUMsQ0FBQztBQUNaLFFBQUksQ0FBQyxFQUFFLEdBQUcsQ0FBQyxDQUFDO0FBQ1osUUFBSSxDQUFDLFNBQVMsR0FBRyxVQUFVLENBQUMsU0FBUyxJQUFJLEVBQUUsQ0FBQztHQUM3Qzs7ZUFQRyxLQUFLOztXQVNHLHdCQUFFO0FBQ1osYUFBTyxJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxVQUFTLFFBQVEsRUFBRTtBQUM1QyxlQUFPLFFBQVEsQ0FBQyxPQUFPLEVBQUUsSUFBSSxRQUFRLENBQUMsUUFBUSxFQUFFLENBQUM7T0FDbEQsQ0FBQyxDQUFDO0tBQ0o7OztXQUVZLHlCQUFFO0FBQ2IsYUFBTyxJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxVQUFTLFFBQVEsRUFBRTtBQUM1QyxlQUFPLFFBQVEsQ0FBQyxRQUFRLEVBQUUsQ0FBQztPQUM1QixDQUFDLENBQUM7S0FDSjs7O1dBRW9CLGlDQUFFO0FBQ3JCLFVBQUksZUFBZSxZQUFBO1VBQUUsVUFBVSxZQUFBO1VBQUUsZUFBZSxZQUFBLENBQUM7O0FBRWpELHFCQUFlLEdBQUcsSUFBSSxDQUFDLG9CQUFvQixDQUFDLFFBQVEsQ0FBQyxDQUM5QixNQUFNLENBQUMsSUFBSSxD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b3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsImxldCBQYXRoZmluZGVyO1xuXG5QYXRoZmluZGVyID0gcmVxdWlyZSgncGF0aGZpbmRlcicpO1xuXG5jbGFzcyBCb2FyZCB7XG4gIGNvbnN0cnVjdG9yKGF0dHJpYnV0ZXMpe1xuICAgIHRoaXMuaHVtYW5vaWQgPSBudWxsO1xuICAgIHRoaXMuc2NvcmUgPSAwO1xuICAgIHRoaXMuZHggPSAwO1xuICAgIHRoaXMuZHkgPSAwO1xuICAgIHRoaXMuaHVtYW5vaWRzID0gYXR0cmlidXRlcy5odW1hbm9pZHMgfHwgW107XG4gIH1cblxuICBpc0dhbWVBY3RpdmUoKXtcbiAgICByZXR1cm4gdGhpcy5odW1hbm9pZHMuc29tZShmdW5jdGlvbihodW1hbm9pZCkge1xuICAgICAgcmV0dXJuIGh1bWFub2lkLmlzSHVtYW4oKSB8fCBodW1hbm9pZC5pc1BsYXllcigpO1xuICAgIH0pO1xuICB9XG5cbiAgaXNQbGF5ZXJBbGl2ZSgpe1xuICAgIHJldHVybiB0aGlzLmh1bWFub2lkcy5zb21lKGZ1bmN0aW9uKGh1bWFub2lkKSB7XG4gICAgICByZXR1cm4gaHVtYW5vaWQuaXNQbGF5ZXIoKTtcbiAgICB9KTtcbiAgfVxuXG4gIG5lYXJlc3RMaXZpbmdIdW1hbm9pZCgpe1xuICAgIGxldCBsaXZpbmdIdW1hbm9pZHMsIGNsb3Nlc3RQb3MsIGNsb3Nlc3RIdW1hbm9pZDtcblxuICAgIGxpdmluZ0h1bWFub2lkcyA9IHRoaXMuZmluZFNpbWlsYXJIdW1hbm9pZHMoJ1BsYXllcicpXG4gICAgICAgICAgICAgICAgICAgICAgICAgIC5jb25jYXQodGhpcy5maW5kU2ltaWxhckh1bWFub2lkcygnSHVtYW4nKSk7XG4gICAgY2xvc2VzdFBvcyA9IHRoaXMuZmluZENsb3Nlc3RQb3MobGl2aW5nSHVtYW5vaWRzKTtcbiAgICBjbG9zZXN0SHVtYW5vaWQgPSB0aGlzLmZpbmRDbG9zZXN0SHVtYW5vaWQoY2xvc2VzdFBvcywgbGl2aW5nSHVtYW5vaWRzKTtcbiAgICByZXR1cm4gY2xvc2VzdEh1bWFub2lkO1xuICB9XG5cbiAgbmVhcmVzdFpvbWJpZSgpe1xuICAgIGxldCBzaW1pbGFySHVtYW5vaWRzLCBjbG9zZXN0UG9zLCBjbG9zZXN0SHVtYW5vaWQ7XG5cbiAgICBzaW1pbGFySHVtYW5vaWRzID0gdGhpcy5maW5kU2ltaWxhckh1bWFub2lkcygnWm9tYmllJyk7XG4gICAgY2xvc2VzdFBvcyA9IHRoaXMuZmluZENsb3Nlc3RQb3Moc2ltaWxhckh1bWFub2lkcyk7XG4gICAgY2xvc2VzdEh1bWFub2lkID0gdGhpcy5maW5kQ2xvc2VzdEh1bWFub2lkKGNsb3Nlc3RQb3MsIHNpbWlsYXJIdW1hbm9pZHMpO1xuICAgIHJldHVybiBjbG9zZXN0SHVtYW5vaWQ7XG4gIH1cblxuICBuZXh0VHVybigpe1xuICAgIGZvcihsZXQgaSA9IDA7IGkgPCB0aGlzLmh1bWFub2lkcy5sZW5ndGg7IGkrKyl7XG4gICAgICB0aGlzLmh1bWFub2lkID0gdGhpcy5odW1hbm9pZHNbaV07XG4gICAgICB0aGlzLmh1bWFub2lkLmhhbmRsZU5leHRNb3ZlKHtcbiAgICAgICAgbmVhcmVzdEh1bWFub2lkOiB0aGlzLm5lYXJlc3RMaXZpbmdIdW1hbm9pZCgpLFxuICAgICAgICBuZWFyZXN0Wm9tYmllOiB0aGlzLm5lYXJlc3Rab21iaWUoKSxcbiAgICAgICAgZHg6IHRoaXMuZHgsXG4gICAgICAgIGR5OiB0aGlzLmR5LFxuICAgICAgICBodW1hbm9pZHM6IHRoaXMuaHVtYW5vaWRzLFxuICAgICAgfSk7XG4gICAgfVxuICAgIHRoaXMuaW5jcmVtZW50U2NvcmUoKTtcbiAgfVxuXG4gIGluY3JlbWVudFNjb3JlKCl7XG4gICAgaWYgKHRoaXMuaXNQbGF5ZXJBbGl2ZSgpKSB7IHRoaXMuc2NvcmUgKz0gMTA7IH1cbiAgfVxuXG4gIG90aGVySHVtYW5vaWRzKCl7XG4gICAgcmV0dXJuIHRoaXMuaHVtYW5vaWRzLmZpbHRlcigoY3VycmVudEh1bWFub2lkKSA9PiB7XG4gICAgICByZXR1cm4gdGhpcy5odW1hbm9pZC5pZCAhPT0gY3VycmVudEh1bWFub2lkLmlkO1xuICAgIH0pO1xuICB9XG5cbiAgZmluZFNpbWlsYXJIdW1hbm9pZHMoaHVtYW5vaWRUeXBlKXtcbiAgICByZXR1cm4gdGhpcy5vdGhlckh1bWFub2lkcygpLmZpbHRlcihmdW5jdGlvbihodW1hbm9pZCl7XG4gICAgICByZXR1cm4gaHVtYW5vaWQuaHVtYW5UeXBlID09PSBodW1hbm9pZFR5cGU7XG4gICAgfSk7XG4gIH1cblxuICBmaW5kQ2xvc2VzdFBvcyhvdGhlckh1bWFub2lkcyl7XG4gICAgbGV0IGNsb3Nlc3RQb3MsIGRpc3Q7XG5cbiAgICBjbG9zZXN0UG9zID0gW107XG4gICAgZm9yKGxldCBpID0gMDsgaSA8IG90aGVySHVtYW5vaWRzLmxlbmd0aDsgaSsrKXtcbiAgICAgIGRpc3QgPSBQYXRoZmluZGVyLmRpc3RhbmNlVG8ob3RoZXJIdW1hbm9pZHNbaV0ucG9zaXRpb24sIHRoaXMuaHVtYW5vaWQucG9zaXRpb24pO1xuICAgICAgY2xvc2VzdFBvcy5wdXNoKGRpc3QpO1xuICAgIH1cbiAgICByZXR1cm4gY2xvc2VzdFBvcztcbiAgfVxuXG4gIGZpbmRDbG9zZXN0SHVtYW5vaWQoY2xvc2VzdFBvcywgb3RoZXJIdW1hbm9pZHMpe1xuICAgIGxldCBjbG9zZXN0SHVtYW5vaWRWYWx1ZSwgY2xvc2VzdEh1bWFub2lkO1xuXG4gICAgY2xvc2VzdEh1bWFub2lkVmFsdWUgPSBNYXRoLm1pbi5hcHBseShudWxsLCBjbG9zZXN0UG9zKTtcbiAgICBmb3IobGV0IGkgPSAwOyBpIDwgY2xvc2VzdFBvcy5sZW5ndGg7IGkrKyl7XG4gICAgICBpZihjbG9zZXN0UG9zW2ldID09PSBjbG9zZXN0SHVtYW5vaWRWYWx1ZSl7IGNsb3Nlc3RIdW1hbm9pZCA9IG90aGVySHVtYW5vaWRzW2ldOyB9XG4gICAgfVxuICAgIHJldHVybiBjbG9zZXN0SHVtYW5vaWQ7XG4gIH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBCb2FyZDtcbiIsImxldCBCb2FyZCwgSHVtYW5vaWRCdWlsZGVyLCBTZXR0aW5ncztcblxuQm9hcmQgPSByZXF1aXJlKCdib2FyZCcpO1xuSHVtYW5vaWRCdWlsZGVyID0gcmVxdWlyZSgnaHVtYW5vaWRGYWN0b3J5Jyk7XG5TZXR0aW5ncyA9IHJlcXVpcmUoJ3NldHRpbmdzJyk7XG5cbmNsYXNzIEdhbWVPZkFmdGVybGlmZSB7XG4gIGNvbnN0cnVjdG9yKCl7XG4gICAgbGV0IGNhbnZhcywgYWxsSHVtYW5vaWRzO1xuXG4gICAgY2FudmFzID0gZG9jdW1lbnQuZ2V0RWxlbWVudHNCeVRhZ05hbWUoJ2NhbnZhcycpWzBdO1xuICAgIGFsbEh1bWFub2lkcyA9IEh1bWFub2lkQnVpbGRlci5wb3B1bGF0ZShTZXR0aW5ncy5odW1hbkNvdW50LCBTZXR0aW5ncy56b21iaWVDb3VudCk7XG4gICAgdGhpcy5oYXNCZWd1biA9IGZhbHNlO1xuICAgIHRoaXMud2lkdGggPSBjYW52YXMud2lkdGg7XG4gICAgdGhpcy5oZWlnaHQgPSBjYW52YXMuaGVpZ2h0O1xuICAgIHRoaXMuY3R4ID0gY2FudmFzLmdldENvbnRleHQoJzJkJyk7XG4gICAgdGhpcy5ib2FyZCA9IG5ldyBCb2FyZCh7IGh1bWFub2lkczogYWxsSHVtYW5vaWRzIH0pO1xuICAgIHRoaXMuaHVtYW5vaWRDb2xvck1hcCA9IHtcbiAgICAgIEh1bWFuOiAnIzAwYWFhYScsXG4gICAgICBab21iaWU6ICcjZmYwMDAwJyxcbiAgICAgIFBsYXllcjogJyMwMGNjMDAnLFxuICAgICAgSW5mZWN0ZWRIdW1hbjogJyM3NzAwMDAnXG4gICAgfTtcbiAgfVxuXG4gIGJpbmRQbGF5ZXJNb3ZlbWVudCgpe1xuICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ2tleXVwJywgKGUpID0+IHtcbiAgICAgIC8vIHMgPSA4M1xuICAgICAgLy8gdyA9IDg3XG4gICAgICAvLyBhID0gNjVcbiAgICAgIC8vIGQgPSA2OFxuICAgICAgaWYgKGUud2hpY2ggPT09IDY4IHx8IGUud2hpY2ggPT09IDY1KXsgdGhpcy5ib2FyZC5keCA9IDA7IH1cbiAgICAgIGlmIChlLndoaWNoID09PSA4MyB8fCBlLndoaWNoID09PSA4Nyl7IHRoaXMuYm9hcmQuZHkgPSAwOyB9XG4gICAgfSk7XG5cbiAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdrZXlkb3duJywgKGUpID0+IHtcbiAgICAgIGlmIChlLndoaWNoID09PSA2NSl7IHRoaXMuYm9hcmQuZHggPSAtMTsgfVxuICAgICAgZWxzZSBpZiAoZS53aGljaCA9PT0gNjgpeyB0aGlzLmJvYXJkLmR4ID0gMTsgfVxuICAgICAgZWxzZSBpZiAoZS53aGljaCA9PT0gODcpeyB0aGlzLmJvYXJkLmR5ID0gLTE7IH1cbiAgICAgIGVsc2UgaWYgKGUud2hpY2ggPT09IDgzKXsgdGhpcy5ib2FyZC5keSA9IDE7IH1cbiAgICB9KTtcbiAgfVxuXG4gIGRyYXdIdW1hbm9pZHMoKXtcbiAgICBsZXQgcGxheWVyLCB4LCB5O1xuXG4gICAgdGhpcy5jdHguY2xlYXJSZWN0KDAsIDAsIHRoaXMud2lkdGgsIHRoaXMuaGVpZ2h0KTtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMuYm9hcmQuaHVtYW5vaWRzLmxlbmd0aDsgaSsrKXtcbiAgICAgIHRoaXMuY3R4LmJlZ2luUGF0aCgpO1xuICAgICAgcGxheWVyID0gdGhpcy5ib2FyZC5odW1hbm9pZHNbaV07XG4gICAgICB4ID0gcGxheWVyLnBvc2l0aW9uLng7XG4gICAgICB5ID0gcGxheWVyLnBvc2l0aW9uLnk7XG4gICAgICB0aGlzLmN0eC5hcmMoeCwgeSwgNSwgMCwgMiAqIE1hdGguUEkpO1xuICAgICAgdGhpcy5jdHguZmlsbFN0eWxlID0gdGhpcy5odW1hbm9pZENvbG9yTWFwW3BsYXllci5odW1hblR5cGVdO1xuICAgICAgdGhpcy5jdHguZmlsbCgpO1xuICAgICAgdGhpcy5jdHguc3Ryb2tlKCk7XG4gICAgfVxuICB9XG5cbiAgY2FsbE5leHRUdXJuKCl7XG4gICAgbGV0IGRlbGF5LCBuZXh0UmVxdWVzdDtcblxuICAgIG5leHRSZXF1ZXN0ID0gKCkgPT4ge1xuICAgICAgdGhpcy5kcmF3SHVtYW5vaWRzKCk7XG4gICAgICBpZiAodGhpcy5ib2FyZC5pc0dhbWVBY3RpdmUoKSl7XG4gICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdzY29yZScpLmlubmVySFRNTCA9IHRoaXMuYm9hcmQuc2NvcmU7XG4gICAgICAgIHRoaXMuYm9hcmQubmV4dFR1cm4oKTtcbiAgICAgICAgZGVsYXkgPSAodGhpcy5ib2FyZC5pc1BsYXllckFsaXZlKCkgPyBTZXR0aW5ncy50dXJuRGVsYXkubm9ybWFsIDogU2V0dGluZ3MudHVybkRlbGF5LmZhc3QpO1xuICAgICAgICBzZXRUaW1lb3V0KG5leHRSZXF1ZXN0LCBkZWxheSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnb3ZlcmxheS1tZXNzYWdlJylcbiAgICAgICAgLmlubmVySFRNTCA9IGBFVkVSWUJPRFkgSVMgREVBRCEhIVxcbllvdXIgc2NvcmUgd2FzOiAke3RoaXMuYm9hcmQuc2NvcmV9YDtcbiAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ292ZXJsYXknKS5jbGFzc05hbWUgPSAnJztcbiAgICAgIH1cbiAgICB9O1xuICAgIHNldFRpbWVvdXQobmV4dFJlcXVlc3QsIFNldHRpbmdzLnR1cm5EZWxheS5ub3JtYWwpO1xuICB9XG5cbiAgaW5pdCgpe1xuICAgIHRoaXMuYmluZFBsYXllck1vdmVtZW50KCk7XG4gICAgdGhpcy5jYWxsTmV4dFR1cm4oKTtcbiAgfVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IEdhbWVPZkFmdGVybGlmZTtcbiIsImxldCBIdW1hbiwgWm9tYmllLCBQbGF5ZXI7XG5cbkh1bWFuID0gcmVxdWlyZSgnaHVtYW5vaWRzL2h1bWFuJyk7XG5ab21iaWUgPSByZXF1aXJlKCdodW1hbm9pZHMvem9tYmllJyk7XG5QbGF5ZXIgPSByZXF1aXJlKCdodW1hbm9pZHMvcGxheWVyJyk7XG5cbmNsYXNzIEh1bWFub2lkQnVpbGRlciB7XG4gIHN0YXRpYyBodW1hbm9pZE1hcCgpe1xuICAgIHJldHVybiB7XG4gICAgICBIdW1hbixcbiAgICAgIFpvbWJpZSxcbiAgICAgIFBsYXllclxuICAgIH07XG4gIH1cblxuICBzdGF0aWMgcG9wdWxhdGUobnVtYmVyT2ZIdW1hbnMsIG51bWJlck9mWm9tYmllcyl7XG4gICAgbGV0IHBvcHVsYXRpb247XG5cbiAgICBwb3B1bGF0aW9uID0gW107XG4gICAgcG9wdWxhdGlvbiA9IHBvcHVsYXRpb24uY29uY2F0KHRoaXMuY3JlYXRpb24obnVtYmVyT2ZIdW1hbnMsICdIdW1hbicpKTtcbiAgICBwb3B1bGF0aW9uID0gcG9wdWxhdGlvbi5jb25jYXQoXG4gICAgICB0aGlzLmNyZWF0aW9uKG51bWJlck9mWm9tYmllcywgJ1pvbWJpZScsIHBvcHVsYXRpb24ubGVuZ3RoKVxuICAgICk7XG4gICAgcG9wdWxhdGlvbiA9IHBvcHVsYXRpb24uY29uY2F0KFxuICAgICAgdGhpcy5jcmVhdGlvbigxLCAnUGxheWVyJywgcG9wdWxhdGlvbi5sZW5ndGgpXG4gICAgKTtcbiAgICByZXR1cm4gcG9wdWxhdGlvbjtcbiAgfVxuXG4gIHN0YXRpYyBjcmVhdGlvbihudW1iZXIsIHR5cGUsIGJhc2VJZCA9IDApe1xuICAgIGxldCBwb3B1bGF0aW9uLCBuZXdIdW1hbm9pZCwgbWFwLCBIO1xuXG4gICAgbWFwID0gdGhpcy5odW1hbm9pZE1hcCgpO1xuICAgIHBvcHVsYXRpb24gPSBbXTtcbiAgICBmb3IobGV0IGkgPSAwOyBpIDwgbnVtYmVyOyBpKyspe1xuICAgICAgSCA9IG1hcFt0eXBlXTtcbiAgICAgIG5ld0h1bWFub2lkID0gbmV3IEgoeyBpZDogYmFzZUlkICsgaSB9KTtcbiAgICAgIHBvcHVsYXRpb24ucHVzaChuZXdIdW1hbm9pZCk7XG4gICAgfVxuICAgIHJldHVybiBwb3B1bGF0aW9uO1xuICB9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gSHVtYW5vaWRCdWlsZGVyO1xuIiwibGV0IFBhdGhmaW5kZXIsIFNldHRpbmdzLCBIdW1hbm9pZCwgSW5mZWN0ZWRIdW1hbjtcblxuU2V0dGluZ3MgPSByZXF1aXJlKCdzZXR0aW5ncycpO1xuUGF0aGZpbmRlciA9IHJlcXVpcmUoJ3BhdGhmaW5kZXInKTtcbkh1bWFub2lkID0gcmVxdWlyZSgnaHVtYW5vaWRzL2h1bWFub2lkJyk7XG5JbmZlY3RlZEh1bWFuID0gcmVxdWlyZSgnaHVtYW5vaWRzL2luZmVjdGVkSHVtYW4nKTtcblxuY2xhc3MgSHVtYW4gZXh0ZW5kcyBIdW1hbm9pZCB7XG4gIGNvbnN0cnVjdG9yKG9wdHMpIHtcbiAgICBzdXBlcihvcHRzKTtcbiAgICB0aGlzLnNwZWVkID0gU2V0dGluZ3MuaHVtYW5TcGVlZDtcbiAgfVxuXG4gIGlzQWJsZVRvQml0ZSgpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICB0cmFuc2Zvcm0oKSB7XG4gICAgcmV0dXJuKFxuICAgICAgbmV3IEluZmVjdGVkSHVtYW4odGhpcy5jbG9uZVByb3BzKCkpXG4gICAgKTtcbiAgfVxuXG4gIGhhbmRsZU5leHRNb3ZlKG9wdHMpe1xuICAgIGxldCBkZXN0aW5hdGlvbjtcbiAgICBsZXQgeyBuZWFyZXN0SHVtYW5vaWQsIG5lYXJlc3Rab21iaWUsIGh1bWFub2lkcyB9ID0gb3B0cztcblxuICAgIGRlc3RpbmF0aW9uID0gUGF0aGZpbmRlci5nZXRSZWxhdGl2ZVBvc2l0aW9uKFxuICAgICAgdGhpcy5nZXROZXh0RGVzdGluYXRpb24obmVhcmVzdEh1bWFub2lkLCBuZWFyZXN0Wm9tYmllKVxuICAgICk7XG4gICAgaWYgKHRoaXMuaXNWYWxpZERlc3RpbmF0aW9uKGh1bWFub2lkcywgZGVzdGluYXRpb24pKSB7XG4gICAgICB0aGlzLnBvc2l0aW9uID0gZGVzdGluYXRpb247XG4gICAgfVxuICB9XG5cbiAgaXNWYWxpZERlc3RpbmF0aW9uKGh1bWFub2lkcywgdGFyZ2V0UG9zaXRpb24pIHtcbiAgICByZXR1cm4gIWh1bWFub2lkcy5zb21lKChodW1hbm9pZCkgPT4ge1xuICAgICAgcmV0dXJuIFBhdGhmaW5kZXIuYXJlUG9zaXRpb25zRXF1YWwoaHVtYW5vaWQucG9zaXRpb24sIHRhcmdldFBvc2l0aW9uKTtcbiAgICB9KTtcbiAgfVxuXG4gIGdldE5leHREZXN0aW5hdGlvbihuZWFyZXN0SHVtYW5vaWQsIG5lYXJlc3Rab21iaWUpe1xuICAgIGlmICh0aGlzLmlzWm9tYmllTmVhcmVzdChuZWFyZXN0Wm9tYmllLCBuZWFyZXN0SHVtYW5vaWQpKXtcbiAgICAgIHJldHVybiB0aGlzLm1vdmVOZWFyZXN0KG5lYXJlc3Rab21iaWUpO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gdGhpcy5tb3ZlTmVhcmVzdChuZWFyZXN0SHVtYW5vaWQpO1xuICAgIH1cbiAgfVxuXG4gIGlzWm9tYmllTmVhcmVzdChuZWFyZXN0Wm9tYmllLCBuZWFyZXN0SHVtYW5vaWQpIHtcbiAgICBsZXQgem9tYmllRGlzdGFuY2U7XG5cbiAgICBpZiAobmVhcmVzdFpvbWJpZSkge1xuICAgICAgem9tYmllRGlzdGFuY2UgPSBQYXRoZmluZGVyLmRpc3RhbmNlVG8obmVhcmVzdFpvbWJpZS5wb3NpdGlvbiwgdGhpcy5wb3NpdGlvbik7XG4gICAgfVxuXG4gICAgLy8gYSB6b21iaWUgaXMgd2l0aGluIHRoZSBodW1hbiBmZWFyIHJhbmdlLCBvciB0aGVyZSBhcmUgbm8gb3RoZXIgbGl2aW5nIGh1bWFub2lkcyByZW1haW5pbmdcbiAgICByZXR1cm4gKHpvbWJpZURpc3RhbmNlIDwgU2V0dGluZ3MuaHVtYW5GZWFyUmFuZ2UgfHwgKCFuZWFyZXN0SHVtYW5vaWQpKTtcbiAgfVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IEh1bWFuO1xuIiwibGV0IFBhdGhmaW5kZXIsIFNldHRpbmdzO1xuXG5QYXRoZmluZGVyID0gcmVxdWlyZSgncGF0aGZpbmRlcicpO1xuU2V0dGluZ3MgPSByZXF1aXJlKCdzZXR0aW5ncycpO1xuXG5jbGFzcyBIdW1hbm9pZCB7XG4gIGNvbnN0cnVjdG9yKGF0dHJpYnV0ZXMpe1xuICAgIHRoaXMuaWQgPSBhdHRyaWJ1dGVzLmlkO1xuICAgIHRoaXMucG9zaXRpb24gPSBhdHRyaWJ1dGVzLnBvc2l0aW9uIHx8XG4gICAgICB7IHg6ICg1ICsgTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogNTkxKSksIHk6ICg1ICsgTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogMzkxKSkgfTtcbiAgICB0aGlzLmxhc3RQb3NpdGlvbiA9IHsgeDogdGhpcy5wb3NpdGlvbi54LCB5OiB0aGlzLnBvc2l0aW9uLnkgfTtcbiAgICB0aGlzLmh1bWFuVHlwZSA9IHRoaXMuY29uc3RydWN0b3IubmFtZTtcbiAgfVxuXG4gIGlzWm9tYmllKCl7XG4gICAgcmV0dXJuIHRoaXMuaHVtYW5UeXBlID09PSAnWm9tYmllJztcbiAgfVxuXG4gIGlzUGxheWVyKCl7XG4gICAgcmV0dXJuIHRoaXMuaHVtYW5UeXBlID09PSAnUGxheWVyJztcbiAgfVxuXG4gIGlzSHVtYW4oKXtcbiAgICByZXR1cm4gdGhpcy5odW1hblR5cGUgPT09ICdIdW1hbic7XG4gIH1cblxuICBjbG9uZVByb3BzKCkge1xuICAgIHJldHVybiB7XG4gICAgICBpZDogdGhpcy5pZCxcbiAgICAgIHBvc2l0aW9uOiB0aGlzLnBvc2l0aW9uLFxuICAgICAgbGFzdFBvc2l0aW9uOiB0aGlzLmxhc3RQb3NpdGlvblxuICAgIH07XG4gIH1cblxuICBpc0F0dHJhY3RlZFRvKG5lYXJlc3RIdW1hbm9pZCl7XG4gICAgcmV0dXJuIG5lYXJlc3RIdW1hbm9pZC5pc1BsYXllcigpIHx8IG5lYXJlc3RIdW1hbm9pZC5pc0h1bWFuKCk7XG4gIH1cblxuICBzdG9yZUxhc3RQb3NpdGlvbigpe1xuICAgIHRoaXMubGFzdFBvc2l0aW9uID0geyB4OiB0aGlzLnBvc2l0aW9uLngsIHk6IHRoaXMucG9zaXRpb24ueSB9O1xuICB9XG5cbiAgaXNMYXN0TW92ZVJlcGVhdGVkKHBvdGVudGlhbE1vdmUpe1xuICAgIHJldHVybiAoXG4gICAgICAoTWF0aC5hYnMocG90ZW50aWFsTW92ZS54IC0gdGhpcy5sYXN0UG9zaXRpb24ueCkgPCBTZXR0aW5ncy5yZXBpdGlvblRvbGVyYW5jZSkgJiZcbiAgICAgICAgKE1hdGguYWJzKHBvdGVudGlhbE1vdmUueSAtIHRoaXMubGFzdFBvc2l0aW9uLnkpIDwgU2V0dGluZ3MucmVwaXRpb25Ub2xlcmFuY2UpXG4gICAgKTtcbiAgfVxuXG4gIG1vdmVOZWFyZXN0KG5lYXJlc3RPYmplY3Qpe1xuICAgIGxldCBwb3RlbnRpYWxNb3ZlO1xuXG4gICAgaWYgKHRoaXMuaXNBdHRyYWN0ZWRUbyhuZWFyZXN0T2JqZWN0KSl7XG4gICAgICBwb3RlbnRpYWxNb3ZlID0gUGF0aGZpbmRlci5tb3ZlVG93YXJkcyh0aGlzLnBvc2l0aW9uLCBuZWFyZXN0T2JqZWN0LnBvc2l0aW9uLCB0aGlzLnNwZWVkKTtcbiAgICB9IGVsc2Uge1xuICAgICAgcG90ZW50aWFsTW92ZSA9IFBhdGhmaW5kZXIubW92ZUF3YXlGcm9tKHRoaXMucG9zaXRpb24sIG5lYXJlc3RPYmplY3QucG9zaXRpb24sIHRoaXMuc3BlZWQpO1xuICAgIH1cbiAgICBpZiAodGhpcy5sYXN0UG9zaXRpb24ueCA9PT0gdGhpcy5wb3NpdGlvbi54ICYmIHRoaXMubGFzdFBvc2l0aW9uLnkgPT09IHRoaXMucG9zaXRpb24ueSl7XG4gICAgICB0aGlzLnN0b3JlTGFzdFBvc2l0aW9uKCk7XG4gICAgICByZXR1cm4gUGF0aGZpbmRlci5tb3ZlUmFuZG9tbHkodGhpcy5wb3NpdGlvbiwgdGhpcy5zcGVlZCk7XG4gICAgfSBlbHNlIGlmICh0aGlzLmlzTGFzdE1vdmVSZXBlYXRlZChwb3RlbnRpYWxNb3ZlKSl7XG4gICAgICB0aGlzLnN0b3JlTGFzdFBvc2l0aW9uKCk7XG4gICAgICByZXR1cm4gUGF0aGZpbmRlci5tb3ZlUGVycGVuZGljdWxhclRvKHRoaXMucG9zaXRpb24sIG5lYXJlc3RPYmplY3QucG9zaXRpb24sIHRoaXMuc3BlZWQpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLnN0b3JlTGFzdFBvc2l0aW9uKCk7XG4gICAgICByZXR1cm4gcG90ZW50aWFsTW92ZTtcbiAgICB9XG4gIH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBIdW1hbm9pZDtcbiIsImxldCBIdW1hbm9pZCwgWm9tYmllLCBTZXR0aW5ncztcblxuSHVtYW5vaWQgPSByZXF1aXJlKCdodW1hbm9pZHMvaHVtYW5vaWQnKTtcblpvbWJpZSA9IHJlcXVpcmUoJ2h1bWFub2lkcy96b21iaWUnKTtcblNldHRpbmdzID0gcmVxdWlyZSgnc2V0dGluZ3MnKTtcblxuY2xhc3MgSW5mZWN0ZWRIdW1hbiBleHRlbmRzIEh1bWFub2lkIHtcbiAgY29uc3RydWN0b3Iob3B0cykge1xuICAgIHN1cGVyKG9wdHMpO1xuICAgIHRoaXMuc3BlZWQgPSAwO1xuICAgIHRoaXMudGltZVNpbmNlSW5mZWN0aW9uID0gMDtcbiAgfVxuXG4gIGlzQWJsZVRvQml0ZSgpe1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIHRyYW5zZm9ybSgpIHtcbiAgICByZXR1cm4oXG4gICAgICBuZXcgWm9tYmllKHRoaXMuY2xvbmVQcm9wcygpKVxuICAgICk7XG4gIH1cblxuICBpbmNyZW1lbnRUaW1lU2luY2VJbmZlY3Rpb24oKXtcbiAgICB0aGlzLnRpbWVTaW5jZUluZmVjdGlvbisrO1xuICB9XG5cbiAgaGFuZGxlTmV4dE1vdmUob3B0cyl7XG4gICAgbGV0IHsgaHVtYW5vaWRzIH0gPSBvcHRzO1xuXG4gICAgdGhpcy5pbmNyZW1lbnRUaW1lU2luY2VJbmZlY3Rpb24oKTtcbiAgICBpZiAodGhpcy50aW1lU2luY2VJbmZlY3Rpb24gPj0gU2V0dGluZ3MuaW5mZWN0aW9uSW5jdWJhdGlvblRpbWUpe1xuICAgICAgaHVtYW5vaWRzW3RoaXMuaWRdID0gdGhpcy50cmFuc2Zvcm0oKTtcbiAgICB9XG4gIH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBJbmZlY3RlZEh1bWFuO1xuIiwibGV0IFBhdGhmaW5kZXIsIFNldHRpbmdzLCBIdW1hbm9pZCwgSW5mZWN0ZWRIdW1hbjtcblxuU2V0dGluZ3MgPSByZXF1aXJlKCdzZXR0aW5ncycpO1xuUGF0aGZpbmRlciA9IHJlcXVpcmUoJ3BhdGhmaW5kZXInKTtcbkh1bWFub2lkID0gcmVxdWlyZSgnaHVtYW5vaWRzL2h1bWFub2lkJyk7XG5JbmZlY3RlZEh1bWFuID0gcmVxdWlyZSgnaHVtYW5vaWRzL2luZmVjdGVkSHVtYW4nKTtcblxuY2xhc3MgUGxheWVyIGV4dGVuZHMgSHVtYW5vaWQge1xuICBjb25zdHJ1Y3RvcihvcHRzKSB7XG4gICAgc3VwZXIob3B0cyk7XG4gICAgdGhpcy5zcGVlZCA9IFNldHRpbmdzLnBsYXllclNwZWVkO1xuICB9XG5cbiAgaXNBYmxlVG9CaXRlKCkge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIHRyYW5zZm9ybSgpIHtcbiAgICByZXR1cm4oXG4gICAgICBuZXcgSW5mZWN0ZWRIdW1hbih0aGlzLmNsb25lUHJvcHMoKSlcbiAgICApO1xuICB9XG5cbiAgaGFuZGxlTmV4dE1vdmUob3B0cyl7XG4gICAgbGV0IHRhcmdldExvYywgY29vcmRzO1xuICAgIGxldCB7IGR4LCBkeSB9ID0gb3B0cztcblxuICAgIHRhcmdldExvYyA9IHtcbiAgICAgIHg6IHRoaXMucG9zaXRpb24ueCArIGR4ICogdGhpcy5zcGVlZCxcbiAgICAgIHk6IHRoaXMucG9zaXRpb24ueSArIGR5ICogdGhpcy5zcGVlZFxuICAgIH07XG4gICAgY29vcmRzID0gKFBhdGhmaW5kZXIubW92ZVRvd2FyZHModGhpcy5wb3NpdGlvbiwgdGFyZ2V0TG9jLCB0aGlzLnNwZWVkKSk7XG4gICAgdGhpcy5wb3NpdGlvbiA9IFBhdGhmaW5kZXIuZ2V0UmVsYXRpdmVQb3NpdGlvbihjb29yZHMpO1xuICB9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gUGxheWVyO1xuXG4iLCJsZXQgUGF0aGZpbmRlciwgU2V0dGluZ3MsIEh1bWFub2lkO1xuXG5TZXR0aW5ncyA9IHJlcXVpcmUoJ3NldHRpbmdzJyk7XG5QYXRoZmluZGVyID0gcmVxdWlyZSgncGF0aGZpbmRlcicpO1xuSHVtYW5vaWQgPSByZXF1aXJlKCdodW1hbm9pZHMvaHVtYW5vaWQnKTtcblxuY2xhc3MgWm9tYmllIGV4dGVuZHMgSHVtYW5vaWQge1xuICBjb25zdHJ1Y3RvcihvcHRzKSB7XG4gICAgc3VwZXIob3B0cyk7XG4gICAgdGhpcy5zcGVlZCA9IFNldHRpbmdzLnpvbWJpZVNwZWVkO1xuICB9XG5cbiAgaXNBYmxlVG9CaXRlKGh1bWFuKXtcbiAgICByZXR1cm4gKFxuICAgICAgaHVtYW4gJiYgUGF0aGZpbmRlci5kaXN0YW5jZVRvKGh1bWFuLnBvc2l0aW9uLCB0aGlzLnBvc2l0aW9uKSA8IFNldHRpbmdzLnpvbWJpZUJpdGVSYW5nZVxuICAgICk7XG4gIH1cblxuICB0cmFuc2Zvcm0oKSB7XG4gICAgcmV0dXJuKHRoaXMpO1xuICB9XG5cbiAgaXNWYWxpZERlc3RpbmF0aW9uKGh1bWFub2lkcywgdGFyZ2V0UG9zaXRpb24pIHtcbiAgICByZXR1cm4gIWh1bWFub2lkcy5zb21lKChodW1hbm9pZCkgPT4ge1xuICAgICAgcmV0dXJuIFBhdGhmaW5kZXIuYXJlUG9zaXRpb25zRXF1YWwoaHVtYW5vaWQucG9zaXRpb24sIHRhcmdldFBvc2l0aW9uKTtcbiAgICB9KTtcbiAgfVxuXG4gIGdldE5leHREZXN0aW5hdGlvbihuZWFyZXN0TGl2aW5nSHVtYW5vaWQsIG5lYXJlc3Rab21iaWUpe1xuICAgIGxldCB6b21iaWVEaXN0YW5jZSwgbGl2aW5nSHVtYW5vaWREaXN0YW5jZTtcblxuICAgIGxpdmluZ0h1bWFub2lkRGlzdGFuY2UgPSBOdW1iZXIuUE9TSVRJVkVfSU5GSU5JVFk7XG4gICAgem9tYmllRGlzdGFuY2UgPSBOdW1iZXIuUE9TSVRJVkVfSU5GSU5JVFk7XG5cbiAgICBpZiAobmVhcmVzdFpvbWJpZSl7XG4gICAgICB6b21iaWVEaXN0YW5jZSA9IChcbiAgICAgICAgUGF0aGZpbmRlci5kaXN0YW5jZVRvKG5lYXJlc3Rab21iaWUucG9zaXRpb24sIHRoaXMucG9zaXRpb24pICpcbiAgICAgICAgU2V0dGluZ3Muem9tYmllU3ByZWFkXG4gICAgICApO1xuICAgIH1cblxuICAgIGlmIChuZWFyZXN0TGl2aW5nSHVtYW5vaWQpe1xuICAgICAgbGl2aW5nSHVtYW5vaWREaXN0YW5jZSA9IFBhdGhmaW5kZXIuZGlzdGFuY2VUbyhuZWFyZXN0TGl2aW5nSHVtYW5vaWQucG9zaXRpb24sIHRoaXMucG9zaXRpb24pO1xuICAgIH1cblxuICAgIGlmIChsaXZpbmdIdW1hbm9pZERpc3RhbmNlIDwgem9tYmllRGlzdGFuY2UpIHtcbiAgICAgIHJldHVybiB0aGlzLm1vdmVOZWFyZXN0KG5lYXJlc3RMaXZpbmdIdW1hbm9pZCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiB0aGlzLm1vdmVOZWFyZXN0KG5lYXJlc3Rab21iaWUpO1xuICAgIH1cbiAgfVxuXG4gIGhhbmRsZU5leHRNb3ZlKG9wdHMpe1xuICAgIGxldCBkZXN0aW5hdGlvbjtcbiAgICBsZXQgeyBuZWFyZXN0SHVtYW5vaWQsIG5lYXJlc3Rab21iaWUsIGh1bWFub2lkcyB9ID0gb3B0cztcblxuICAgIGlmICh0aGlzLmlzQWJsZVRvQml0ZShuZWFyZXN0SHVtYW5vaWQpKXtcbiAgICAgIGh1bWFub2lkc1tuZWFyZXN0SHVtYW5vaWQuaWRdID0gbmVhcmVzdEh1bWFub2lkLnRyYW5zZm9ybSgpO1xuICAgIH1cblxuICAgIGRlc3RpbmF0aW9uID0gUGF0aGZpbmRlci5nZXRSZWxhdGl2ZVBvc2l0aW9uKFxuICAgICAgdGhpcy5nZXROZXh0RGVzdGluYXRpb24obmVhcmVzdEh1bWFub2lkLCBuZWFyZXN0Wm9tYmllKVxuICAgICk7XG5cbiAgICBpZiAodGhpcy5pc1ZhbGlkRGVzdGluYXRpb24oaHVtYW5vaWRzLCBkZXN0aW5hdGlvbikpIHtcbiAgICAgIHRoaXMucG9zaXRpb24gPSBkZXN0aW5hdGlvbjtcbiAgICB9XG4gIH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBab21iaWU7XG4iLCJsZXQgR2FtZU9mQWZ0ZXJsaWZlLCBnYW1lT2ZBZnRlcmxpZmU7XG5cbkdhbWVPZkFmdGVybGlmZSA9IHJlcXVpcmUoJ2dhbWUnKTtcblxuZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2luaXRpYWxpemUtZ2FtZScpLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZnVuY3Rpb24oKXtcbiAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ292ZXJsYXknKS5jbGFzc05hbWUgPSAnaGlkZSc7XG4gIGdhbWVPZkFmdGVybGlmZSA9IG5ldyBHYW1lT2ZBZnRlcmxpZmUoKTtcbiAgZ2FtZU9mQWZ0ZXJsaWZlLmluaXQoKTtcbn0pO1xuIiwibGV0IFNldHRpbmdzO1xuXG5TZXR0aW5ncyA9IHJlcXVpcmUoJ3NldHRpbmdzJyk7XG5cbmNsYXNzIFBhdGhmaW5kZXIge1xuICBzdGF0aWMgZ2V0UmVsYXRpdmVQb3NpdGlvbihwb3NpdGlvbikge1xuICAgIGxldCB4LCB5O1xuXG4gICAgeCA9ICgocG9zaXRpb24ueCArIFNldHRpbmdzLmRlZmF1bHRXaWR0aCkgJSBTZXR0aW5ncy5kZWZhdWx0V2lkdGgpO1xuICAgIHkgPSAoKHBvc2l0aW9uLnkgKyBTZXR0aW5ncy5kZWZhdWx0SGVpZ2h0KSAlIFNldHRpbmdzLmRlZmF1bHRIZWlnaHQpO1xuICAgIHJldHVybiB7IHgsIHkgfTtcbiAgfVxuXG4gIHN0YXRpYyBhcmVQb3NpdGlvbnNFcXVhbChwb3NpdGlvbjEsIHBvc2l0aW9uMil7XG4gICAgcmV0dXJuIHBvc2l0aW9uMS54ID09PSBwb3NpdGlvbjIueCAmJiBwb3NpdGlvbjEueSA9PT0gcG9zaXRpb24yLnk7XG4gIH1cblxuICBzdGF0aWMgbW92ZVRvd2FyZHMoY3VycmVudFBvc2l0aW9uLCBmcmllbmRseUxvY2F0aW9uLCBzcGVlZCl7XG4gICAgbGV0IGRlbHRhWSwgZGVsdGFYLCBsZW5ndGg7XG5cbiAgICBkZWx0YVkgPSBmcmllbmRseUxvY2F0aW9uLnkgLSBjdXJyZW50UG9zaXRpb24ueTtcbiAgICBkZWx0YVggPSBmcmllbmRseUxvY2F0aW9uLnggLSBjdXJyZW50UG9zaXRpb24ueDtcbiAgICBsZW5ndGggPSB0aGlzLmRpc3RhbmNlVG8oZnJpZW5kbHlMb2NhdGlvbiwgY3VycmVudFBvc2l0aW9uKTtcbiAgICBpZiAoc3BlZWQgIT09IDAgJiYgbGVuZ3RoIDwgc3BlZWQpe1xuICAgICAgcmV0dXJuIGZyaWVuZGx5TG9jYXRpb247XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiB7XG4gICAgICAgIHg6IChjdXJyZW50UG9zaXRpb24ueCArIChkZWx0YVggLyBsZW5ndGggKiBzcGVlZCkpLFxuICAgICAgICB5OiAoY3VycmVudFBvc2l0aW9uLnkgKyAoZGVsdGFZIC8gbGVuZ3RoICogc3BlZWQpKVxuICAgICAgfTtcbiAgICB9XG4gIH1cblxuICBzdGF0aWMgbW92ZUF3YXlGcm9tKGN1cnJlbnRQb3NpdGlvbiwgaG9zdGlsZUxvY2F0aW9uLCBzcGVlZCl7XG4gICAgcmV0dXJuIHRoaXMubW92ZVRvd2FyZHMoY3VycmVudFBvc2l0aW9uLCBob3N0aWxlTG9jYXRpb24sIC1zcGVlZCk7XG4gIH1cblxuICBzdGF0aWMgbW92ZVBlcnBlbmRpY3VsYXJUbyhjdXJyZW50UG9zaXRpb24sIGZyaWVuZGx5TG9jYXRpb24sIHNwZWVkKXtcbiAgICBsZXQgZGVsdGFZLCBkZWx0YVgsIGxlbmd0aDtcblxuICAgIGRlbHRhWSA9IGZyaWVuZGx5TG9jYXRpb24ueSAtIGN1cnJlbnRQb3NpdGlvbi55O1xuICAgIGRlbHRhWCA9IGZyaWVuZGx5TG9jYXRpb24ueCAtIGN1cnJlbnRQb3NpdGlvbi54O1xuICAgIGxlbmd0aCA9IHRoaXMuZGlzdGFuY2VUbyhmcmllbmRseUxvY2F0aW9uLCBjdXJyZW50UG9zaXRpb24pO1xuICAgIGlmIChzcGVlZCAhPT0gMCAmJiBsZW5ndGggPCBzcGVlZCl7XG4gICAgICByZXR1cm4gZnJpZW5kbHlMb2NhdGlvbjtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIHtcbiAgICAgICAgeDogKGN1cnJlbnRQb3NpdGlvbi54ICsgKGRlbHRhWCAvIGxlbmd0aCAqIHNwZWVkKSksXG4gICAgICAgIHk6IChjdXJyZW50UG9zaXRpb24ueSAtIChkZWx0YVkgLyBsZW5ndGggKiBzcGVlZCkpXG4gICAgICB9O1xuICAgIH1cbiAgfVxuXG4gIHN0YXRpYyBkaXN0YW5jZVRvKHRhcmdldExvY2F0aW9uLCBjdXJyZW50UG9zaXRpb24pe1xuICAgIGxldCBkZWx0YVksIGRlbHRhWDtcblxuICAgIGRlbHRhWSA9IHRhcmdldExvY2F0aW9uLnkgLSBjdXJyZW50UG9zaXRpb24ueTtcbiAgICBkZWx0YVggPSB0YXJnZXRMb2NhdGlvbi54IC0gY3VycmVudFBvc2l0aW9uLng7XG4gICAgcmV0dXJuIE1hdGguc3FydChNYXRoLnBvdyhkZWx0YVksIDIpICsgTWF0aC5wb3coZGVsdGFYLCAyKSk7XG4gIH1cblxuICBzdGF0aWMgbW92ZVJhbmRvbWx5KGN1cnJlbnRQb3NpdGlvbiwgc3BlZWQpe1xuICAgIGxldCBhbmdsZTtcblxuICAgIGFuZ2xlID0gTWF0aC5yYW5kb20oKSAqIDIgKiBNYXRoLlBJO1xuICAgIHJldHVybiB7XG4gICAgICB4OiAoY3VycmVudFBvc2l0aW9uLnggKyBNYXRoLmNvcyhhbmdsZSkgKiBzcGVlZCksXG4gICAgICB5OiAoY3VycmVudFBvc2l0aW9uLnkgKyBNYXRoLnNpbihhbmdsZSkgKiBzcGVlZClcbiAgICB9O1xuICB9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gUGF0aGZpbmRlcjtcbiIsImxldCBTZXR0aW5ncztcblxuU2V0dGluZ3MgPSB7XG4gIGh1bWFuU3BlZWQ6IDcsXG4gIHBsYXllclNwZWVkOiA2LFxuICB6b21iaWVTcGVlZDogNCxcbiAgaHVtYW5Db3VudDogMzAsXG4gIHpvbWJpZUNvdW50OiAzLFxuICBpbmZlY3Rpb25JbmN1YmF0aW9uVGltZTogNSwgLy8gdHVybiBkZWxheSB1bnRpbCBpbmZlY3RlZCBiZWNvbWUgem9tYmllcy4gaGlnaGVyIG51bWJlcnMgdGFrZVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gbG9uZ2VyIHRvIHRyYW5zZm9ybVxuICB0dXJuRGVsYXk6IHsgbm9ybWFsOiAxMDAsIGZhc3Q6IDI1IH0sIC8vIHNldHMgdGhlIHRpbWVvdXQgYmV0d2VlbiB0dXJuc1xuICByZXBpdGlvblRvbGVyYW5jZTogMSwgLy8gdGhlIHJhbmdlIGluIHdoaWNoIGEgbW92ZSBpcyBjb25zaWRlcmVkIHJlcGV0aXRpdmVcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIGxvd2VyIHZhbHVlcyB3aWxsIHJlZHVjZSB0aGUgc2l6ZSBvZiB0aGUgcmFuZ2UuXG4gIHpvbWJpZVNwcmVhZDogMywgLy8gbG93ZXIgem9tYmllU3ByZWFkIHZhbHVlcyB3aWxsIGNhdXNlIHpvbWJpZXMgdG8gc3ByZWFkIG91dCBtb3JlXG4gIGh1bWFuRmVhclJhbmdlOiAyMCwgLy8gdGhlIHJhbmdlIGF0IHdoaWNoIGh1bWFucyBzdGFydCBydW5uaW5nIGZyb20gem9tYmllcy5cbiAgem9tYmllQml0ZVJhbmdlOiAxMCwgLy8gdGhlIHJhbmdlIGF0IHdoaWNoIGEgem9tYmllIGNhbiBiaXRlIGEgaHVtYW4uXG5cbiAgLy8gVE9ETzogU3luYyBjYW52YXMgd2l0aCB0aGlzIHZhbHVlXG4gIGRlZmF1bHRXaWR0aDogNjAwLCAvLyBkZWZhdWx0IGNhbnZhcyB3aWR0aFxuICBkZWZhdWx0SGVpZ2h0OiA0MDAsIC8vIGRlZmF1bHQgY2FudmFzIGhlaWdodFxufTtcblxubW9kdWxlLmV4cG9ydHMgPSBTZXR0aW5ncztcbiJdfQ==
