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

  var Circle = require( 'geometry/models/circle' );
  var Path = require( 'geometry/models/path' );
  var Rect = require( 'geometry/models/rect' );

  var editorCanvas = document.getElementById( 'editor' );

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
