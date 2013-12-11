/*globals define*/
define([
  'underscore',
  'backbone'
], function( _, Backbone ) {
  'use strict';

  var EditorView = Backbone.View.extend({
    initialize: function() {
      _.bindAll( this, 'render' );

      this.ctx = this.el.getContext( '2d' );
    },

    drawObjects: function( ctx ) {
      this.collection.sortBy( 'zIndex' ).forEach(function( object ) {
        object.draw( ctx );
      });
    },

    drawGrid: function() {},

    render: function() {
      var ctx = this.ctx;

      ctx.clearRect( 0, 0, ctx.canvas.width, ctx.canvas.height );

      this.drawGrid( ctx );
      this.drawObjects( ctx );
    }
  });

  return EditorView;
});
