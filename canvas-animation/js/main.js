/*globals requirejs, define*/
requirejs.config({
  shim: {
    'underscore': {
      exports: '_'
    },
    'backbone': {
      deps: [ 'jquery', 'underscore' ],
      exports: 'Backbone'
    }
  },

  paths: {
    'backbone': '../../app/components/backbone/backbone-min',
    'jquery': '../../app/components/jquery/jquery.min',
    'underscore': '../../app/components/underscore/underscore-min',
    'text': '../../app/components/requirejs-text/text'
  }
});

define(function( require ) {
  'use strict';

  var Group = require( 'geometry/collections/group' );
  var Editor = require( 'models/editor' );
  var EditorView = require( 'views/editor-view' );

  var Color = require( 'models/color' );
  var Path = require( 'geometry/models/path' );
  var Rect = require( 'geometry/models/rect' );

  var editorCanvas = document.getElementById( 'editor' );
  editorCanvas.width  = 640;
  editorCanvas.height = 480;

  var editorView = new EditorView({
    el: editorCanvas,
    model: new Editor(),
    collection: new Group()
  });

  var group = editorView.collection;

  var rect = new Rect({
    x: 100,
    y: 200,
    width: 80,
    height: 60,
    lineWidth: 4,
    fill: new Color({ red: 0, green: 0, blue: 128, alpha: 1 }),
    stroke: new Color({ red: 0, green: 0, blue: 255, alpha: 1 })
  });

  group.add( rect );

  var path = new Path({
    x: 300,
    y: 200,
    points: [
      10, 10,
      50, 20,
      70, 30,
      90, 0,
      120, 90,
      90, 90
    ],
    lineWidth: 2,
    stroke: new Color({ red: 255, green: 0, blue: 0, alpha: 1 })
  });

  group.add( path );

  editorView.render();

  setInterval(function() {
    path.set( 'interpolation', path.get( 'interpolation' ) === 1 ? 0 : 1 );
    editorView.render();
  }, 500 );
});
