/*jshint camelcase:false*/
/*globals requirejs*/
// Add all specs to tests.
var tests = [];
for ( var file in window.__karma__.files ) {
  if ( /Spec\.js$/.test( file ) ) {
    tests.push( file );
  }
}

requirejs.config({
  baseUrl: '/base/canvas-animation/js/',

  shim: {
    'underscore': {
      exports: '_'
    },
    'backbone': {
      deps: [ 'jquery', 'underscore' ],
      exports: 'Backbone'
    }
  },


  // Use un-minified files unlike main.js.
  paths: {
    'backbone': '../../app/components/backbone/backbone',
    'jquery': '../../app/components/jquery/jquery',
    'underscore': '../../app/components/underscore/underscore',
    'text': '../../app/components/requirejs-text/text'
  },

  // Load the test specs.
  deps: tests,

  callback: window.__karma__.start
});
