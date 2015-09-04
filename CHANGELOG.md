#ChangeLog
## v2.0.2 (09/04/2015)
#### Non-User-Facing Features
  - Convert `humanoid.js` into a super class from which all other `humanType`'s inherit.
  - Heavily refactor `board#nextTurn` by extracting functionality out into the new `humanType`
      classes
  - Extract various constants out into the settings. e.g. canvas `width`/`height`, transformation
      time of `infectedHumans`.
  - Move various arbitrary calculations into the `Pathfinder` module.
  - Add `eslint` and lint approptiately.  
  
#### New Features
  
#### Bugfixes

## v2.0.1 (08/17/2015)
#### New Features
  - Add game overlay that allows the user to start and restart the game
  - Depricate alert on game end in favor of displaying the game over message on the overlay
#### Bugfixes
  - Fix issue with humanoid ids: humanoid ids now properly correspond to the number of humanoids
      created
  - Fix Edge case if only 1 zombie is created: game no longer breaks if the settings specify only 1
      zombie
  - add changelog
  
  
## v2.0.0 (08/2015)  
#### New Features
  - Convert to ES6
  - Convert Test Suite from Jasmine to Mocha/Chai
  - Utilize Sass for styling
  - Utilize Gulp for asset compilation and transformation

## v1.2.0
  - Add playable Character
