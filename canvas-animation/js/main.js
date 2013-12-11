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

  var color = new Color([ 255, 20, 30, 1 ]);
  if ( color.get( 'red'   ) !== 255 ||
       color.get( 'green' ) !==  20 ||
       color.get( 'blue'  ) !==  30 ||
       color.get( 'alpha' ) !==   1 ) {
    console.log( 'Incorrect initializion of Color.' );
  }

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
    angle: 20,
    scaleX: 3,
    lineWidth: 4,
    fill: [ 0, 0, 128, 1 ],
    stroke: [ 0, 0, 255, 1 ]
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
    stroke: [ 255, 0, 0, 1 ]
  });

  group.add( path );

  editorView.render();

  var PathEditView = require( 'geometry/views/path-edit-view' );
  var pathEditView = new PathEditView({
    el: '#path-edit-view',
    canvas: editorCanvas,
    model: path
  });

  pathEditView.render();

  editorCanvas.addEventListener( 'mousedown', function( event ) {
    var x = event.pageX - editorCanvas.offsetLeft,
        y = event.pageY - editorCanvas.offsetTop;

    var rectContains = rect.contains( editorCanvas.getContext( '2d' ), x, y );
    var pathContains = path.contains( editorCanvas.getContext( '2d' ), x, y );

    console.log( 'rect: ' + rectContains + ', path: ' + pathContains );
  });

  setInterval(function() {
    path.set( 'interpolation', path.get( 'interpolation' ) === 1 ? 0 : 1 );
    editorView.render();
  }, 500 );

  setInterval(function() {
    path.set( 'closed', !path.get( 'closed' ) );
    editorView.render();
  }, 1000 );
});
