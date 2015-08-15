let path,
    JS_BASE_DIR,
    STYLES_BASE_DIR,
    SASS_BASE_DIR,
    VENDOR_ROOT;

path = require('path');

JS_BASE_DIR = 'public/js';
STYLES_BASE_DIR = 'public/style';
SASS_BASE_DIR = 'public/style/sass';
VENDOR_ROOT = 'node_modules';

function displayError(error){
  let errorMessage;
  errorMessage = `[${error.plugin}] ${error.message.replace('\n','')}`;
  if(error.fileName){
    errorMessage += ` in ${error.fileName}`;
  }
  if(error.lineNumber){
    errorMessage += ` on line ${error.lineNumber}`;
  }
  console.error(errorMessage);
}

module.exports = {
  build: JS_BASE_DIR,
  displayError,
  entries: ['game/initialize.js'],
  includes: ['./', 'game/'],
  stylesRoot: STYLES_BASE_DIR,
  sassFiles: `${SASS_BASE_DIR}/**/*.scss`,
  jsRoot: JS_BASE_DIR,
  jsVendor: VENDOR_ROOT,
  root: JS_BASE_DIR
}

