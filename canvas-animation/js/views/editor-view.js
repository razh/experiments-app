/*globals define*/
define([
  'underscore',
  'backbone'
], function( _, Backbone ) {
  'use strict';

  var EditorView = Backbone.View.extend({
    events: {
      mousedown: 'onMouseDown',
      mousemove: 'onMouseMove',
      mouseup: 'onMouseUp'
    },

    initialize: function() {
      _.bindAll( this,
        'render',
        'onMouseDown',
        'onMouseMove',
        'onMouseUp'
      );

      this.mouse = {
        x: 0,
        y: 0
      };

      this.selected = null;
      this.offset = {
        x: 0,
        y: 0
      };

      this.el.width = this.model.get( 'width' );
      this.el.height = this.model.get( 'height' );

      this.ctx = this.el.getContext( '2d' );
    },

    drawObjects: function( ctx ) {
      this.collection.sortBy( 'zIndex' ).forEach(function( object ) {
        object.draw( ctx );
      });
    },

    drawGrid: function( ctx, spacing ) {
      var width  = ctx.canvas.width,
          height = ctx.canvas.height;

      var halfWidth  = 0.5 * width,
          halfHeight = 0.5 * height;

      var xCount = width  / spacing,
          yCount = height / spacing;

      ctx.beginPath();

      var i;
      // vertical lines.
      for ( i = 0; i <= xCount; i++ ) {
        ctx.moveTo( i * spacing, 0 );
        ctx.lineTo( i * spacing, height );
      }

      // Horizontal lines.
      for ( i = 0; i <= yCount; i++ ) {
        ctx.moveTo( 0, i * spacing );
        ctx.lineTo( width, i * spacing );
      }

      ctx.lineWidth = 0.5;
      ctx.strokeStyle = '#222';
      ctx.stroke();

      // Draw center lines.
      ctx.beginPath();

      // Vertical.
      ctx.moveTo( halfWidth, 0 );
      ctx.lineTo( halfWidth, height );

      // Horizontal.
      ctx.moveTo(     0, halfHeight );
      ctx.lineTo( width, halfHeight );

      ctx.lineWidth = 1;
      ctx.stroke();
    },

    render: function() {
      var ctx = this.ctx;

      var width  = ctx.canvas.width,
          height = ctx.canvas.height;

      ctx.clearRect( 0, 0, width, height );

      ctx.save();

      this.drawGrid( ctx, 16 );
      this.drawObjects( ctx );

      ctx.restore();
    },

    /**
     * Intercept canvas calls.
     */
    renderIntercept: function() {
      var calls = [];

      var ctx = {};
      _.functions( this.ctx ).forEach(function( functionName ) {
        ctx[ functionName ] = function() {
          calls.push( [ functionName ].concat( _.toArray( arguments ) ) );
        };
      });

      this.drawObjects( ctx );

      return calls;
    },

    mousePosition: function( event ) {
      this.mouse.x = event.pageX - this.el.offsetLeft;
      this.mouse.y = event.pageY - this.el.offsetTop;
    },

    onMouseDown: function( event ) {
      this.mousePosition( event );
      this.mouse.down = true;

      var ctx = this.ctx;
      var x = this.mouse.x,
          y = this.mouse.y;

      var selected = this.collection.find(function( model ) {
        return model.contains( ctx, x, y );
      });

      if ( selected ) {
        this.selected = selected;
        this.offset.x = selected.get( 'x' ) - x;
        this.offset.y = selected.get( 'y' ) - y;
      }
    },

    onMouseMove: function( event ) {
      this.mousePosition( event );

      if ( this.mouse.down && this.selected ) {
        this.selected.set({
          x: this.mouse.x + this.offset.x,
          y: this.mouse.y + this.offset.y
        });
      }
    },

    onMouseUp: function() {
      this.mouse.down = false;

      this.selected = null;
      this.offset.x = 0;
      this.offset.y = 0;
    }
  });

  return EditorView;
});
