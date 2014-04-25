/*globals requirejs, define*/
requirejs.config({
  paths: {
    'backbone': '../../app/bower_components/backbone/backbone',
    'jquery': '../../app/bower_components/jquery/dist/jquery',
    'underscore': '../../app/bower_components/underscore/underscore',
    'text': '../../app/bower_components/requirejs-text/text'
  }
});

define(function( require ) {
  'use strict';

  var Utils = require( 'utils' );

  var Group = require( 'geometry/collections/group' );
  var Editor = require( 'models/editor' );
  var EditorView = require( 'views/editor-view' );

  var Arc = require( 'geometry/models/arc' );
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

  var arc = new Arc({
    x: 100,
    y: 400,
    radius: 50,
    startAngle: 20 * Utils.DEG_TO_RAD,
    endAngle: 180 * Utils.DEG_TO_RAD,
    fill: [ 200, 150, 192, 1 ],
    stroke: [ 64, 0, 64, 1 ]
  });

  group.add( arc );

  editorView.render();

  console.log( JSON.stringify( editorView.renderIntercept() ) );

  // Load saved groups.
  (function() {
    var groups = editorView.getStoredGroups();

    // Load last group if it has anything in it.
    if ( groups.length ) {
      var lastGroup = groups[ groups.length - 1 ];
      if ( lastGroup.length ) {
        editorView.collection.reset( lastGroup );
      }
    }
  }) ();

  // Create GroupView.
  var GroupView = require( 'geometry/views/group-view' );

  var groupView = new GroupView({
    el: '#group-view',
    collection: group,
    objectEl: '#group-object2d-view',
    selectedIndex: 0
  });

  groupView.render();

  window.addEventListener( 'beforeunload', function() {
    if ( editorView.collection.length ) {
      var groups = editorView.getStoredGroups();

      // Maximum history of 5.
      while ( groups.length > 4 ) {
        groups.shift();
      }

      window.localStorage.setItem( 'groups', JSON.stringify( groups ) );
      editorView.saveToStorage();
    }
  });
});
