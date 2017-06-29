const JS_BASE_DIR = 'public/js';
const STYLES_BASE_DIR = 'public/style';
const JS_DEPLOY_DIR = 'dist/public/js';
const STYLES_DEPLOY_DIR = 'dist/public/style';
const SASS_BASE_DIR = 'public/style/sass';
const VENDOR_ROOT = 'node_modules';

const config = {
  build: JS_BASE_DIR,
  entries: ['game/initialize.js'],
  includes: [
    './',
    'game/'
  ],
  stylesRoot: STYLES_BASE_DIR,
  stylesDeployRoot: STYLES_DEPLOY_DIR,
  sassFiles: `${SASS_BASE_DIR}/**/*.scss`,
  jsFiles: [
    `${JS_BASE_DIR}/**/*.js`,
    `!${JS_BASE_DIR}/bundle.js`
  ],
  jsRoot: JS_BASE_DIR,
  jsDeployRoot: JS_DEPLOY_DIR,
  jsVendor: VENDOR_ROOT,
  root: JS_BASE_DIR
};

export { config as default };
