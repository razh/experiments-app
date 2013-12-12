/*globals define*/
define([
  'underscore',
  'backbone',
  'models/color'
], function( _, Backbone, Color ) {
  'use strict';

  var Object2D = Backbone.Model.extend({
    defaults: function() {
      return {
        x: 0,
        y: 0,

        angle: 0,

        scaleX: 1,
        scaleY: 1,

        fill: new Color(),
        stroke: new Color(),
        lineWidth: 1,

        zIndex: 0
      };
    },

    constructor: function() {
      var attributes = arguments[0];

      [ 'fill', 'stroke' ].forEach(function( property ) {
        if ( _.isArray( attributes[ property ] ) ) {
          attributes[ property ] = new Color( attributes[ property ] );
        }
      });

      Backbone.Model.apply( this, arguments );

      [ 'fill', 'stroke' ].forEach(function( property ) {
        this.listenTo( this.get( property ), 'change', function() {
          this.trigger( 'change' );
        }.bind( this ));
      }.bind( this ));
    },

    draw: function( ctx ) {
      ctx.save();

      this.applyTransform( ctx );
      this.drawPath( ctx );

      ctx.restore();

      var fill = this.get( 'fill' ),
          stroke = this.get( 'stroke' ),
          lineWidth = this.get( 'lineWidth' );

      if ( fill && fill.get( 'alpha' ) ) {
        ctx.fillStyle = fill.rgba();
        ctx.fill();
      }

      if ( lineWidth && stroke && stroke.get( 'alpha' ) ) {
        ctx.lineWidth = lineWidth;
        ctx.strokeStyle = stroke.rgba();
        ctx.stroke();
      }
    },

    drawPath: function( ctx ) {
      // Draw an empty path so .contains() doesn't use the last drawn path.
      ctx.beginPath();
      ctx.closePath();
    },

    applyTransform: function( ctx ) {
      ctx.translate( this.get( 'x' ), this.get( 'y' ) );
      ctx.rotate( -this.get( 'angle' ) );
      ctx.scale( this.get( 'scaleX' ), this.get( 'scaleY' ) );
    },

    contains: function( ctx, x, y ) {
      ctx.save();
      this.applyTransform( ctx );
      this.drawPath( ctx );
      ctx.restore();

      return ctx.isPointInPath( x, y );
    },

    toLocal: function( x, y ) {
      x -= this.get( 'x' );
      y -= this.get( 'y' );

      var angle = this.get( 'angle' );
      var cos, sin;
      var rx, ry;

      if ( angle ) {
        cos = Math.cos( angle );
        sin = Math.sin( angle );

        rx = cos * x - sin * y;
        ry = sin * x + cos * y;

        x = rx;
        y = ry;
      }

      return {
        x: x / this.get( 'scaleX' ),
        y: y / this.get( 'scaleY' )
      };
    },

    toWorld: function( x, y ) {
      x *= this.get( 'scaleX' );
      y *= this.get( 'scaleY' );

      var angle = this.get( 'angle' );
      var cos, sin;
      var rx, ry;

      if ( angle ) {
        cos = Math.cos( -angle );
        sin = Math.sin( -angle );

        rx = cos * x - sin * y;
        ry = sin * x + cos * y;

        x = rx;
        y = ry;
      }

      return {
        x: x + this.get( 'x' ),
        y: y + this.get( 'y' )
      };
    }
  });

  return Object2D;
});
