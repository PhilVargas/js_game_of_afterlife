#ChangeLog

## v2.0.1 (08/17/2015)
  ### New Features
  - Add game overlay that allows the user to start and restart the game
  - Depricate alert on game end in favor of displaying the game over message on the overlay
  ### Bugfixes
  - Fix issue with humanoid ids: humanoid ids now properly correspond to the number of humanoids
      created
  - Fix Edge case if only 1 zombie is created: game no longer breaks if the settings specify only 1
      zombie
  - add changelog

## v2.0.0 (08/2015)
  ### New Features
  - Convert to ES6
  - Convert Test Suite from Jasmine to Mocha/Chai
  - Utilize Sass for styling
  - Utilize Gulp for asset compilation and transformation

## v1.2.0
  - Add playable Character
