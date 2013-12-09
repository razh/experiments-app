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
  });
  rect.get( 'fill' ).set({
    blue: 255,
    alpha: 1
  });
  group.add( rect );

  editorView.render();
});
