import merge from 'webpack-merge';
import path from 'path';
import initialization from './initialization';
import Until from './Util';
import Style from './Style';
import lint from './Lint';


/**
 * The context of your application.
 * Point this to your source directory.
 * @type {String}
 */
const CONTEXT = path.join(__dirname, './app');


/**
 * The port number use on webpack-dev-server.
 * @type {number}
 */
const DEV_SERVER_PORT = 8100;


/**
 * Entry point of your application.
 * Point this to your entry js file or you can have multiple entry point.
 * @type {{ENTRY_NAME: String[]}}
 */
const ENTRY = {
  app: [
    './js/index.js'
  ]
};


/**
 * Output file path.
 * Point to your output directory.
 * @type {String}
 */
const OUTPUT_PATH = path.join(__dirname, 'dist');


/**
 * Public path of your application.
 * Point to your full website URL.
 * @type {String}
 */
const PUBLIC_PATH = 'http://jafoteng.co/mfs/';


/**
 * Alias of the webpack in your application.
 * Point to the module that you would like to have a short name.
 * @type {{SHORT_NAME: String}}
 */
const ALIAS = {
  materialize: path.resolve(__dirname, 'app/vendors/materialize/js/bin/materialize.js'),
  hammerjs: path.resolve(__dirname, 'app/vendors/materialize/js/hammer.min.js')
};


/**
 * Enable postcss prefix wrap for black board development.
 * @type {boolean}
 */
const POSTCSS_PREFIXWRAP = {
  enablePostcssPrefixWrap: true,
  prefixClassName: '.module-0-sub'
};


/**
 * Extra scss resources you want the webpack to recognize during the bundling.
 * Point to the directories that contain the extra scss file.
 * @type {String[]}
 */
const EXTRA_SCSS_RESOURCES = [
  path.resolve(__dirname, "node_modules/compass-mixins/lib"),
  path.resolve(__dirname, "app/vendors/materialize/sass")
];


/**
 * Sass resource which will be read in every css module. Only required when you are using CSS module.
 * Point to the scss file you would like to be read.
 * @type {String[]}
 */
const SASS_RESOURCES = [path.resolve(__dirname, "app/scss/app.scss")];


/**
 * Basic webpack configuration for your application.
 * @param {String} env - 'development' or 'production'
 * @returns {{}} - configuration of the webpack
 */
const base = function(env) {
  const style = new Style(POSTCSS_PREFIXWRAP);
  const cssConfig = {
    env,
    filter: '',
    path: [],
    extraResources: EXTRA_SCSS_RESOURCES
  };
  return (
    merge(
      initialization(env, CONTEXT, ENTRY, OUTPUT_PATH, PUBLIC_PATH, ALIAS, DEV_SERVER_PORT),
      (env === 'development' ? style.extractSCSStoCSS(cssConfig) : style.extractSCSStoCSS(cssConfig))
    )
  );
};



let config;
switch (process.env.npm_lifecycle_event) {
  case 'build:prod':
    config = merge(
      base('production'),
      Until.clean('dist'),
      Until.setEnvironmentVariable({
        NODE_ENV: 'production'
      }),
      Until.extractJSBundle({
        name: 'vendor',
        entries: ['jquery']
      }),
      Until.optimize()
    );
    break;
  case 'build:dev':
    config = merge(
      base('development'),
      {
        devtool: 'inline-source-map'
      }
    );
    break;
  default:
    config = merge(
      base('development'),
      {
        devtool: 'inline-source-map'
      },
      Until.devServer({
        // Customize host/port here if needed
        host: 'localhost',
        port: DEV_SERVER_PORT
      })
    );
}

module.exports = config;
