/*jshint camelcase:false*/
/*globals requirejs, beforeEach, require, jasmine*/
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

// Canvas testing methods:
// Jasmine spy.
var ctxSpy;
// An alternative to Jasmine spies that keeps track of call order.
var ctx = {
  calls: []
};

require([
  'underscore'
], function( _ ) {
  'use strict';

  var canvas = document.createElement( 'canvas' );
  var context = canvas.getContext( '2d' );

  var canvasFunctions = _.functions( context );

  ctxSpy = jasmine.createSpyObj( 'ctxSpy', canvasFunctions );

  // Create ctx with canvas keys tracking.
  _.keys( context ).forEach(function( property ) {
    Object.defineProperty( ctx, property, {
      get: function() {
        return ctx[ '_' + property ];
      },

      set: function( value ) {
        ctx.calls.push( [ property, value ] );
        ctx[ '_' + property ] = value;
      }
    });
  });

  // Track canvas functions.
  canvasFunctions.forEach(function( functionName ) {
    ctx[ functionName ] = function() {
      ctx.calls.push( [ functionName ].concat( _.toArray( arguments ) ) );
    };
  });
});