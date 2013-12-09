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

    renderObjects: function( ctx ) {
      this.collection.each(function( object ) {
        object.draw( ctx );
      });
    },

    render: function() {
      var ctx = this.ctx;

      ctx.clearRect( 0, 0, ctx.canvas.width, ctx.canvas.height );

      this.renderObjects( ctx );
    }
  });

  return EditorView;
});
