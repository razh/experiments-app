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

  var Utils = require( 'utils' );

  var Group = require( 'geometry/collections/group' );
  var Editor = require( 'models/editor' );
  var EditorView = require( 'views/editor-view' );

  var Color = require( 'models/color' );
  var Circle = require( 'geometry/models/circle' );
  var Path = require( 'geometry/models/path' );
  var Rect = require( 'geometry/models/rect' );

  var editorCanvas = document.getElementById( 'editor' );

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
    angle: 20 * Utils.DEG_TO_RAD,
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
      50, -50,
      70, 30,
      90, 0,
      120, 90,
      90, 90
    ],
    lineWidth: 2,
    stroke: [ 255, 0, 0, 1 ]
  });

  group.add( path );

  var circle = new Circle({
    x: 320,
    y: 180,
    radius: 30,
    lineWidth: 2,
    fill: [ 192, 192, 255, 0.8 ],
    stroke: [ 0, 0, 0, 0.8 ],
    zIndex: -1
  });

  group.add( circle );

  editorView.render();

  var PathEditView = require( 'geometry/views/path-edit-view' );
  var pathEditView = new PathEditView({
    el: '#path-edit-view',
    canvas: editorCanvas,
    model: path
  });

  pathEditView.render();

  var Object2DView = require( 'geometry/views/object2d-view' );
  var object2dView = new Object2DView({
    el: '#object2d-view',
    model: path
  });

  object2dView.render();

  var RectView = require( 'geometry/views/rect-view' );
  var rectView = new RectView({
    el: '#rect-view',
    model: rect
  });

  rectView.render();

  var CircleView = require( 'geometry/views/circle-view' );
  var circleView = new CircleView({
    el: '#circle-view',
    model: circle
  });

  circleView.render();

  var PathView = require( 'geometry/views/path-view' );
  var pathView = new PathView({
    el: '#path-view',
    model: path
  });

  pathView.render();


  editorCanvas.addEventListener( 'mousedown', function( event ) {
    var x = event.pageX - editorCanvas.offsetLeft,
        y = event.pageY - editorCanvas.offsetTop;

    var rectContains = rect.contains( editorCanvas.getContext( '2d' ), x, y );
    var pathContains = path.contains( editorCanvas.getContext( '2d' ), x, y );

    console.log( 'rect: ' + rectContains + ', path: ' + pathContains );
  });

  var interpInterval = setInterval(function() {
    path.set( 'interpolation', path.get( 'interpolation' ) === 1 ? 0 : 1 );
  }, 500 );

  // There's a math joke here.
  var closedInterval = setInterval(function() {
    path.set( 'closed', !path.get( 'closed' ) );
  }, 1000 );

  // Continuously draw closed quadratic Path.
  document.addEventListener( 'keydown', function( event ) {
    if ( event.which === 32 ) {
      clearInterval( interpInterval );
      clearInterval( closedInterval );

      path.set({
        interpolation: Path.Interpolation.QUADRATIC,
        closed: true
      });
    }
  });

  console.log( JSON.stringify( editorView.renderIntercept() ) );

  var GroupView = require( 'geometry/views/group-view' );

  var groupView = new GroupView({
    el: '#group-view',
    collection: group,
    objectEl: '#group-object2d-view',
    selectedIndex: 0
  });

  groupView.render();
});
